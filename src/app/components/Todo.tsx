'use client';

import { useState } from 'react';

interface TodoProps {
  id: number;
  text: string;
  onDelete: (id: number) => void;
  onEdit: (id: number, newText: string) => void;
}

export default function Todo({ id, text, onDelete, onEdit }: TodoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(text);

  const handleSave = () => {
    if (editedText.trim()) {
      onEdit(id, editedText);
      setIsEditing(false);
    }
  };

  return (
    <li className="flex items-center gap-4 p-4 bg-white rounded-lg shadow mb-2">
      {isEditing ? (
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="flex-1 px-3 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <button
            onClick={handleSave}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            Save
          </button>
          <button
            onClick={() => {
              setIsEditing(false);
              setEditedText(text);
            }}
            className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      ) : (
        <>
          <span className="flex-1">{text}</span>
          <button
            onClick={() => setIsEditing(true)}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(id)}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </>
      )}
    </li>
  );
} 