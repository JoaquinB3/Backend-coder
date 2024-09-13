import { json, Router } from "express";
import { CartManager } from "../dao/cartManager.js";
import { isValidObjectId } from "mongoose";


export const cartsRouter = Router();

cartsRouter.post('/', async (req, res) => {
    try {
        await CartManager.createCart();
        res.status(201).json({mesagge: "El cart fue creado con existo"});
        // return res.setHeader("Content-Type", "Application/json");
    } catch (error) {
        res.status(500).json({error: "No se pudo crear el carrito"})
        // return res.setHeader("Content-Type", "Application/json");
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
    
    if (!cid || !pid) return res.status(400).json({error: "Se tiene que pasar un cid y un pid como parametro"});

    if (!isValidObjectId(cid) && !isValidObjectId(pid)){
        res.setHeader("Content-Type", "Application/json");
        return res.status(400).json({message: "Pid o Cid invalido"});
    }
    
    try {
        await CartManager.addProductToCart(cid, pid);
        res.setHeader("Content-Type", "Application/json");
        return res.status(200).json({message: "Se agrego el producto correctamente"});
    } catch (error) {
        res.setHeader("Content-Type", "Application/json");
        return res.status(500).json({error: "Hubo un error de servidor"})
    }
});


cartsRouter.delete('/:cid/products/:pid', async (req, res) =>{
    const { cid, pid } = req.params;

    if (!cid || !pid) return res.status(400).json({error: "Se tiene que pasar un cid y un pid como parametro"});

    if (!isValidObjectId(cid) && !isValidObjectId(pid)){
        res.setHeader("Content-Type", "Application/json");
        return res.status(400).json({message: "Pid o Cid invalido"});
    }
    try {
        await CartManager.deleteProductFrom(cid, pid);
        res.setHeader("Content-Type", "Application/json");
        res.status(200).json({message: "Producto eliminado con exito"});   
    } catch (error) {
        console.log("Error al encontrar el producto");
        res.setHeader("Content-Type", "Application/json");
    }
});

cartsRouter.delete('/:cid', async (req, res) =>{
    const { cid } = req.params;

    if (!cid ) return res.status(400).json({error: "Se tiene que pasar un cid como parametro"});

    if (!isValidObjectId(cid)){
        res.setHeader("Content-Type", "Application/json");
        return res.status(400).json({message: "Cid invalido"});
    }
    try {
        await CartManager.deleteAllProductsFromCart(cid);
        res.setHeader("Content-Type", "Application/json");
        res.status(200).json({message: "El carrito se vacio con exito"});   
    } catch (error) {
        console.log("Error al encontrar el carrito");
        res.setHeader("Content-Type", "Application/json");
    }
});

cartsRouter.put('/:cid', async (req, res) => {
    const { cid } = req.params;
    const products = req.body;

    if (!cid ) return res.status(400).json({error: "Se tiene que pasar un cid como parametro"});

    if (!isValidObjectId(cid)){
        res.setHeader("Content-Type", "Application/json");
        return res.status(400).json({message: "Cid invalido"});
    }

    if (!products ) return res.status(400).json({error: "Se tiene que pasar un array de productos como parametro"});

    try {
        await CartManager.updateCart(cid, products);
        res.setHeader("Content-Type", "Application/json");
        res.status(200).json({message: "El carrito fue actualizado con exito"});   
    } catch (error) {
        console.log("Error al encontrar el carrito");
        res.setHeader("Content-Type", "Application/json");
    }
});

cartsRouter.put('/:cid/carts/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (!cid || !pid ) return res.status(400).json({error: "Se tiene que pasar un cid y un pid como parametro"});

    if (!isValidObjectId(cid) || !isValidObjectId(cid)){
        res.setHeader("Content-Type", "Application/json");
        return res.status(400).json({message: "Cid o pid invalido"});
    }

    if (!quantity ) return res.status(400).json({error: "Se tiene que pasar una cantidad como parametro"});

    if(isNaN(Number(quantity))) return res.status(400),json({error: "El cuantity tiene que ser un numero"});

    try {
        await CartManager.updateQuantityProduct(cid, pid, quantity);
        res.setHeader("Content-Type", "Application/json");
        res.status(200).json({message: "El carrito fue actualizado con exito"});   
    } catch (error) {
        console.log("Error al encontrar el carrito");
        res.setHeader("Content-Type", "Application/json");
    }
});
