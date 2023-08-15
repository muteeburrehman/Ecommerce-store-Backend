const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const products = [{
    id: '123',
    name: 'Running Shoes',
    price: '60.00',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel enim quam. Mauris nisl tellus, fringilla sed cursus eu, convallis non diam. Mauris quis fringilla nunc. Aenean leo lacus, lobortis sit amet venenatis a, aliquet tristique erat. Etiam laoreet mauris ut dapibus tincidunt. Pellentesque non ex at nisl ornare aliquam sed non ante. Nam lobortis magna id massa cursus, sit amet condimentum metus facilisis. Donec eu tortor at est tempor cursus et sed velit. Morbi rutrum elementum est vitae fringilla. Phasellus dignissim purus turpis, ac varius enim auctor vulputate. In ullamcorper vestibulum mauris. Nulla malesuada pretium mauris, lobortis eleifend dolor iaculis vitae.',
    imageUrl: '/images/shoes-1.jpg',
    averageRating: '5.0',
}, {
    id: '234',
    name: 'Basketball Shoes',
    price: '120.00',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel enim quam. Mauris nisl tellus, fringilla sed cursus eu, convallis non diam. Mauris quis fringilla nunc. Aenean leo lacus, lobortis sit amet venenatis a, aliquet tristique erat. Etiam laoreet mauris ut dapibus tincidunt. Pellentesque non ex at nisl ornare aliquam sed non ante. Nam lobortis magna id massa cursus, sit amet condimentum metus facilisis. Donec eu tortor at est tempor cursus et sed velit. Morbi rutrum elementum est vitae fringilla. Phasellus dignissim purus turpis, ac varius enim auctor vulputate. In ullamcorper vestibulum mauris. Nulla malesuada pretium mauris, lobortis eleifend dolor iaculis vitae.',
    imageUrl: '/images/shoes-2.jpg',
    averageRating: '5.0',
}, {
    id: '345',
    name: 'Bright Red Shoes',
    price: '90.00',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel enim quam. Mauris nisl tellus, fringilla sed cursus eu, convallis non diam. Mauris quis fringilla nunc. Aenean leo lacus, lobortis sit amet venenatis a, aliquet tristique erat. Etiam laoreet mauris ut dapibus tincidunt. Pellentesque non ex at nisl ornare aliquam sed non ante. Nam lobortis magna id massa cursus, sit amet condimentum metus facilisis. Donec eu tortor at est tempor cursus et sed velit. Morbi rutrum elementum est vitae fringilla. Phasellus dignissim purus turpis, ac varius enim auctor vulputate. In ullamcorper vestibulum mauris. Nulla malesuada pretium mauris, lobortis eleifend dolor iaculis vitae.',
    imageUrl: '/images/shoes-3.jpg',
    averageRating: '5.0',
}, {
    id: '456',
    name: 'Fancy Shoes',
    price: '190.00',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel enim quam. Mauris nisl tellus, fringilla sed cursus eu, convallis non diam. Mauris quis fringilla nunc. Aenean leo lacus, lobortis sit amet venenatis a, aliquet tristique erat. Etiam laoreet mauris ut dapibus tincidunt. Pellentesque non ex at nisl ornare aliquam sed non ante. Nam lobortis magna id massa cursus, sit amet condimentum metus facilisis. Donec eu tortor at est tempor cursus et sed velit. Morbi rutrum elementum est vitae fringilla. Phasellus dignissim purus turpis, ac varius enim auctor vulputate. In ullamcorper vestibulum mauris. Nulla malesuada pretium mauris, lobortis eleifend dolor iaculis vitae.',
    imageUrl: '/images/shoes-4.jpg',
    averageRating: '5.0',
}, {
    id: '567',
    name: 'Skateboard Shoes',
    price: '75.00',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel enim quam. Mauris nisl tellus, fringilla sed cursus eu, convallis non diam. Mauris quis fringilla nunc. Aenean leo lacus, lobortis sit amet venenatis a, aliquet tristique erat. Etiam laoreet mauris ut dapibus tincidunt. Pellentesque non ex at nisl ornare aliquam sed non ante. Nam lobortis magna id massa cursus, sit amet condimentum metus facilisis. Donec eu tortor at est tempor cursus et sed velit. Morbi rutrum elementum est vitae fringilla. Phasellus dignissim purus turpis, ac varius enim auctor vulputate. In ullamcorper vestibulum mauris. Nulla malesuada pretium mauris, lobortis eleifend dolor iaculis vitae.',
    imageUrl: '/images/shoes-5.jpg',
    averageRating: '5.0',
}, {
    id: '678',
    name: 'High Heels',
    price: '200.00',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel enim quam. Mauris nisl tellus, fringilla sed cursus eu, convallis non diam. Mauris quis fringilla nunc. Aenean leo lacus, lobortis sit amet venenatis a, aliquet tristique erat. Etiam laoreet mauris ut dapibus tincidunt. Pellentesque non ex at nisl ornare aliquam sed non ante. Nam lobortis magna id massa cursus, sit amet condimentum metus facilisis. Donec eu tortor at est tempor cursus et sed velit. Morbi rutrum elementum est vitae fringilla. Phasellus dignissim purus turpis, ac varius enim auctor vulputate. In ullamcorper vestibulum mauris. Nulla malesuada pretium mauris, lobortis eleifend dolor iaculis vitae.',
    imageUrl: '/images/shoes-6.jpg',
    averageRating: '5.0',
}, {
    id: '789',
    name: 'Dark Shoes',
    price: '100.00',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel enim quam. Mauris nisl tellus, fringilla sed cursus eu, convallis non diam. Mauris quis fringilla nunc. Aenean leo lacus, lobortis sit amet venenatis a, aliquet tristique erat. Etiam laoreet mauris ut dapibus tincidunt. Pellentesque non ex at nisl ornare aliquam sed non ante. Nam lobortis magna id massa cursus, sit amet condimentum metus facilisis. Donec eu tortor at est tempor cursus et sed velit. Morbi rutrum elementum est vitae fringilla. Phasellus dignissim purus turpis, ac varius enim auctor vulputate. In ullamcorper vestibulum mauris. Nulla malesuada pretium mauris, lobortis eleifend dolor iaculis vitae.',
    imageUrl: '/images/shoes-7.jpg',
    averageRating: '5.0',
}, {
    id: '890',
    name: 'Classic Shoes',
    price: '40.00',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel enim quam. Mauris nisl tellus, fringilla sed cursus eu, convallis non diam. Mauris quis fringilla nunc. Aenean leo lacus, lobortis sit amet venenatis a, aliquet tristique erat. Etiam laoreet mauris ut dapibus tincidunt. Pellentesque non ex at nisl ornare aliquam sed non ante. Nam lobortis magna id massa cursus, sit amet condimentum metus facilisis. Donec eu tortor at est tempor cursus et sed velit. Morbi rutrum elementum est vitae fringilla. Phasellus dignissim purus turpis, ac varius enim auctor vulputate. In ullamcorper vestibulum mauris. Nulla malesuada pretium mauris, lobortis eleifend dolor iaculis vitae.',
    imageUrl: '/images/shoes-8.jpg',
    averageRating: '5.0',
}, {
    id: '901',
    name: 'Plain Shoes',
    price: '54.00',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel enim quam. Mauris nisl tellus, fringilla sed cursus eu, convallis non diam. Mauris quis fringilla nunc. Aenean leo lacus, lobortis sit amet venenatis a, aliquet tristique erat. Etiam laoreet mauris ut dapibus tincidunt. Pellentesque non ex at nisl ornare aliquam sed non ante. Nam lobortis magna id massa cursus, sit amet condimentum metus facilisis. Donec eu tortor at est tempor cursus et sed velit. Morbi rutrum elementum est vitae fringilla. Phasellus dignissim purus turpis, ac varius enim auctor vulputate. In ullamcorper vestibulum mauris. Nulla malesuada pretium mauris, lobortis eleifend dolor iaculis vitae.',
    imageUrl: '/images/shoes-9.jpg',
    averageRating: '5.0',
},
    {
        id: '901',
        name: 'Teal Dress Shoes',
        price: '330.00',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel enim quam. Mauris nisl tellus, fringilla sed cursus eu, convallis non diam. Mauris quis fringilla nunc. Aenean leo lacus, lobortis sit amet venenatis a, aliquet tristique erat. Etiam laoreet mauris ut dapibus tincidunt. Pellentesque non ex at nisl ornare aliquam sed non ante. Nam lobortis magna id massa cursus, sit amet condimentum metus facilisis. Donec eu tortor at est tempor cursus et sed velit. Morbi rutrum elementum est vitae fringilla. Phasellus dignissim purus turpis, ac varius enim auctor vulputate. In ullamcorper vestibulum mauris. Nulla malesuada pretium mauris, lobortis eleifend dolor iaculis vitae.',
        imageUrl: '/images/shoes-10.jpg',
        averageRating: '5.0',
    },
    {
        id: '789',
        name: 'Fancy Boots',
        price: '230.00',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel enim quam. Mauris nisl tellus, fringilla sed cursus eu, convallis non diam. Mauris quis fringilla nunc. Aenean leo lacus, lobortis sit amet venenatis a, aliquet tristique erat. Etiam laoreet mauris ut dapibus tincidunt. Pellentesque non ex at nisl ornare aliquam sed non ante. Nam lobortis magna id massa cursus, sit amet condimentum metus facilisis. Donec eu tortor at est tempor cursus et sed velit. Morbi rutrum elementum est vitae fringilla. Phasellus dignissim purus turpis, ac varius enim auctor vulputate. In ullamcorper vestibulum mauris. Nulla malesuada pretium mauris, lobortis eleifend dolor iaculis vitae.',
        imageUrl: '/images/shoes-11.jpg',
        averageRating: '5.0',
    }, {
        id: '890',
        name: 'Gold Shoes',
        price: '180.00',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel enim quam. Mauris nisl tellus, fringilla sed cursus eu, convallis non diam. Mauris quis fringilla nunc. Aenean leo lacus, lobortis sit amet venenatis a, aliquet tristique erat. Etiam laoreet mauris ut dapibus tincidunt. Pellentesque non ex at nisl ornare aliquam sed non ante. Nam lobortis magna id massa cursus, sit amet condimentum metus facilisis. Donec eu tortor at est tempor cursus et sed velit. Morbi rutrum elementum est vitae fringilla. Phasellus dignissim purus turpis, ac varius enim auctor vulputate. In ullamcorper vestibulum mauris. Nulla malesuada pretium mauris, lobortis eleifend dolor iaculis vitae.',
        imageUrl: '/images/shoes-12.jpg',
        averageRating: '5.0',
    }];

export let cartItems = [
    products[0],
    products[2],
    products[3],
];

const app = express();
app.use(bodyParser.json());

// Connect to the SQLite database
const db = new sqlite3.Database('./mock.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) return console.error(err.message);

    console.log('Connected to the database');

    // Create the products table if it doesn't exist
    // Create the products table if it doesn't exist
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
            username TEXT NOT NULL,
            email TEXT NOT NULL,
            PhoneNo TEXT,
            cartItems TEXT DEFAULT ''
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
            console.error('Error creating users table:', createErr.message);
        } else {
            console.log('Carts table created successfully');
        }
    });
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
        const cartItems = await queryDatabase('SELECT * FROM carts WHERE user_id = ?', [userId]);
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

// API route to add a product to a user's cart
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
            const _qty = parseInt(cartItem[0].quantity) + quantity;
            const price = parseFloat(product[0].price);
            const total_price = price * _qty;

            // Update the cart item with new quantity and total price
            const updateQuery = `
            UPDATE carts
            SET quantity = ?, price = ?, total_price = ?
            WHERE product_id = ?
        `;
            await queryDatabase(updateQuery, [_qty, price, total_price, product_id]);

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

app.listen(8000, () => {
    console.log('Server is listening on port 8000');
});