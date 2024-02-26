import Product from '../models/product.model.js'; // Importing the Product model
import extend from 'lodash/extend.js'; // For extending the product object
import errorHandler from './error.controller.js'; // Assuming error handling remains the same

const create = async (req, res) => {
    const product = new Product(req.body);
    try {
        await product.save();
        return res.status(200).json({
            message: "Product successfully added!"
        });
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        });
    }
};

const list = async (req, res) => {
    let query = {};

    // Check if there is a name query parameter for searching within the name field
    if (req.query.name) {
        query.name = { $regex: req.query.name, $options: 'i' }; // Case-insensitive regex search
    }

    try {
        let products = await Product.find(query); // Use the constructed query
        res.json(products);
    } catch (err) {
        return res.status(400).json({
            error: 'Could not retrieve products'
        });
    }
};


const productByID = async (req, res, next, id) => {
    try {
        let product = await Product.findById(id);
        if (!product)
            return res.status('400').json({
                error: "Product not found"
            });
        req.product = product;
        next();
    } catch (err) {
        return res.status('400').json({
            error: "Could not retrieve product"
        });
    }
};

const read = (req, res) => {
    return res.json(req.product);
};

const update = async (req, res) => {
    try {
        let product = req.product;
        product = extend(product, req.body);
        product.updated = Date.now();
        await product.save();
        res.json(product);
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        });
    }
};

const remove = async (req, res) => {
    try {
        let product = req.product;
        let deletedProduct = await product.deleteOne();
        res.json(deletedProduct);
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        });
    }
};

const removeAll = async (req, res) => {
    try {
        const result = await Product.deleteMany({});
        res.json({ message: `${result.deletedCount} products were deleted successfully` });
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        });
    }
};

export default { create, productByID, read, list, remove, update, removeAll };
