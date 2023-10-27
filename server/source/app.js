const express = require('express');
require('dotenv').config();


const app = express();

const userRoutes = require('./routes/userRoutes');

app.use(express.json());


app.use('/api/users', userRoutes);

app.listen(process.env.PORT || 4000, ()=> {
    console.log(`Server is running on port http://localhost:${process.env.PORT || 4000}`);
})