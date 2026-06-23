import React from 'react';
import { Search } from 'lucide-react';

function TaskInput({ inputValue, setInputValue, onSubmit, isEditing }) {
    return (
        <form onSubmit={onSubmit} className="flex gap-4 mb-8 bg-[#f9fafb] p-2 rounded-[16px]">
            <div className="flex-1 relative flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Enter project name to do..."
                    className="w-full bg-transparent py-3 pl-12 pr-4 outline-none text-gray-800 placeholder-gray-400 font-medium"
                />
            </div>
            <button
                type="submit"
                className="bg-white border border-gray-200 px-8 rounded-xl font-bold text-gray-800 shadow-sm hover:bg-[#8b5cf6] hover:text-white hover:border-transparent transition-all duration-200"
            >
                {isEditing ? 'Update' : 'Save'}
            </button>
        </form>
    );
}

export default TaskInput;