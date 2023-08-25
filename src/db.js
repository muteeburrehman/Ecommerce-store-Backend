import sqlite3 from 'sqlite3';

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
                id INTEGER PRIMARY KEY AUTOINCREMENT,
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
        db.run(`
            CREATE TABLE IF NOT EXISTS order(           
             order_id INTEGER PRIMARY KEY AUTOINCREMENT,            
             customer_id INTEGER,            
             order_date TEXT,           
             order_status TEXT,            
             total_amount DOUBLE,            
             shipping_address TEXT,            
             billing_address TEXT,
             FOREIGN KEY (customer_id) REFERENCES users(id)
            )
        `, (createErr) => {
            if (createErr) {
                console.error('Error creating order table:', createErr.message);
            } else {
                console.log('Order table created successfully');
            }
        });
    }
});






// Function to query the database
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
// Export the initialized database and query function
export { db, queryDatabase };
