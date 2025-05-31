const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db.js');
const slidesRouter = require('./api/slides/route.js');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors({ origin: 'https://chatgpt.com' }))

app.use('/api/slides', slidesRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
