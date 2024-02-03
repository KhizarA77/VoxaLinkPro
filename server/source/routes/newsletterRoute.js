import express from 'express';
import pool from '../connection.cjs' 
const Router = express.Router();



Router.post('/', async (req, res) => {
    const { email } = req.body;
    if (!email) {
        res.status(400).send('Email is required');
        return;
    }
    try {
        const result = await pool.query('SELECT * FROM newsletter_emails WHERE email = $1', [email]);
        if (result.rows.length !== 0) {
            return res.status(400).json({
                message: 'Email already subscribed'
            });
        }
        await pool.query('INSERT INTO newsletter_emails (email) VALUES ($1)', [email]);
        res.status(200).json({
            message: 'Email subscribed'
        
        });

    } catch (error) {
        res.status(500).json({
            message: 'Internal server error'
        });
    }


})

export default Router;