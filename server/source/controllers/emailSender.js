const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

exports.sendEmail = async (email, link) => {
    try {
        
        const mailOptions = {
            from: {
                name: "Khizar Asad",
                address: process.env.EMAIL_USER,
            },
            to: email,
            subject: "Transcription Download Link",
            html: `<p>Click <a href="${link}">here</a> to download/view your transcription</p>`,
        };
        const result = await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${email}`);
        return true;
    } catch (error) {
        console.error(`Error sending email: ${error}`);
        return false;
    }
}

