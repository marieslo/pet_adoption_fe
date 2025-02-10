import React from 'react';

export default function Post({ id, username, date, text, tags, userId, reactions, comments, onDelete, onEdit }) {
  return (
    <div key={id} className="post-container p-6 max-w-xl mx-auto bg-white shadow-lg rounded-md mb-4">
      <div id="wrapper-postusername-and-post-date" className="flex justify-between items-center mb-2">
        <div className="post-username font-semibold">{username}</div>
        {date && <div className="post-date text-sm text-gray-500">{date}</div>}
      </div>

      <div className="post-text mb-4">{text}</div>

      <div className="post-reactions mb-4 flex space-x-4">
        <button onClick={() => onEdit(id)} className="text-blue-500 hover:text-blue-700">
          Edit
        </button>
        <button onClick={() => onDelete(id)} className="text-red-500 hover:text-red-700">
          Delete
        </button>
      </div>

      {tags && tags.length > 0 && (
        <div className="post-tags mb-4">
          {tags.map((tag, index) => (
            <span key={index} className="post-tag text-indigo-500">#{tag}</span>
          ))}
        </div>
      )}

      <div className="comments-section">
        {comments && comments.length > 0 && (
          <div className="comments-list mb-4">
            {comments.map((comment, index) => (
              <div key={index} className="comment p-4 mb-2 border-t border-gray-200">
                <span className="comment-username font-semibold">{comment.username}: </span>
                <span className="comment-text">{comment.text}</span>
              </div>
            ))}
          </div>
        )}

        <div className="add-comment mb-4">
          <input
            type="text"
            placeholder="Write a comment..."
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button className="w-full py-2 bg-green-500 text-white font-bold rounded-md hover:bg-green-600 mt-2">
            Submit Comment
          </button>
        </div>
      </div>
    </div>
  );
}