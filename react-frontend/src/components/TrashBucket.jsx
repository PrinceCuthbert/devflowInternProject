import React, { useState } from 'react';


function TrashBucket({ onDropTask }) {
    const [isDragActive, setIsDragActive] = useState(false);

    const handleDragOver = (e) => {
        e.preventDefault(); // Required to allow drop
        if (!isDragActive) setIsDragActive(true);
    };

    const handleDragLeave = () => setIsDragActive(false);

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragActive(false);
        const taskId = e.dataTransfer.getData('text/plain');
        if (taskId) onDropTask(parseInt(taskId, 10));
    };

    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-[20px] transition-all duration-300 min-h-[160px] mt-2
        ${isDragActive ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-transparent'}`}
        >
            <p className={`mb-4 font-semibold text-sm transition-colors duration-300 ${isDragActive ? 'text-red-500' : 'text-gray-400'}`}>
                {isDragActive ? 'Release to Delete!' : 'Drag here to delete'}
            </p>

            {/* Pure CSS Animated Trash Can */}
            <div className="relative w-10 flex flex-col items-center">
                <div className={`w-[46px] h-1.5 rounded transition-all duration-300 origin-bottom-left z-10
          ${isDragActive ? 'bg-red-500 -rotate-[35deg] -translate-y-2' : 'bg-gray-300'}`}
                />
                <div className={`w-[36px] h-[42px] mt-[2px] rounded-b-md flex justify-evenly pt-1 transition-colors duration-300
          ${isDragActive ? 'bg-red-500' : 'bg-gray-300'}`}>
                    <div className="w-0.5 h-7 bg-white/50 rounded-full shadow-sm" />
                    <div className="w-0.5 h-7 bg-white/50 rounded-full shadow-sm" />
                </div>
            </div>
        </div>
    );
}


export default TrashBucket;
