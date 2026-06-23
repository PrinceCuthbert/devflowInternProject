import React, { useState } from 'react';
import { useAuth } from '../auth/AuthProvider';

function Login() {
    const { login, register } = useAuth();
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (isLoginMode) {
                await login(username, password);
            } else {
                await register(username, password);
            }
        } catch (err) {
            setError(err.response?.data?.error || "An error occurred. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-[#f4f5f8] flex items-center justify-center p-6 font-sans">
            <div className="bg-white w-full max-w-[400px] rounded-[24px] p-10 shadow-[0_20px_40px_rgba(0,0,0,0.04)]">
                <h1 className="text-2xl font-extrabold text-gray-800 mb-2 text-center tracking-tight">
                    {isLoginMode ? 'Welcome Back' : 'Create Account'}
                </h1>
                <p className="text-gray-400 text-sm text-center mb-8">
                    {isLoginMode ? 'Enter your credentials to access your projects.' : 'Sign up to start managing your workflow.'}
                </p>

                {error && (
                    <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm font-medium mb-6 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-[#f9fafb] border border-gray-100 py-3 px-4 rounded-xl outline-none text-gray-800 placeholder-gray-400 font-medium focus:border-violet-300 focus:ring-2 focus:ring-violet-100 transition-all"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-[#f9fafb] border border-gray-100 py-3 px-4 rounded-xl outline-none text-gray-800 placeholder-gray-400 font-medium focus:border-violet-300 focus:ring-2 focus:ring-violet-100 transition-all"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-[#8b5cf6] hover:bg-[#7c3aed] text-white py-3 rounded-xl font-bold shadow-sm transition-all duration-200 mt-2"
                    >
                        {isLoginMode ? 'Sign In' : 'Sign Up'}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                    {isLoginMode ? "Don't have an account? " : "Already have an account? "}
                    <button
                        onClick={() => setIsLoginMode(!isLoginMode)}
                        className="text-violet-600 font-bold hover:underline"
                    >
                        {isLoginMode ? 'Register' : 'Log in'}
                    </button>
                </p>
            </div>
        </div>
    );
}

export default Login;