const Order = require('../Models/orderModel');

exports.createOrder = async (req, res) => {
    try {
        await Order.create(req.body);
        return res.status(200).json({ message: "Order Placed Successfully", success: true });
    } catch (error) {
        return res.status(500).json({ message: "Server Error", success: false });
    }
}

exports.getMyOrders = async (req, res) => {
    const { id } = req.params;
    try {
        const orders = await Order.find({ userId: id }).sort({ createdAt: -1 });
        if (!orders) {
            return res.status(404).json({ message: "No Orders Found" });
        }
        return res.status(200).json(orders);
    } catch (error) {
        return res.status(500).json({ message: 'Server Error' });
    }
};

exports.getAllorders = async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        return res.status(200).json({ message: "Order Fetched", orders });
    } catch (error) {
        return res.status(500).json({ message: 'Server Error' });
    }
}

exports.updateOrders = async (req, res) => {
    const { status } = req.body;
    const { id } = req.params;
    try {
        await Order.findByIdAndUpdate(id, { status });
        return res.status(200).json({ message: "Order Status Updated" });
    } catch (error) {
        return res.status(500).json({ message: "Server Error" });
    }
}