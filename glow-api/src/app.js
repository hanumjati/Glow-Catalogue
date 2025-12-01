// src/app.js
const express = require('express');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.json({ message: 'Glow API OK' }));
app.use('/products', productRoutes);

app.use((req, res) => res.status(404).json({ error: 'Not found' }));

module.exports = app;
