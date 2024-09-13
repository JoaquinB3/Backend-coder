import fs from "fs"
import crypto from 'crypto'
import { cartsModel } from "./models/cart.models.js";

export class CartManager {
    static path;

    static async createCart() {
        
        const newCart = {
            products: []
        }
        await cartsModel.create(newCart);
    }

    static async getCart(cid) {
        return await cartsModel.findOne({ _id: cid}).populate("products.product");
    } 

    static async addProductToCart(cid, pid) {
        const productExist = await cartsModel.findOne({
            _id: cid,
            products: { $elemMatch: { product: pid } },
        });

        if (productExist) {
            // Si existe el producto, incremento la cantidad
            await cartsModel.updateOne(
                { _id: cid, 'products.product': pid },
                { $inc: { 'products.$.quantity': 1 } },
            );
        } else {
            // Si no existe el producto, lo agrego al carrito
            await cartsModel.updateOne(
                { _id: cid },
                { $push: { products: { product: pid, quantity: 1 } } },
                { new: true },
            );
        }
    }

    static async deleteProductFrom(cid, pid){

        await cartsModel.updateOne(
            { _id: cid },
            { $pull: { products: { product: pid } } }, 
            { new: true } 
        );

    }

    static async deleteAllProductsFromCart(cid){
        const cart = await cartsModel.findOne({ _id: cid})
        if (cart.products.length === 0) {
            return { message: "El carrito ya esta vacio" };
        }else{
            // Elimino todos los productos del carrito
            await cartsModel.updateOne(
                { _id: cid },
                { $set: { products: [] } }, 
                { new: true } 
            );
        }
    }
    
    static async updateCart(cid, products){
        await cartsModel.updateOne({ _id:cid }, { $set: { products: products} }) 
    }

    static async updateQuantityProduct(cid, pid, quantity){
        await cartsModel.updateOne(
            { _id: cid, "products.product": pid}, 
            { $set : { "products.$.quantity": quantity }}
        )
    }


}