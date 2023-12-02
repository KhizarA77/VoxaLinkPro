import express from 'express';
const Router = express.Router();

import { submitSupportForm } from '../controllers/contactUsController.js';


// localhost:4000/api/contact
Router.post('/', submitSupportForm);

export default Router;