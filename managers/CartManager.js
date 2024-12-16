const fs = require('fs');

class CartManager {
    constructor(path) {
        this.path = path;
        this.nextId = 1;
    }

    async readFile() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch {
            return [];
        }
    }

    async writeFile(data) {
        await fs.promises.writeFile(this.path, JSON.stringify(data, null, 2));
    }

    async createCart() {
        const carts = await this.readFile();
    
        // checkear el id maximo existente, sino agregar nuevo con id 1
        const newId = carts.length > 0 ? Math.max(...carts.map(c => c.id)) + 1 : 1;
    
        const newCart = { id: newId, products: [] };
        carts.push(newCart);
    
        await this.writeFile(carts);
        return newCart;
    }

    async getCartById(id) {
        const carts = await this.readFile();
        const cart = carts.find(c => c.id === id);
        if (!cart) {
            throw new Error("Carrito no encontrado.");
        }
        return cart;
    }

    async addProductToCart(cid, pid) {
        const carts = await this.readFile();
        const cartIndex = carts.findIndex(c => c.id === cid);

        if (cartIndex === -1) {
            throw new Error("Carrito no encontrado.");
        }

        // Buscar si el producto existe en el carrito
        const productIndex = carts[cartIndex].products.findIndex(p => p.product === pid);

        if (productIndex !== -1) {
            // Si el producto existe, incrementa
            carts[cartIndex].products[productIndex].quantity++;
        } else {
            // Si el producto no existe, se agrega 1
            carts[cartIndex].products.push({ product: pid, quantity: 1 });
        }

        await this.writeFile(carts);
        return carts[cartIndex]; // Devuelve el carrito actualizado
    }
}

module.exports = CartManager;
