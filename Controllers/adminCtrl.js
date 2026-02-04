const Admin = require('../Models/adminAuth');

exports.Login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const admin = await Admin.findOne({ email, password });
        if (!admin) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }
        if(admin.password != password){
            return res.status(404).json({message: "Invalid Credentials"});
        }

        return res.status(200).json({ message: "Login Successful", admin});
    } catch (error) {
        return res.status(500).json({ message: "Server Error" });
    }
}