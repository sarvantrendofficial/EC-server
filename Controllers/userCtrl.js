const Users = require('../Models/usersModel');
const Profile = require('../Models/userProModel');
const Otp = require('../Models/otp');
const jwt = require('jsonwebtoken');
const otpGen = require('otp-generator');
const { sendVerificationEmail, verifySuccessEmail } = require('../utils/sendEmailAuth');
const authenticate = require('../middleware/auth');

const SECRET_KEY = 'my_simple_secret';

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email, userName: user.name, isAdmin: user.isAdmin },
        SECRET_KEY
    );
};

exports.Login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await Users.findOne({ email, password });
        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }
        const isVerified = user.verified;
        if (!isVerified) {
            return res.status(400).json({ message: "Please verify your account first." });
        }
        if (user.isAdmin) {
            const token = generateToken(user);
            return res.status(200).json({ message: `Welcome Back Admin ${user.name}`, token });
        }
        const token = generateToken(user);
        return res.status(200).json({ message: `Welcome Back ${user.name}`, token });
    } catch (error) {
        return res.status(500).json({ message: "Error to Login User. Try Again Later." });
    }
}

exports.Register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existUser = await Users.findOne({ email });
        if (existUser) {
            return res.status(400).json({ message: "User Already Exist" });
        }
        if (!email.includes('@') || !email.includes('.com')) {
            return res.status(400).json({ message: "Invalid Email Format" });
        }
        if (!email || !password || !name) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const otp = otpGen.generate(6, { upperCase: false, specialChars: false, alphabets: false });
        await Otp.create({ email, otp });
        await sendVerificationEmail(email, otp);
        const user = await Users.create({ name, email, password });
        await Profile.create({
            phone: 0,
            address: "None",
            userId: user._id
        });
        return res.status(200).json({ message: "Registration Successful" });
    } catch (error) {
        return res.status(500).json({ message: "Server Error", error });
    }
}

exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const otpData = await Otp.findOne({ email, otp });
        if (!otpData) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        // Find and update in one go to get the fresh user data
        const user = await Users.findOneAndUpdate(
            { email },
            { $set: { verified: true } },
            { new: true }
        );

        await Otp.deleteMany({ email });

        const token = generateToken(user);

        // Wrap email in try/catch so it doesn't break the whole response
        // try {
        //     await verifySuccessEmail(user.email, user.name);
        // } catch (mailErr) {
        //     console.error("Mail failed, but user verified:", mailErr);
        // }

        return res.status(200).json({
            message: "OTP Verified Successfully!",
            token,
            email: user.email
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
}

exports.resendOtp = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await Users.findOne({ email });
        if (user.verified) {
            return res.status(400).json({ message: "User is already verified." });
        }

        const otp = otpGen.generate(6, { upperCase: false, specialChars: false, alphabets: false });
        const otpData = await Otp.findOneAndUpdate(
            { email },
            { otp },
            { new: true, upsert: true }
        );
        await sendVerificationEmail(email, otp);
        return res.status(200).json({ message: "OTP Resent Successfully!" });
    } catch (error) {
        return res.status(500).json({ message: "Error Resending OTP. Try Again Later.", error: error.message });
    }
}

exports.getMyProfile = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await Users.findById(id);
        const profile = await Profile.findOne({ userId: id });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "User Profile", user, profile });
    } catch (error) {
        return res.status(500).json({ message: "Server Error" });
    }
}