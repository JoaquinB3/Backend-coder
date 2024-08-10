import { Router } from "express";
import { ProductManager } from "../dao/productManager.js";
import crypto from 'crypto';
import { uploader } from "../utils/uploader.js";

export const productsRouter = Router();


productsRouter.get('/', async (req, res) => {
    const {limit} = req.query
    
    try {
        const products = await ProductManager.getProducts();
        
        if(!limit) return res.status(200).json(products)
        
        const limitNumber = Number(limit)
        if (isNaN(limitNumber)) {
            return res.send("El argumento limit tiene que ser un nuemro")
        }else{
            const productsLimit = products.slice(0, limitNumber)
            return res.status(200).json(productsLimit)
        }
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

    const priceNumber = Number(price);
    const stockNumber = Number(stock);

    if (isNaN(price) || (isNaN(stock))) return res.status(400).json({error: "El stock y el precio deben ser un numero"})
    if ( stock < 0 ) return res.status(400).json({error: "El stock debe ser mayor o igual a 0"});
    if ( price <= 0 ) return req.status(400).json({error: "El precio debe ser mayor que 0"});


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
        res.status(201).json({message: "Se agrego el producto correctamente"});
    } catch (error) {
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
            res.status(200).json({message: "Se elimino el producto con exito"});

        } catch (error) {
            console.log("Error al encontrar el pid");
        }

});


// {
//     "id": "5cfc31f7-62b4-4e02-b063-6695b2794ab5",
//     "title": "Xiaomi Note 10 5G",
//     "description": "Muy bueno",
//     "code": "LT-ABC-033",
//     "price": 800000,
//     "status": true,
//     "stock": 4,
//     "category": "Smartphone",
//     "thumbnails": []
//   }