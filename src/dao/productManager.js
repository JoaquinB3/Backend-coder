import fs from "fs"
import { productsModel } from "./models/products.models.js"
import { parse } from "url";


export class ProductManager {
    static path

    static async getProducts(limit=20, page=1, query={}, sort={}){
        return productsModel.paginate(query,{lean:true, limit, page, sort})

    }

    static async getProductsById(pid){
        if(fs.existsSync(this.path)){
            const products = await fs.promises.readFile(this.path, {encoding: "utf-8"})  

            const prod = JSON.parse(products).find(p => p.id === pid)
            return prod;
        }else{
            return []
        }
    }

    static async addProduct(newProduct){

        if (fs.existsSync(this.path)) {
            const products = await fs.promises.readFile(this.path, {encoding:"utf-8"});
            const productsArray = JSON.parse(products)
            productsArray.push(newProduct);    

            await fs.promises.writeFile(this.path, JSON.stringify(productsArray, null, 2), {encoding: "utf-8"});

        }
    }


    static async updateProduct(updateProduct, pid) {
        if (fs.existsSync(this.path)) {
            const products = JSON.parse(await fs.promises.readFile(this.path, {encoding:"utf-8"}));
            const newProducts = products.map(product => product.id === pid ? {...product, ...updateProduct} : product);

            await fs.promises.writeFile(this.path, JSON.stringify(newProducts, null, 2), {encoding: "utf-8"});

        }
    } 

    static async deleteProductsById(pid){

        if (fs.existsSync(this.path)) {
            const products = JSON.parse(await fs.promises.readFile(this.path, {encoding: "utf-8"}));
            const newProducts = products.filter(product => product.id !== pid);
            
            await fs.promises.writeFile(this.path, JSON.stringify(newProducts, null, 2), {encoding: "utf-8"});

        }
    }
}