import React from 'react';
import axios from 'axios';
import CommentCreate from './CommentCreate';
import CommentList from './CommentList';

const PostList = () => {
  const [posts, setPosts] = React.useState({});
  const [loading, setLoading] = React.useState(false);

  const fetchPosts = React.useCallback(async () => {
    setLoading(true);
    const res = await axios.get('http://my-micros.com/posts');
    setPosts(res.data);
    setLoading(false);
}, []);

  React.useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return !!loading
    ? <div style={{ margin: 5 }}>loading...</div>
    : (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        {Object.values(posts).map((post) => {
          return (
            <div
              key={post.id}
              style={{
                padding: 10,
                margin: '0 10px 10px 0',
                border: '1px solid lightgrey',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <h4>{post.title}</h4>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  flexGrow: 1,
                }}
              >
                <CommentList comments={post.comments} />
                <div style={{ flex: 1 }} />
                <CommentCreate postId={post.id} />
              </div>
            </div>
          );
        })}
      </div>
    );
}

export default PostList;