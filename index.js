const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const emailsSchema = new mongoose.Schema({
    id: Number,
    emails: [],
});
const emailsModel = mongoose.model('Emails', emailsSchema);

const useDb = async () => {
    try {
        await mongoose.connect(process.env.URI);
        console.log('mongo connected');
    } catch (err) {
        console.log('mongo error:', err);
        throw err;
    }
};

const app = express();

app.use(express.json());

app.use(
    cors({
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true,
    })
);
app.options('*', cors());

app.listen(process.env.PORT, () => {
    console.log('Server running on port', process.env.PORT);
});

app.post('/api/v1/email', async (req, res) => {
    await useDb();
    try {
        const date = new Date();
        const { email } = req.body;
        console.log(email)
        const updated = await emailsModel.updateOne(
            { id: 1 },
            { $push: { emails: { email, date } } }
        );
        if (updated.acknowledged) {
            res.status(200).json({ added: true });
            return;
        }
        res.status(500).json({ added: false });
    } catch (err) {
        console.log(err);
        res.status(500).json({ added: false });
    }
});
