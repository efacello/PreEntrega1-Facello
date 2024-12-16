const express = require('express');
const ProductManager = require('../managers/ProductManager');
const router = express.Router();
const productManager = new ProductManager('./products.json');

// Ruta para obtener todos los productos
router.get('/', async (req, res) => {
    const products = await productManager.getProducts();
    res.json(products);
});

// Ruta para obtener un producto por su ID
router.get('/:pid', async (req, res) => {
    try {
        const product = await productManager.getProductById(parseInt(req.params.pid));
        res.json(product);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Ruta para agregar un nuevo producto
router.post('/', async (req, res) => {
    try {
        const newProduct = await productManager.addProduct(req.body);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Ruta para actualizar un producto
router.put('/:pid', async (req, res) => {
    try {
        const updatedProduct = await productManager.updateProduct(parseInt(req.params.pid), req.body);
        res.json(updatedProduct);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Ruta para eliminar un producto
router.delete('/:pid', async (req, res) => {
    try {
        const message = await productManager.deleteProduct(parseInt(req.params.pid));
        res.json({ message });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

module.exports = router;

