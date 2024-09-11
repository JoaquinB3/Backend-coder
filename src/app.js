import express, { json } from 'express';
import { Server } from "socket.io";
import { productsRouter } from './routes/products.routes.js';
import { cartsRouter } from './routes/carts.routes.js';
import { ProductManager } from './dao/productManager.js';
import { CartManager } from './dao/cartManager.js';
import { viewsRouter } from './routes/views.routes.js';
import { engine } from 'express-handlebars';
import { dbConnection } from './dbConnection.js';
import { config } from './config/config.js';
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// app.use('/api/products', productsRouter);
app.use('/api/products', (req,res,next )=>{req.socket = io; next()}, productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);


ProductManager.path = "./src/dataBase/products.json"
CartManager.path =  "./src/dataBase/carts.json"

const PORT = config.PORT;
const serverHttp = app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`)
});

export const io = new Server(serverHttp);


io.on('connection', (socket) => {
    console.log(`Se conecto un cliente con id: ${ socket.id}`);
    
});

dbConnection();