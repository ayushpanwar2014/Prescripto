import express from 'express';
import { dbConnected } from './config/dbConnect.js';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

const app = express();
const PORT = process.env.PORT;


//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(morgan('tiny'));

//middleware to get ip address of the user network
app.set('trust proxy', false);

app.get('/', (req, res) => {
    res.send('Hello')
})

dbConnected().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on PORT:-${PORT}`);
    })
}).catch((err) => {
    console.error('Database Connection Failed!', err);

})
