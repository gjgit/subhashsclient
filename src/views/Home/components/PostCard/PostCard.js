import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';

function PostCard({
  post: { body, createdAt, id, username, likeCount, commentCount, likes }
}) {
  return (
    <div>
      <h1>{username}</h1>
      <h1>{body}</h1>
      <h1>{moment(createdAt).fromNow(true)}</h1>
    </div>
  );
}

export default PostCard;
