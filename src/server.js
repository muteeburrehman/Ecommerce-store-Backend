import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import expressSession from 'express-session';

import { productsRouter } from './routes/products';
import { usersRouter } from './routes/users';
import { authenticationRouter } from './routes/authentication';
import { ordersRouter } from './routes/orders';
import { analyticsRouter } from './routes/analytics';
import {reviewRouter} from "./routes/review";

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, '../assets')));

app.use(expressSession({
    secret: 'shoestoreapp',
    resave: true,
    saveUninitialized: true
}));

app.use(productsRouter);
app.use(usersRouter);
app.use(authenticationRouter);
app.use(ordersRouter);
app.use(analyticsRouter);
app.use(reviewRouter);

app.listen(8000, () => {
    console.log('Server is listening on port 8000');
});
