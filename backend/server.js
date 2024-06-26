const express = require('express');
const dotenv = require('dotenv');
const app = express();
const {chats} = require('./data');
const connectDB = require('./config/db');
const userRouter = require('./routes/userRouter');

const {notFound, errorHandler} = require('./middleware/errorMiddleware');

 

dotenv.config();
connectDB();

app.use(express.json());

app.get('/', (req, res)=>{
    res.send("Hello, welcome to the express server");

})

app.use('/api/user', userRouter);



app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`Server started on port number ${PORT}`);
});