const http = require('http');
const express = require('express');
const { mongoose, connectionConfig, bookSchema, userSchema } = require('./model');

const app = express();
app.use(express.json({ limit: '10mb' }));

app.post('/books', async (req, res) => {
    const { book } = req.body;

    const conn = mongoose.createConnection(connectionConfig);
    const Book = conn.model('Book', bookSchema);

    const newBook = await Book.create(book);

    await conn.destroy();

    res.status(200).json({ message: "ok", data: { newBook } });
    return;
});

app.get('/books/search', async (req, res) => {
    const filter = req.query;

    const conn = mongoose.createConnection(connectionConfig);
    const Book = conn.model('Book', bookSchema);

    const books = await Book.find().where(filter);

    await conn.destroy();
    res.status(200).json({ message: "ok", data: { books } });
    return;
});

app.get('/books', async (req, res) => {
    const { skip, limit } = req.query;

    const conn = mongoose.createConnection(connectionConfig);
    const Book = conn.model('Book', bookSchema);

    const books = await Book.find().skip(skip).limit(limit);

    await conn.destroy();
    res.status(200).json({ message: "ok", data: { books } });
    return;
});

app.put('/books/:id', async (req, res) => {
    const { id } = req.params;
    const { book } = req.body;

    const conn = mongoose.createConnection(connectionConfig);
    const Book = conn.model('Book', bookSchema);

    book.updateAt = new Date;
    const books = await Book.findByIdAndUpdate(id, book);

    await conn.destroy();
    res.status(200).json({ message: "ok", data: { books } });
    return;
});

app.delete('/books/:id', async (req, res) => {
    const { id } = req.params;

    const conn = mongoose.createConnection(connectionConfig);
    const Book = conn.model('Book', bookSchema);

    const book = await Book.findByIdAndRemove(id);

    await conn.destroy();
    res.status(200).json({ message: "ok", data: { book } });
    return;
});

/////////////////////////////////////////////////////////////////////////////////////

app.post('/users', async (req, res) => {
    const { user } = req.body;

    const conn = mongoose.createConnection(connectionConfig);
    const User = conn.model('User', userSchema);

    const accountId = user.accountId;

    const results = await User.find().where({ accountId });

    if (results.length > 0) {
        await conn.destroy();

        res.status(403).json({ message: "account Id exist", data: {} });
        return;
    }

    const newUser = await User.create(user);
    await conn.destroy();

    res.status(200).json({ message: "ok", data: { newUser } });
    return;
});

app.post('/users/login', async (req, res) => {
    const { user } = req.body;

    const conn = mongoose.createConnection(connectionConfig);
    const User = conn.model('User', userSchema);

    const userExist = await User.findOne().where(user);

    if (userExist === null) {
        await conn.destroy();
        res.status(403).json({ message: "unfound user", data: {} });
        return;
    }

    await conn.destroy();
    res.status(200).json({ message: "ok", data: { user: userExist } });
    return;
});

app.put('/users/:accountId', async (req, res) => {
    const { accountId } = req.params;
    const { user } = req.body;

    const conn = mongoose.createConnection(connectionConfig);

    const User = conn.model('User', userSchema);

    user.updateAt = new Date;
    const newUser = await User.findOneAndUpdate({accountId}, user);

    await conn.destroy();
    res.status(200).json({ message: "ok", data: { user : newUser } });
    return;
});

app.delete('/users/:accountId', async (req, res) => {
    const { accountId } = req.params;

    const conn = mongoose.createConnection(connectionConfig);
    const User = conn.model('User', userSchema);

    const user = await User.findOneAndRemove(accountId);

    await conn.destroy();
    res.status(200).json({ message: "ok", data: { user } });
    return;
});


const httpServer = http.createServer(app);

httpServer.listen(80, () => {
    console.log('HTTP Server running on port 80');
});
