import { Router } from "express";
import { ProductManager } from "../dao/productManager.js";
import crypto from 'crypto';
import { uploader } from "../utils/uploader.js";
import { io } from "../app.js";

export const productsRouter = Router();


productsRouter.get('/', async (req, res) => {
    const {limit, page, query, sort} = req.query
    
    try {
        const products = await ProductManager.getProducts(
            limit, 
            page, 
            query && {
                $expr:{
                    $eq: [{ $toLower: "$category"}, query.toLowerCase()]
                }
            }, 
            sort === "asc" ? {price: 1} : {price: -1});
        return res.status(200).json(products)
    } catch (error) {
        console.log("Error al encontrar los productos");
    }

       
});

productsRouter.get('/:pid', async (req, res) => {
    const { pid } = req.params;
    

    if (!pid) return res.status(400).json({error: "Se debe pasar un id por parametro"})
    
        try {

            const product = await ProductManager.getProductsById(pid);
        
            if (!product) return res.status(404).json({error: "Producto no encontrado"})
            
            res.status(200).json(product)
            
        } catch (error) {
            console.log("Error al encontrar el pid");
        }
    
});

productsRouter.post('/',uploader.array("thumbnails", 3), async (req,res) =>{
    
    if (!req.files) return res.status(400).json({error: "No se pudieron guardar las imagenes"});

    console.log(req.files);
    
    const {
        title,
        description,
        code,
        price,
        stock,
        category,
    } = req.body;

    if (!price || !stock || !title || !description || !code || !category) {
        return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    const priceNumber = Number(price);
    const stockNumber = Number(stock);

    if (isNaN(price) || (isNaN(stock))) return res.status(400).json({error: "El stock y el precio deben ser un numero"})
    if ( stock < 0 ) return res.status(400).json({error: "El stock debe ser mayor o igual a 0"});
    if ( price <= 0 ) return req.status(400).json({error: "El precio debe ser mayor que 0"});

    const existingProduct = await ProductManager.getProductsByCode(code);
    if (existingProduct){
        return res.status(400).json({error: "El codigo ya esta en uso."});
    } 
    const newProduct = {
        id: crypto.randomUUID(),
        title,
        description,
        code,
        price: priceNumber,
        status: true,
        stock: stockNumber,
        category,
        thumbnails: req.files.map(file => file.path) 
    }

    try {   
        await ProductManager.addProduct(newProduct);
        io.emit("addProduct", newProduct);
        res.setHeader("Content-Type", "application/json");
        res.status(201).json({message: "Se agrego el producto correctamente"});
    } catch (error) {
        res.setHeader("Content-Type", "application/json");
        console.log("Error: no se pudo agregar el producto");    
    }    

}); 

productsRouter.put('/:pid',uploader.array("thumbnails", 3), async (req, res) =>{
    const { pid } = req.params;
    
    if (!pid) return res.status(400).json({error: "Se debe pasar un id como parametro"})

    if (!req.files) return res.status(400).json({error: "No se pudieron guardar las imagenes"});
    
    const {
        title,
        description,
        code,
        price,
        stock,
        category,
    } = req.body;

    const priceNumber = Number(price);
    const stockNumber = Number(stock);

    if (isNaN(price) || (isNaN(stock))) return res.status(400).json({error: "El stock y el precio deben ser un numero"})
    if ( stock < 0 ) return res.status(400).json({error: "El stock debe ser mayor o igual a 0"});
    if ( price<= 0 ) return req.status(400).json({error: "El precio debe ser mayor que 0"});


    const updateProduct = {
        title,
        description,
        code,
        price: priceNumber,
        status: true,
        stock: stockNumber,
        category,
        thumbnails: req.files.map(file => file.path) 
    }

    try {   
        await ProductManager.updateProduct(updateProduct, pid);
        res.status(200).json({mensaje: "El producto fue actualizado con exito"});
    } catch (error) {
        console.log("Error: no se pudo modificar el producto");    
    }
});

productsRouter.delete('/:pid', async (req, res) =>{
    const { pid } = req.params;

    if (!pid) return res.status(400).json({error: "Se debe pasar un id por parametro"})
    
        try {

            await ProductManager.deleteProductsById(pid);
            io.emit("deleteProduct", pid);
            res.status(200).json({message: "Se elimino el producto con exito"});

        } catch (error) {
            console.log("Error al encontrar el pid");
            res.status(500).json({ error: "no se pudo eliminar el producto"});
        }
});

