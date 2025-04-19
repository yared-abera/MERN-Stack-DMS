const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const User = require('../model/user/user');

const ForgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        // Check if user exists in the database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(200).json({ 
                success: false, 
                message: "Email not found in our database. Please check your email address." 
            });
        }

        console.log(`Password reset requested for: ${email}`);

        if (!process.env.ACCESS_TOKEN_SECRET) {
            console.error("Access token secret is not defined.");
            return res.status(500).json({ success: false, message: "Internal server error." });
        }

        const accessToken = jwt.sign(
            { userId: user._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "3d" }
        );

        // Create Gmail transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.USER_EMAIL,
                pass: process.env.USER_PASSWORD,
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const resetUrl = `http://localhost:5173/reset-password/${user._id}/${accessToken}`;
        const mailOptions = {
            from: `"Wolkite Dormitory Management" <${process.env.USER_EMAIL}>`,
            to: user.email,
            subject: 'Reset Your Password - Wolkite Dormitory Management',
            text: `Click the link below to reset your password:\n\n${resetUrl}`,
            html: `
                <h2>Password Reset Request</h2>
                <p>Hello ${user.fName},</p>
                <p>You have requested to reset your password. Click the button below to proceed:</p>
                <div style="margin: 20px 0;">
                    <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a>
                </div>
                <p>Or copy and paste this link in your browser:</p>
                <p>${resetUrl}</p>
                <p>This link will expire in 3 days.</p>
                <p>If you did not request this password reset, please ignore this email.</p>
                <br>
                <p>Best regards,</p>
                <p>Wolkite Dormitory Management Team</p>
            `
        };

        // Send email and handle response properly
        try {
            await transporter.sendMail(mailOptions);
            console.log("Reset password email sent successfully to:", email);
            res.status(200).json({ 
                success: true, 
                message: "Password reset link has been sent to your email." 
            });
        } catch (emailError) {
            console.error("Error sending email:", emailError);
            return res.status(500).json({ 
                success: false, 
                message: "Error sending email. Please try again later.",
                error: emailError.message 
            });
        }

    } catch (error) {
        console.error("Internal server error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Internal server error. Please try again later.",
            error: error.message 
        });
    }
};

const ResetPassword = async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;
    console.log("id of:", id);
    console.log("token:", token);
    
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (decoded.userId !== id) {
            return res.status(400).json({ success: false, message: "Invalid token or user ID mismatch." });
        }
        
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await User.findByIdAndUpdate(
            id,
            { password: hashedPassword },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        res.status(200).json({ success: true, message: "Password reset successfully." });
    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            return res.status(400).json({ success: false, message: "Invalid token." });
        }

        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};

module.exports = {
    ForgotPassword,
    ResetPassword
}; 