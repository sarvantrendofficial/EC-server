const Cart = require('../Models/cartModel');

/* =========================
   GET CART BY USER
========================= */
exports.getCartByUser = async (req, res) => {
    const { id } = req.params; // userId

    try {
        const cart = await Cart.findOne({ userId: id })
            .populate("items.productId");   // <-- ADD THIS

        if (!cart) {
            return res.status(200).json({
                success: true,
                cart: {
                    userId: id,
                    items: []
                }
            });
        }

        return res.status(200).json({
            success: true,
            cart
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Server Error',
            error
        });
    }
};


/* =========================
   ADD TO CART
========================= */
exports.addToCart = async (req, res) => {
    try {
        const { userId, product } = req.body;

        if (!userId || !product) {
            return res.status(400).json({
                success: false,
                message: 'Invalid request'
            });
        }

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = await Cart.create({
                userId,
                items: [product]
            });
        } else {
            const itemIndex = cart.items.findIndex(
                item => item.productId.toString() === product.productId
            );

            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += product.quantity || 1;
            } else {
                cart.items.push(product);
            }

            await cart.save();
        }

        return res.status(200).json({
            success: true,
            cart
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Add to cart failed'
        });
    }
};

/* =========================
   REMOVE ITEM FROM CART
========================= */
exports.removeFromCart = async (req, res) => {
    const { userId, productId } = req.body;

    try {
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        cart.items = cart.items.filter(
            item => item.productId.toString() !== productId
        );

        await cart.save();

        return res.status(200).json({
            success: true,
            cart,
            message: "Item Deleted Successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Remove failed'
        });
    }
};
