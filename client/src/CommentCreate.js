import React from 'react';
import axios from 'axios';

const CommentCreate = ({
  postId
}) => {
  const [value, setValue] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleOnChange = (e) => {
    setValue(e.target.value);
  }

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await axios.post(`http://my-micros.com/posts/${postId}/comments`, {
      content: value,
    });
    setLoading(false);
    setValue('');
  }

  return (
    <div>
      <form onSubmit={handleOnSubmit}>
        <label>New Comment</label>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignContent: 'center',
          }}
        >
          <input value={value} onChange={handleOnChange} disabled={loading} />
          <button type="submit" disabled={!value || loading} style={{ marginLeft: 10 }}>comment</button>
        </div>
      </form>
    </div>
  );
}

export default CommentCreate;
