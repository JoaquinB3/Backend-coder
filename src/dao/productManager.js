import fs from "fs"
import { productsModel } from "./models/products.models.js"
import { parse } from "url";


export class ProductManager {
    static path

    static async getProducts(limit=10, page=1, query={}, sort={}){ 
        const response = await productsModel.paginate(query,{lean:true, limit, page, sort})

        return { 
            status: response ? "success" : "error",
            payload: response.docs,
            totalPage: response.totalPage,
            prevPage: response.prevPage,
            nextPage: response.nextPage,
            page: response.page,
            hasPrevPage: response.hasPrevPage,
            hasNextPage: response.hasNextPage,
            prevLink: response.hasPrevPage ? `/api/products?limit=${limit}&page=${response.prevPage}` : null,
            nextLink: response.hasNextPage ? `/api/products?limit=${limit}&page=${response.nextPage}` : null,
            }; 

    }

    static async getProductsById(pid){
        return await productsModel.findOne({ _id: pid }).lean();
    }

    static async addProduct(newProduct){
        await productsModel.create(newProduct);
    }

    static async updateProduct(updateProduct, pid) {
        await productsModel.updateOne( { _id: pid}, updateProduct);
    } 

    static async deleteProductsById(pid){
        await productsModel.deleteOne({ _id: pid});
    }
}