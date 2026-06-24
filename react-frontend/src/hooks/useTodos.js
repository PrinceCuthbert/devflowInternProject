import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthProvider";
import { io } from "socket.io-client";

// 🛒 Import Apollo Client hooks and your fresh query manifest
import { useQuery, useMutation } from "@apollo/client/react";
import {
  GET_MY_PROJECTS,
  CREATE_PROJECT,
  UPDATE_PROJECT,
  DELETE_PROJECT,
} from "../service/graphqlQueries.js";

function useTodos() {
  const [tasks, setTasks] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [socketError, setSocketError] = useState(null);
  const { user } = useAuth();

  // 📡 A. Run declarative query (Automatically executes if user is authenticated)
  //   const { loading } = useQuery(GET_MY_PROJECTS, {
  //     skip: !user, // Security flag: Don't execute if user session isn't loaded yet
  //     onCompleted: (data) => {
  //       setTasks(data.myProjects); // Sync GraphQL cache directly into your UI list state
  //     },
  //     onError: (error) => {
  //       console.error("GraphQL Query Fetch Error:", error);
  //     },
  //   });

  // 📡 A. Run declarative query reactively
  const { loading, data, error } = useQuery(GET_MY_PROJECTS, {
    skip: !user,
    fetchPolicy: "cache-and-network", // Ensures local cache returns instantly, then hits backend
  });

  // 🔄 Synchronize Apollo cache updates directly into local rendering state
  useEffect(() => {
    if (data?.myProjects) {
      setTasks(data.myProjects);
    }
  }, [data]);

  // 🏗️ B. Bind structural mutation write channels
  const [executeCreate] = useMutation(CREATE_PROJECT);
  const [executeUpdate] = useMutation(UPDATE_PROJECT);
  const [executeDelete] = useMutation(DELETE_PROJECT);

  // 🔌 REAL-TIME WEBSOCKET PIPELINE EFFECT (Kept fully operational!)
  useEffect(() => {
    if (!user) return;

    const socket = io("http://localhost:5000");

    socket.on("connect", () => {
      setSocketError(null);
      console.log("⚡ Connected to WebSocket Server! ID:", socket.id);
    });

    socket.on("connect_error", () => {
      setSocketError(
        "Backend connection failed. Start your server and refresh.",
      );
    });

    socket.on("project_created", (newProject) => {
      if (newProject.userId == user.id) {
        setTasks((prevTasks) => {
          const filtered = prevTasks.filter((t) => t.id != newProject.id);
          return [...filtered, newProject];
        });
      }
    });

    socket.on("project_updated", (updatedProject) => {
      if (updatedProject.userId == user.id) {
        setTasks((prevTasks) =>
          prevTasks.map((t) =>
            t.id == updatedProject.id ? updatedProject : t,
          ),
        );
      }
    });

    socket.on("project_deleted", ({ id, userId }) => {
      if (userId == user.id) {
        setTasks((prevTasks) => prevTasks.filter((t) => t.id != id));
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  // 💾 SAVE / EDIT TASK ACTION
  const saveTask = async (name) => {
    if (!name.trim()) return;

    try {
      if (editingId) {
        const currentTask = tasks.find((t) => t.id == editingId);
        const currentStatus = currentTask ? currentTask.status : "pending";

        // Dispatch mutation passing clean typed operational variables
        await executeUpdate({
          variables: { id: editingId, name, status: currentStatus },
        });
        setEditingId(null);
      } else {
        await executeCreate({
          variables: { name },
        });
      }
    } catch (error) {
      console.error("Mutation failed during save operation:", error);
    }
  };

  // 🗑️ REMOVE TASK ACTION
  const removeTask = async (id) => {
    try {
      await executeDelete({
        variables: { id },
      });
      if (editingId === id) setEditingId(null);
    } catch (error) {
      console.error("Mutation failed during delete operation:", error);
    }
  };

  // ✅ TOGGLE STATUS ACTION
  const toggleTaskStatus = async (task) => {
    try {
      const nextStatus = task.status === "completed" ? "pending" : "completed";

      await executeUpdate({
        variables: { id: task.id, name: task.name, status: nextStatus },
      });
    } catch (error) {
      console.error("Mutation failed during toggle status operation:", error);
    }
  };

  return {
    tasks,
    loading, // Controlled dynamically by useQuery's loading lifecycle flag!
    error: error?.message || socketError,
    editingId,
    setEditingId,
    saveTask,
    removeTask,
    toggleTaskStatus,
  };
}

export default useTodos;
