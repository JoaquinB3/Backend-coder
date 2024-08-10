import express, { json } from 'express';
import { productsRouter } from './routes/products.routes.js';
import { cartsRouter } from './routes/carts.routes.js';
import { ProductManager } from './dao/productManager.js';
import { CartManager } from './dao/cartManager.js';
const app = express()

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

ProductManager.path = "./src/dataBase/products.json"
CartManager.path =  "./src/dataBase/carts.json"

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`)
})