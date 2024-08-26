import { Router } from "express";
import { ProductManager } from "../dao/productManager.js";

export const viewsRouter = Router();

viewsRouter.get("/", async (req,res) => {
    try {
        const title = "Productos" 
        const products = await ProductManager.getProducts();
        res.setHeader("Content-Type", "text/html");
        res.status(200).render("home", {
            title,
            style: "home.css",    
            products,
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
            products,
        })
    } catch (error) {
        console.error('Error al obtener los productos', error);
        res.status(500).send('Error interno del servidor');
    }
})