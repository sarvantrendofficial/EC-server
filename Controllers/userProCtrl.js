const Profile = require('../Models/userProModel');
const Users = require('../Models/usersModel');

exports.CreateProfile = async (req, res) => {
    const { phone, address, userId } = req.body;
    try {
        const user = await Users.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const existingProfile = await Profile.findOne({ userId });
        if (existingProfile) {
            return res.status(400).json({ message: "Profile already exists for this user" });
        }
        await Profile.create({ phone, address, userId });
        return res.status(200).json({ message: "Profile Created Successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    const { id } = req.params;
    const { phone, address } = req.body;
    try {
        const profile = await Profile.findByIdAndUpdate(id, { phone, address }, { new: true });
        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }
        return res.status(200).json({ message: "Profile updated successfully", profile });
    } catch (error) {
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
};