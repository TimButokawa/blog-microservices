import React from 'react';

const CommentList = ({ comments }) => {
  return (
    <div>
      <h6>comments:</h6>
      <ul>
        {comments.map(comment => {
          if (comment.status === 'pending') {
            return (
              <li
                key={comment.id}
                style={{ fontStyle: 'italic' }}
              >
                This comment is awaiting moderation
              </li>
            );
          }

          return comment.status === 'approved'
            ? <li key={comment.id}>{comment.content}</li>
            : <li key={comment.id} style={{ fontStyle: 'italic', color: 'red' }}>This comment has been rejected</li>;
        })}
      </ul>
    </div>
  );
}

export default CommentList;
