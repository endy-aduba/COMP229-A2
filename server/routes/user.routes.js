//ready to commit
import express from 'express';
import productCtrl from '../controllers/products.controller.js'; // Make sure this is pointing to your products controller

const router = express.Router();

// Routes for the "/api/products" endpoint
router.route('/api/products')
      .post(productCtrl.create) // Create a new product
      .get(productCtrl.list)
      .delete(productCtrl.removeAll); // List all products

// Middleware to extract product ID and attach the product object to the request
router.param('productId', productCtrl.productByID);

// Routes for specific products identified by ":productId"
router.route('/api/products/:productId')
      .get(productCtrl.read) // Read a specific product's details
      .put(productCtrl.update) // Update a specific product
      .delete(productCtrl.remove); // Delete a specific product

export default router;