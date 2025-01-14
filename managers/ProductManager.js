const fs = require('fs');

class ProductManager {
    constructor(path) {
        this.path = path;
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

    async addProduct(product) {
        const products = await this.readFile();
        const { title, description, code, price, status = true, stock, category, thumbnails = [] } = product;

        if (!title || !description || !code || !price || !stock || !category) {
            throw new Error("Todos los campos son obligatorios.");
        }

        if (products.some(p => p.code === code)) {
            throw new Error(`El código ${code} ya está registrado.`);
        }

        // Calcular el próximo ID dinámicamente
        const nextId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;

        const newProduct = {
            id: nextId,
            title, description, code, price, status, stock, category, thumbnails
        };

        products.push(newProduct);
        await this.writeFile(products);
        return newProduct;
    }

    async getProducts() {
        return await this.readFile();
    }

    async getProductById(id) {
        const products = await this.readFile();
        const product = products.find(p => p.id === id);
        if (!product) {
            throw new Error("Producto no encontrado.");
        }
        return product;
    }

    async updateProduct(id, updatedFields) {
        const products = await this.readFile();
        const productIndex = products.findIndex(p => p.id === id);

        if (productIndex === -1) {
            throw new Error("Producto no encontrado.");
        }

        products[productIndex] = {
            ...products[productIndex],
            ...updatedFields,
            id // Evitar que se actualice el id
        };

        await this.writeFile(products);
        return products[productIndex];
    }

    async deleteProduct(id) {
        if (typeof id !== 'number') {
            throw new Error("El ID debe ser un número.");
        }

        let products = await this.readFile();
        const productIndex = products.findIndex(p => p.id === id);

        if (productIndex === -1) {
            throw new Error("Producto no encontrado.");
        }

        products = products.filter(p => p.id !== id);
        await this.writeFile(products);
        return `Producto con ID ${id} eliminado.`;
    }
}

module.exports = ProductManager;

