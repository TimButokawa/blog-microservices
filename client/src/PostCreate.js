import React from 'react';
import axios from 'axios';

const PostCreate = () => {
  const [value, setValue] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleOnChange = (e) => {
    setValue(e.target.value);
  }

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await axios.post('http://my-micros.com/posts/create', {
      title: value,
    });
    setLoading(false);
    setValue('');
  }
  
  return (
    <div>
      <form onSubmit={handleOnSubmit}>
          <div>
            <label style={{ display: 'block' }}>Title</label>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignContent: 'center',
              }}
            >
              <input value={value} onChange={handleOnChange} disabled={loading} />
              <button type="submit" disabled={!value || loading} style={{ marginLeft: 10 }}>submit</button>
            </div>
          </div>
      </form>
    </div>
  );
}

export default PostCreate;