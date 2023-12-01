
const axios = require('axios');


exports.submitSupportForm = async (req, res) => {
    const { email, message } = req.body;
    try {
        const response = await axios.post('http://localhost:1000/support', {
            email,
            message
        })
        if (response.status === 200) {
            return res.status(200).json({ message: 'Your message has been sent' })
        }
        else {
            return res.status(500).json({ message: 'An error occurred while sending your message' })
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'An error occurred while sending your message' })
    }


}