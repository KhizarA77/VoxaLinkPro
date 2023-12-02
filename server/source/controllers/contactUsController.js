import axios from 'axios';
import logger from '../logger.js'

export const submitSupportForm = async (req, res) => {
    const { email, message } = req.body;
    try {
        const response = await axios.post('http://localhost:1000/support', {
            email,
            message
        })
        if (response.status === 200) {
            logger.info(`Support form submitted from email ${email}`)
            return res.status(200).json({ message: 'Your message has been sent' })
        }
        else {
            logger.error(`Support form failed to submit ${email}`)
            return res.status(500).json({ message: 'An error occurred while sending your message' })
        }
    }
    catch (error) {
        logger.info(`Error occured submitting request form: ${error}`);
        return res.status(500).json({ message: 'An error occurred while sending your message' })
    }

}