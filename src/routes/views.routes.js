import { Router } from "express";
import { ProductManager } from "../dao/productManager.js";
import { CartManager } from "../dao/cartManager.js";

export const viewsRouter = Router();

viewsRouter.get("/products", async (req,res) => {
    try { 
        const products = await ProductManager.getProducts();
        res.setHeader("Content-Type", "text/html");
        res.status(200).render("home", {
            title: "Home",
            style: "home.css",    
            products: products.payload,
        })
    } catch (error) {
        console.error('Error al obtener los productos', error);
        res.status(500).send('Error interno del servidor');
    }
});

viewsRouter.get("/realtimeproducts", async(req,res) => {
    try {
        const title = "Real Time products" 
        const products = await ProductManager.getProducts();
        res.setHeader("Content-Type", "text/html");
        res.status(200).render("realTimeProducts", {
            title,
            style: "home.css",    
            products: products.payload,
        })
    } catch (error) {
        console.error('Error al obtener los productos', error);
        res.status(500).send('Error interno del servidor');
    }
})

viewsRouter.get("/carts", async (req,res) => {
    try { 
        const specificCartId = "66e52da8999edc73fbbd1dc1";
        const cart = await CartManager.getCart(specificCartId);
        res.setHeader("Content-Type", "text/html");
        res.status(200).render("carrito", {
            title: "Carrito",
            style: "home.css",
            cart,
        })
    } catch (error) {
        console.error('Error al obtener el carrito', error);
        res.status(500).send('Error interno del servidor');
    }
});