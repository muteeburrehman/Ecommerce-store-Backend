import express from 'express';
import {db, queryDatabase} from '../DataBase/db';
import passport from 'passport';

export const productsRouter = express.Router();

productsRouter.get('/api/products', async (req, res) => {
    try {
        const rows = await queryDatabase('SELECT * FROM products', []);
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({error: 'Database error'});
    }
});

productsRouter.get('/api/products/:productId', async (req, res) => {
    const {productId} = req.params;

    try {
        const product = await queryDatabase('SELECT * FROM products WHERE id = ?', [productId]);
        if (!product[0]) {
            res.status(404).json('Could not find the product!');
            return;
        }
        res.status(200).json(product[0]);
    } catch (err) {
        res.status(500).json({error: 'Database error'});
    }
});

productsRouter.post('/api/products', (req, res) => {
    const {id, name, price, description, imageUrl, averageRating} = req.body;

    const insertQuery = `
    INSERT INTO products (name, price, description, imageUrl, averageRating)
    VALUES (?, ?, ?, ?, ?)
  `;

    db.run(insertQuery, [name, price, description, imageUrl, averageRating], (err) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({error: 'Failed to insert product'});
        } else {
            res.status(201).json({message: 'Product inserted successfully'});
        }
    });
});

// API route to update a product based on productId
productsRouter.put('/api/products/:productId', (req, res) => {
    const {productId} = req.params;
    const {name, price, description, imageUrl, averageRating} = req.body;

    const updateQuery = `
    UPDATE products
    SET name = ?, price = ?, description = ?, imageUrl = ?, averageRating = ?
    WHERE id = ?
  `;

    db.run(updateQuery, [name, price, description, imageUrl, averageRating, productId], (err) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({error: 'Failed to update product'});
        } else {
            res.status(200).json({message: 'Product updated successfully'});
        }
    });
});

productsRouter.delete('/api/products/:productId', (req, res) => {
    const {productId} = req.params;

    const deleteQuery = `
    DELETE FROM products
    WHERE id = ?
  `;

    db.run(deleteQuery, [productId], (err) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({error: 'Failed to delete product'});
        } else {
            res.status(200).json({message: 'Product deleted successfully'});
        }
    });
});

