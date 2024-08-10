import { Router } from "express";
import { CartManager } from "../dao/cartManager.js";


export const cartsRouter = Router();

cartsRouter.post('/', async (req, res) => {
    try {
        await CartManager.createCart();
        res.status(201).json({mesagge: "El cart fue creado con existo"});
        res.setHeader("Content-Type", "Application/json");
    } catch (error) {
        res.status(500).json({error: "No se pudo crear el carrito"})
        res.setHeader("Content-Type", "Application/json");
    }
});

cartsRouter.get('/:cid', async (req, res) =>{
    const { cid } = req.params;

    if (!cid) return res.status(400).json({error: "Se tiene que pasar un cid como parametro"});

    try {
        const cartProducts = await CartManager.getCart(cid);
        if (!cartProducts) return res.status(404).json({error: "Cart no encontrado"});
        res.setHeader("Content-Type", "Application/json");
        res.status(200).json(cartProducts);   
    } catch (error) {
        console.log("Error al encontrar el cid");
        res.setHeader("Content-Type", "Application/json");
    }
});

cartsRouter.post('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    try {
        await CartManager.addProductToCart(cid, pid);
        res.status(200).json({message: "Se agrego el producto correctamente"});
        res.setHeader("Content-Type", "Application/json");
    } catch (error) {
        res.status(500).json({error: "Hubo un error de servidor"})
        res.setHeader("Content-Type", "Application/json");
    }
});
