const express = require('express');
const CartManager = require('../managers/CartManager');
const router = express.Router();
const cartManager = new CartManager('./carts.json');

// Ruta para crear un carrito
router.post('/', async (req, res) => {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
});

// Ruta para obtener los productos del carrito por ID
router.get('/:cid', async (req, res) => {
    try {
        const cart = await cartManager.getCartById(parseInt(req.params.cid));
        res.json(cart.products); 
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Ruta para agregar un producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const updatedCart = await cartManager.addProductToCart(parseInt(req.params.cid), parseInt(req.params.pid));
        res.json(updatedCart); 
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

module.exports = router;

