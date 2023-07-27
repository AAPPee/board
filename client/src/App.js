import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [threads, setThreads] = useState([]);
  const [inputTitle, setInputTitle] = useState('');
  const [inputContent, setInputContent] = useState('');

  useEffect(() => {
    getAllThreads();
  }, []);

  const getAllThreads = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/v1/threads');
      setThreads(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.name === 'inputTitle') {
      setInputTitle(e.target.value);
    } else if (e.target.name === 'inputContent') {
      setInputContent(e.target.value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (inputTitle && inputContent) {
      try {
        await axios.post('http://localhost:3001/api/v1/thread', {
          title: inputTitle,
          content: inputContent,
        });
        setInputTitle('');
        setInputContent('');
        getAllThreads();
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleDelete = async (threadId) => {
    try {
      await axios.delete(`http://localhost:3001/api/v1/thread/${threadId}`);
      getAllThreads();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="App">
      <header className="App-header" style={{ textAlign: 'center' }}>
        <h2>ReactとNode.jsとMongoDBで掲示板</h2>
        <div className="thread-section">
          {threads.map((thread,index) => (
            <div key={thread._id} className="single-thread" style={{ textAlign: 'left', border: '0.5px solid black', padding: '15px',marginBottom: '10px'  }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>{index + 1}. {thread.title}</h3>
              <button onClick={() => handleDelete(thread._id)}>削除</button>
            </div>
            <p>{thread.content}</p>
          </div>

          ))}
        </div>
        <form className="form-section" onSubmit={handleSubmit} style={{ textAlign: 'center', border: '2px solid black', padding: '20px' ,marginBottom: '10px' }}>
          <p>タイトル</p>
          <input
            type="text"
            name="inputTitle"
            value={inputTitle}
            onChange={handleInputChange}
            placeholder="タイトル"
          />
          <p>内容</p>
          <textarea
            name="inputContent"
            value={inputContent}
            onChange={handleInputChange}
            placeholder="内容"
          />
          <br />
          <button type="submit">送信</button>
        </form>
      </header>
    </div>
  );
};

export default App;
