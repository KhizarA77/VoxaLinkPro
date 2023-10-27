const express = require('express');
const Router = express.Router();
const userController = require('../controllers/userController');

// ------------------ MIDDLEWARES ------------------ //

const {loginValidation} = require('../middlewares/loginValidation');
const {authorize} = require('../middlewares/authorization');

// ------------------ ROUTES ------------------ //

Router.post('/login', loginValidation, userController.login);





module.exports = Router;