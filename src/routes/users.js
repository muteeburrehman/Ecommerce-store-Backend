import express from 'express';
import { db, queryDatabase } from '../db';
import passport from 'passport';

export const usersRouter = express.Router();

usersRouter.get('/api/users/:userId/cart', async (req, res) => {
    const { userId } = req.params;

    try {
        const cartItems = await queryDatabase(
            'SELECT c.*, p.name, p.price, p.imageUrl ' +
            'FROM carts c ' +
            'JOIN products p ON c.product_id = p.id ' +
            'WHERE c.user_id = ?',
            [userId]
        );
        res.status(200).json(cartItems);
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

// API route to add to cart
usersRouter.post('/api/users/:userId/cart', async (req, res) => {
    const { userId } = req.params;
    const { product_id, quantity } = req.body;

    try {
        // Fetch product details from the products table
        const product = await queryDatabase('SELECT * FROM products WHERE id = ?', [product_id]);
        if (!product[0]) {
            res.status(404).json('Could not find product!');
            return;
        }

        // Fetch the cart item details
        const cartItem = await queryDatabase('SELECT * FROM carts WHERE product_id = ? AND user_id = ?', [product_id, userId]);
        if (cartItem[0]) {
            // Calculate total price based on updated quantity
            // const _qty = parseInt(cartItem[0].quantity) + quantity;
            const price = parseFloat(product[0].price);
            const total_price = price * quantity;

            // Update the cart item with new quantity and total price
            const updateQuery = `
            UPDATE carts
            SET quantity = ?, price = ?, total_price = ?
            WHERE product_id = ?
        `;
            await queryDatabase(updateQuery, [quantity, price, total_price, product_id]);

            res.status(200).json({ message: 'Cart item updated successfully' });
            return;
        }

        // Calculate total price based on product price and quantity
        const price = parseFloat(product[0].price);
        const total_price = price * quantity;

        // Insert the item into the cart
        const insertQuery = `
            INSERT INTO carts (user_id, product_id, quantity, price, total_price)
            VALUES (?, ?, ?, ?, ?)
        `;
        await queryDatabase(insertQuery, [userId, product_id, quantity, price, total_price]);

        res.status(200).json({ message: 'Product added to cart successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Database error:' + err });
    }
});

// API route to update the quantity of a product in a user's cart
usersRouter.put('/api/users/:userId/cart/:cartItemId', async (req, res) => {
    const { userId, cartItemId } = req.params;
    const { quantity } = req.body;

    try {
        // Fetch the cart item details
        const cartItem = await queryDatabase('SELECT * FROM carts WHERE id = ? AND user_id = ?', [cartItemId, userId]);
        if (!cartItem[0]) {
            res.status(404).json('Could not find cart item!');
            return;
        }

        // Fetch product details from the products table
        const product = await queryDatabase('SELECT * FROM products WHERE id = ?', [cartItem[0].product_id]);
        if (!product[0]) {
            res.status(404).json('Could not find product!');
            return;
        }

        // Calculate total price based on updated quantity
        const price = parseFloat(product[0].price);
        const total_price = price * quantity;

        // Update the cart item with new quantity and total price
        const updateQuery = `
            UPDATE carts
            SET quantity = ?, price = ?, total_price = ?
            WHERE id = ?
        `;
        await queryDatabase(updateQuery, [quantity, price, total_price, cartItemId]);

        res.status(200).json({ message: 'Cart item updated successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

usersRouter.delete('/api/users/:userId/cart/:cartItemId', async (req, res) => {
    const { userId, cartItemId } = req.params;

    try {
        // Fetch the cart item details
        const cartItem = await queryDatabase('SELECT * FROM carts WHERE id = ? AND user_id = ?', [cartItemId, userId]);
        if (!cartItem[0]) {
            res.status(404).json({ message: 'Could not find cart item!' });
            return;
        }

        // Delete the item from the cart
        const deleteQuery = `
            DELETE FROM carts
            WHERE id = ? AND user_id = ?
        `;
        await queryDatabase(deleteQuery, [cartItemId, userId]);

        res.status(200).json({ message: 'Product removed from cart successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Database error' });
    }
});

