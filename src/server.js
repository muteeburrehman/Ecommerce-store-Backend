import express from 'express';
import bodyParser from 'body-parser';
import sqlite3 from 'sqlite3';
import path from 'path';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import expressSession from 'express-session';
const cors = require('cors')
const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, '../assets')));

const db = new sqlite3.Database('./mock.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the database');

        // Create tables and perform other initializations here
        // (Code for creating products, users, and carts tables)
        db.run(`
            CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                price DOUBLE,
                description TEXT,
                imageUrl TEXT,
                averageRating TEXT
            )
        `, (createErr) => {
            if (createErr) {
                console.error('Error creating products table:', createErr.message);
            } else {
                console.log('Products table created successfully');
            }
        });

        // Create the users table if it doesn't exist
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                email TEXT NOT NULL UNIQUE,
                phoneNo TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL
            )
        `, (createErr) => {
            if (createErr) {
                console.error('Error creating users table:', createErr.message);
            } else {
                console.log('Users table created successfully');
            }
        });

        db.run(`
            CREATE TABLE IF NOT EXISTS carts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER, 
                cart_item_id INTEGER,
                product_id INTEGER,
                quantity INTEGER,
                price DECIMAL(10, 2),
                total_price DECIMAL(10, 2),
                FOREIGN KEY (user_id) REFERENCES users(id),
                FOREIGN KEY (product_id) REFERENCES products(id)
            )
        `, (createErr) => {
            if (createErr) {
                console.error('Error creating carts table:', createErr.message);
            } else {
                console.log('Carts table created successfully');
            }
        });
    }
});

// ... Other parts of your code ...


async function queryDatabase(query, params) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database('./mock.db');
        db.all(query, params, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
            db.close();
        });
    });
}

app.get('/api/products', async (req, res) => {
    try {
        const rows = await queryDatabase('SELECT * FROM products', []);
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({error: 'Database error'});
    }
});
// API route to get a user's cart items
app.get('/api/users/:userId/cart', async (req, res) => {
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

app.get('/api/products/:productId', async (req, res) => {
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

/*
app.post('/api/users/:userId/cart', async (req, res) => {
    const {userId} = req.params;
    const {productId} = req.body;

    try {
        const product = await queryDatabase('SELECT * FROM products WHERE id = ?', [productId]);
        if (!product[0]) {
            res.status(404).json('Could not find product!');
            return;
        }
        await queryDatabase('UPDATE users SET cartItems = cartItems || ? || "," WHERE id = ?', [productId, userId]);
        res.status(200).json(product[0]);
    } catch (err) {
        res.status(500).json({error: 'Database error'});
    }
});
*/

/*
app.delete('/api/users/:userId/cart/:productId', async (req, res) => {
    const {userId, productId} = req.params;

    try {
        await queryDatabase('UPDATE users SET cartItems = REPLACE(cartItems, ? || ",", "") WHERE id = ?', [productId, userId]);
        const rows = await queryDatabase('SELECT * FROM products WHERE id IN (SELECT cartItems FROM users WHERE id = ?)', [userId]);
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({error: 'Database error'});
    }
});
*/

//insert,update,modify

app.post('/api/products', (req, res) => {
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

// API route to add to cart
app.post('/api/users/:userId/cart', async (req, res) => {
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

// API route for user login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await queryDatabase('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
        if (!user[0]) {
            res.status(401).json({ message: 'Invalid email or password' });
            return;
        }
        res.status(200).json({ message: 'Login successful', user: user[0] });
    } catch (err) {
        res.status(500).json({ message: 'Database error' });
    }
});
// API route for user registration
app.post('/api/register', async (req, res) => {
    const { email, password, username, phoneNo } = req.body;

    try {
        const usernameExists = await queryDatabase('SELECT * FROM users WHERE username = ?', [username]);
        if (usernameExists[0]) {
            res.status(400).json({ message: 'Username already exists' });
            return;
        }

        const emailExists = await queryDatabase('SELECT * FROM users WHERE email = ?', [email]);
        if (emailExists[0]) {
            res.status(400).json({ message: 'Email already exists' });
            return;
        }

        const phoneNoExists = await queryDatabase('SELECT * FROM users WHERE phoneNo = ?', [phoneNo]);
        if (phoneNoExists[0]) {
            res.status(400).json({ message: 'Phone number already exists' });
            return;
        }

        const insertQuery = `
            INSERT INTO users (username, email, phoneNo, password)
            VALUES (?, ?, ?, ?)
        `;
        await queryDatabase(insertQuery, [username, email, phoneNo, password]);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Database error' });
    }
});

// API route to update a product based on productId
app.put('/api/products/:productId', (req, res) => {
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

// API route to update the quantity of a product in a user's cart
app.put('/api/users/:userId/cart/:cartItemId', async (req, res) => {
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

app.delete('/api/users/:userId/cart/:cartItemId', async (req, res) => {
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
// API route to delete a product based on productId
app.delete('/api/products/:productId', (req, res) => {
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


// Define other routes here
//For Google
//const app=express();
const GOOGLE_CLIENT_ID = '612009756713-fevv7ilgb1ltpvrc7cnsolno8bjadb3c.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET ='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';


passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: '/google/callback'
}, (accessToken, refreshToken, profile, callback) => {
    callback(null, profile);
}));
//For Facebook
const FACEBOOK_CLIENT_ID='990173875566142';
const FACEBOOK_CLIENT_SECRET='ea1259d7c4fc652844b53dd9e8049185';

passport.use(new FacebookStrategy({
    clientID: FACEBOOK_CLIENT_ID,
    clientSecret: FACEBOOK_CLIENT_SECRET,
    callbackURL: '/facebook/callback',
    profileFields: ['emails', 'displayName', 'name', 'picture']
}, (accessToken, refreshToken, profile, callback) => {
    callback(null, profile);
}));

passport.serializeUser((user, callback) => {
    callback(null, user);
});

passport.deserializeUser((user, callback) => {
    callback(null, user);
});

app.use(expressSession({
    secret: 'shoestoreapp',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/login/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/login/facebook', passport.authenticate('facebook', { scope: ['email'] }));

app.get('/google/callback', passport.authenticate('google'), (req, res) => {
    res.redirect('http://localhost:8080/');
});

app.get('/facebook/callback', passport.authenticate('facebook'), (req, res) => {
    res.redirect('http://localhost:8080/');
});

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/notlogged');
});

app.get('/notlogged', (req, res) => {
    res.send(req.user ? req.user : 'Not logged in. Login with Google or Facebook.');
});
// ... The rest of your API routes ...

app.listen(8000, () => {
    console.log('Server is listening on port 8000');
});