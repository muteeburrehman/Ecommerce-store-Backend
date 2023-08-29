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
        //Creating carts table
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
        //Creating orders table
        db.run(`
            CREATE TABLE IF NOT EXISTS orders (           
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
                console.log('Orders table created successfully');
            }
        });
        db.run(`
            Create TABLE IF NOT EXISTS sales (
                sales_id INTEGER PRIMARY KEY AUTOINCREMENT,
                product_id INTEGER,
                sale_date TEXT,
                quantity INTEGER
                price DECIMAL (10,2),
                FOREIGN KEY (product_id) REFERENCES products(id)
            )
        `,(createErr)=>{
            if (createErr) {
            console.error('Error creating sales table:',createErr.message);
            } else {
            console.log('Sales table created successfully')
            }
        
        });
        //Creating Revenue table
        db.run(`
           CREATE TABLE IF NOT EXISTS revenue (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT,
            total_revenue DECIMAL(10, 2)
           )
        `,(createErr)=>{
            if(createErr) {
                console.error('Error creating revenue table:',createErr.message)
            }else{
                console.log('Revenue table created successfully')
            }
        })
        db.run(`
        CREATE TABLE IF NOT EXISTS category (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name varchar(255),
        description TEXT
        )
        `,(createErr)=>{
            if(createErr){
                console.error('Error creating category table:',createErr.message)
            }else{
                console.log('Category table created successfully')
            }
        })
        db.run(`
        CREATE TABLE IF NOT EXISTS reviews(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category_id INTEGER,
        user_id INTEGER,
        rating INTEGER,
        comment TEXT,
        FOREIGN KEY (category_id) REFERENCES category(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
        )
        `,(createErr)=>{
            if (createErr){
                console.error('Error creating review table:',createErr.message)
            }else {
                console.log('Review table created successfully')
            }
        })
        db.run(`
        CREATE TABLE  IF NOT EXISTS transactions (
        transactionId INTEGER PRIMARY KEY AUTOINCREMENT,
        customerId INTEGER,
        paidAmount DOUBLE,
        paymentMethod TEXT,
        createdTime DATETIME,
        FOREIGN KEY (customerId) REFERENCES users(id)
        )
        `,(createErr)=>{
            if(createErr){
                console.error('Error creating transaction table:',createErr.message)
            }else {
                console.log('Transaction table created successfully')
            }
        })
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
