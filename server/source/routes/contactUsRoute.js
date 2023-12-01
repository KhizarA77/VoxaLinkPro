const express = require('express');
const Router = express.Router();

const {submitSupportForm} = require('../controllers/contactUsController');


// localhost:4000/api/contact
Router.post('/', submitSupportForm);

module.exports = Router;