const Product = require('../Models/productsModel');

exports.addProducts = async (req, res) => {
    try {
        const { name, description, price, mrp, category, isActive, imageUrls } = req.body;

        // Convert URL list back to array
        const urlImages = imageUrls ? JSON.parse(imageUrls) : [];

        // Upload local files to Cloudinary
        const uploadedImages = req.files
            ? req.files.map(file => file.path)
            : [];

        // Final image list = Cloudinary URLs + User URLs
        const finalImages = [...uploadedImages, ...urlImages];

        if (finalImages.length === 0) {
            return res.status(400).json({ message: 'At least one image required' });
        }

        const discountAmount = mrp - price;
        const discountPer = (discountAmount / mrp) * 100;

        const product = await Product.create({
            name,
            description,
            price,
            mrp,
            discount: Math.trunc(discountPer),
            category,
            images: finalImages,
            isActive
        });

        res.status(200).json({
            message: 'Product Created Successfully',
            product
        });

    } catch (error) {
        res.status(500).json({
            message: "Can't able to create Product",
            error
        });
    }
};


exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product)
            return res.status(400).json({ message: 'Product not found' });

        res.status(200).json(product);
    } catch {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({ isActive: true });
        res.status(200).json(products);
    } catch {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            description,
            price,
            mrp,
            category,
            isActive,
            existingImages,
            imageUrls
        } = req.body;

        // Convert to arrays safely
        const keptImages = Array.isArray(existingImages)
            ? existingImages
            : existingImages
                ? [existingImages]
                : [];

        const urlImages = imageUrls ? JSON.parse(imageUrls) : [];

        // Upload new local images to Cloudinary
        const uploadedImages = req.files
            ? req.files.map(file => file.path)
            : [];

        // Final merged list
        const finalImages = [...keptImages, ...uploadedImages, ...urlImages];

        if (finalImages.length === 0) {
            return res.status(400).json({ message: 'At least one image required' });
        }

        const discountAmount = mrp - price;
        const discountPer = (discountAmount / mrp) * 100;

        const updated = await Product.findByIdAndUpdate(
            id,
            {
                name,
                description,
                price,
                mrp,
                discount: Math.ceil(discountPer),
                category,
                images: finalImages,
                isActive
            },
            { new: true, runValidators: true }
        );

        if (!updated) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({
            message: 'Product Updated Successfully',
            product: updated
        });

    } catch (error) {
        res.status(500).json({
            message: 'Server Error',
            error
        });
    }
};


exports.delProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product)
            return res.status(400).json({ message: 'Product not found' });

        res.status(200).json({ message: 'Product Deleted' });
    } catch {
        res.status(500).json({ message: 'Server Error' });
    }
};
