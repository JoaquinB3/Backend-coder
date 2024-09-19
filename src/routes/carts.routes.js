import { json, Router } from "express";
import { CartManager } from "../dao/cartManager.js";
import { ProductManager } from "../dao/productManager.js"
import { isValidObjectId } from "mongoose";


export const cartsRouter = Router();

cartsRouter.post('/', async (req, res) => {
    try {
        const cart = await CartManager.createCart();
        res.status(201).json({mesagge: "El cart fue creado con existo", cart});
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

        const product = await ProductManager.getProductsById(pid);
        if (!product) {
            return res.status(404).json({error: "El producto no existe en la base de datos"})
        }

        const cartExist = await CartManager.getCart(cid);
        if (!cartExist) return res.status(404).json({error: `El cart con id ${cid} no existe`});
         

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

        const cartExist = await CartManager.getCart(cid);
        if (!cartExist) return res.status(404).json({error: `El cart con id ${cid} no existe`});

        await CartManager.deleteProductFrom(cid, pid);
        res.setHeader("Content-Type", "Application/json");
        res.status(200).json({message: "Producto eliminado con exito"});   
    } catch (error) {
        console.log("Error al encontrar el producto");
        res.setHeader("Content-Type", "Application/json");
        return res.status(500).json({
            error: "Error inesperado en el servidor",
            detalle: `${error.message}`,
        });
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

        const cartExist = await CartManager.getCart(cid);
        if (!cartExist) return res.status(404).json({error: `El cart con id ${cid} no existe`});

        await CartManager.deleteAllProductsFromCart(cid);
        res.setHeader("Content-Type", "Application/json");
        res.status(200).json({message: "El carrito se vacio con exito"});   
    } catch (error) {
        console.log("Error al encontrar el carrito");
        res.setHeader("Content-Type", "Application/json");
        return res.status(500).json({
            error: "Error inesperado en el servidor",
            detalle: `${error.message}`,
        });
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

        for (const prod of products) {
            if (!isValidObjectId(prod.product)){
                return res.status(400).json({error: `El id del producto ${prod.product} no es valido`})
            } 
            const prodExist = await ProductManager.getProductsById(prod.product);
            if (!prodExist) {
                return res.status(404).json({error: `El producto con id ${prod.product} no existe`});
            }
        };

        const cartExist = await CartManager.getCart(cid);
        if (!cartExist) return res.status(404).json({error: `El cart con id ${cid} no existe`});

        await CartManager.updateCart(cid, products);
        res.setHeader("Content-Type", "Application/json");
        res.status(200).json({message: "El carrito fue actualizado con exito"});   
    } catch (error) {
        console.log("Error al encontrar el carrito");
        res.setHeader("Content-Type", "Application/json");
        return res.status(500).json({
            error: "Error inesperado en el servidor",
            detalle: `${error.message}`,
        });
    }
});

cartsRouter.put('/:cid/products/:pid', async (req, res) => {
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

        const prodExist = await ProductManager.getProductsById(pid);
        if (!prodExist) {
            return res.status(404).json({error: `El producto con id ${pid} no existe`});
        }

        const cartExist = await CartManager.getCart(cid);
        if (!cartExist) return res.status(404).json({error: `El cart con id ${cid} no existe`});

        await CartManager.updateQuantityProduct(cid, pid, quantity);
        res.setHeader("Content-Type", "Application/json");
        res.status(200).json({message: "El carrito fue actualizado con exito"});   
    } catch (error) {
        console.log("Error al encontrar el carrito");
        res.setHeader("Content-Type", "Application/json");
        return res.status(500).json({
            error: "Error inesperado en el servidor",
            detalle: `${error.message}`,
        });
    }
});
