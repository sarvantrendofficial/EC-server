const Order = require('../Models/orderModel');

const ALLOWED_PINCODES = ['620013', '620014', '620021', '620018', '620008', '620001', '620019', '620010', '620007'];

exports.createOrder = async (req, res) => {
    try {
        const { customer, items, totalAmount, userId } = req.body;

        if (!customer || !customer.pincode) {
            return res.status(400).json({ success: false, message: "Pincode is required." });
        }

        if (!ALLOWED_PINCODES.includes(customer.pincode)) {
            return res.status(400).json({
                success: false,
                message: "Sorry, we do not deliver to this pincode yet."
            });
        }

        const newOrder = new Order({
            customerName: customer.name,
            phone: customer.phone,
            address: customer.address,
            pincode: customer.pincode,
            items: items,
            totalAmount: totalAmount,
            userId: userId || req.body.userId
        });

        await newOrder.save();

        return res.status(200).json({ message: "Order Placed Successfully", success: true });

    } catch (error) {
        console.error("Create Order Error:", error);
        return res.status(500).json({ message: "Server Error", success: false, error: error.message });
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