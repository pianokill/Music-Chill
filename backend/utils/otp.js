import nodemailer from 'nodemailer';
import env from 'dotenv';
env.config();

// Tạo transporter cho Nodemailer
const otpStore = {};
const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, 
    service: 'Gmail', // Hoặc dịch vụ email khác
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    }
});

class OTP {
// Hàm tạo OTP
generateOTP(length = 6) {
    const charset = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        otp += charset[randomIndex];
    }
    return otp;
};

// Hàm gửi OTP qua email
async sendOTP(email, otp) {
    const mailOptions = {
        from: 'musicandchill201@gmail.com',
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}. It is valid for 10 minutes.`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('OTP sent successfully');
    } catch (error) {
        console.error('Error sending OTP:', error);
    }
};

}
export default new OTP();


