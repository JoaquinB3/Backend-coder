import { Router } from "express";
import { ProductManager } from "../dao/productManager.js";

export const viewsRouter = Router();

viewsRouter.get("/", async (req,res) => {
    try {
        const title = "Productos" 
        const productsRec = await ProductManager.getProducts();

        const products = productsRec.map(prod => {
            return {
                title: prod.title,
                description: prod.description,
                code: prod.code,
                price: prod.price,
                status: prod.status,
                stock: prod.stock,
                category: prod.category,
                thumbnails: prod.thumbnails,
            }
        })

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