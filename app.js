const express = require('express');
const { engine } = require('express-handlebars');
const socketIO = require('socket.io');
const ProductManager = require('./managers/ProductManager');
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');

const app = express();
const PORT = 8080;

app.use(express.json()); // Middleware para parsear el body en formato JSON
app.use(express.static('public'))

// Configuración de Handlebars
app.engine('handlebars', engine()); 
app.set('view engine', 'handlebars');
app.set('views', './views'); 

// Instanciar ProductManager
const productManager = new ProductManager('./products.json');

// Rutas 
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Ruta para la página de productos en tiempo real
app.get('/realtimeproducts', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('realTimeProducts', { title: 'Productos en Tiempo Real', products });
});

// Ruta ppal para renderizar la vista de productos
app.get('/', async (req, res) => {
    const products = await productManager.getProducts(); 
    res.render('home', { title: 'Lista de Productos', products });
});

// Servidor y WebSocket
const server = app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// Integración de Socket.IO
const io = socketIO(server);

// Escuchar la conexión de los clientes
io.on('connection', async (socket) => {
    console.log('Nuevo cliente conectado');

    // Emitir productos actuales cuando un cliente se conecta
    const products = await productManager.getProducts();
    socket.emit('productosActualizados', products);  

    // Recibir el evento para agregar un nuevo producto
    socket.on('agregarProducto', async (newProduct) => {
        try {
            // Agregar el nuevo producto
            await productManager.addProduct(newProduct);

            // Obtener la lista actualizada de productos
            const updatedProducts = await productManager.getProducts();

            // Emitir la lista de productos actualizada a todos los clientes conectados
            io.emit('productosActualizados', updatedProducts); 
        } catch (error) {
            console.error(error.message);
        }
    });

    // Recibir el evento para eliminar un producto
    socket.on('eliminarProducto', async (id) => {
        try {
            // Eliminar el producto por ID
            await productManager.deleteProduct(Number(id));

            // Obtener la lista actualizada de productos
            const updatedProducts = await productManager.getProducts();

            // Emitir la lista de productos actualizada a todos los clientes conectados
            io.emit('productosActualizados', updatedProducts);
        } catch (error) {
            console.error(`Error al eliminar producto: ${error.message}`);
        }
    });

    // Evento de desconexión
    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});
