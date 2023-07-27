const express = require('express');   // サーバーを建てるためのmodule
const mongoose = require('mongoose');  // mongoDBと通信するためのmodule
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3001;

// MongoDBへの接続（接続先を適宜変更する）
mongoose.connect(
    "mongodb+srv://bobo:abc@cluster0.ploi6hj.mongodb.net/TTT?retryWrites=true&w=majority"
)
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log(err));

// データベースのスキーマとモデルの定義
const threadSchema = new mongoose.Schema({
    title: String,
    content: String,
});

const Thread = mongoose.model('Thread', threadSchema);

// Middlewareの設定
app.use(cors());
app.use(bodyParser.json());

// APIエンドポイントの定義

// 全てのスレッドを取得
app.get('/api/v1/threads', async (req, res) => {
    try {
        const allThreads = await Thread.find({});
        res.status(200).json(allThreads);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to get threads' });
    }
});

// 新しいスレッドを投稿
app.post('/api/v1/thread', async (req, res) => {
    try {
        const { title, content } = req.body;
        const newThread = new Thread({ title, content });
        await newThread.save();
        res.status(201).json(newThread);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to create thread' });
    }
});

app.delete('/api/v1/thread/:id', async (req, res) => {
    try {
        const threadId = req.params.id;
        await Thread.findByIdAndDelete(threadId);
        res.status(200).json({ message: 'Thread deleted successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to delete thread' });
    }
});

// サーバーの起動
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
