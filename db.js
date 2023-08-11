const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(bodyParser.json());

// Connect to the SQLite database
const db = new sqlite3.Database('./mock.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);

    console.log('Connected to the database');
});
// API route to insert a new product
app.post('/api/products', (req, res) => {
    const { id, name, price, description, imageUrl, averageRating } = req.body;

    const insertQuery = `
    INSERT INTO products (id, name, price, description, imageUrl, averageRating)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

    db.run(insertQuery, [id, name, price, description, imageUrl, averageRating], (err) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Failed to insert product' });
        } else {
            res.status(201).json({ message: 'Product inserted successfully' });
        }
    });
});

// API route to update a product based on productId
app.put('/api/products/:productId', (req, res) => {
    const { productId } = req.params;
    const { name, price, description, imageUrl, averageRating } = req.body;

    const updateQuery = `
    UPDATE products
    SET name = ?, price = ?, description = ?, imageUrl = ?, averageRating = ?
    WHERE id = ?
  `;

    db.run(updateQuery, [name, price, description, imageUrl, averageRating, productId], (err) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Failed to update product' });
        } else {
            res.status(200).json({ message: 'Product updated successfully' });
        }
    });
});

// API route to delete a product based on productId
app.delete('/api/products/:productId', (req, res) => {
    const { productId } = req.params;

    const deleteQuery = `
    DELETE FROM products
    WHERE id = ?
  `;

    db.run(deleteQuery, [productId], (err) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Failed to delete product' });
        } else {
            res.status(200).json({ message: 'Product deleted successfully' });
        }
    });
});

app.listen(8000, () => {
    console.log('Server is listening on port 8000');
});
