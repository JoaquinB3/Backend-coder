import fs from "fs"
import crypto from 'crypto'

export class CartManager {
    static path;

    static async createCart() {
        const newCart = {
            id: crypto.randomUUID(),
            products: []
        }

        if (fs.existsSync(this.path)) {
            const carts = await fs.promises.readFile(this.path, {enconding: "utf-8"});
            const cartsArray = JSON.parse(carts);
            cartsArray.push(newCart)
            await fs.promises.writeFile(this.path, JSON.stringify(cartsArray, null, 2), {encoding: "utf-8"});      
        }
    }

    static async getCart(cid) {
        if (fs.existsSync(this.path)) {
            const carts = await fs.promises.readFile(this.path, {encoding: "utf-8"});
            const cart = JSON.parse(carts).find(c => c.id === cid)
            return cart.products; 
        }else{
            return [];
        }
    } 

    static async addProductToCart(cid, pid) {
        if (fs.existsSync(this.path)) {
            const carts = JSON.parse(await fs.promises.readFile(this.path, { encoding: "utf-8" }));
            const cart = carts.find(cart => cart.id === cid);
            
            if (!cart) {
                throw new Error('Cart not found');
            }
    
            const product = cart.products.find(p => p.product === pid);
            if (product) {
                product.quantity += 1;
            } else {
                cart.products.push({ product: pid, quantity: 1 });
            }
    
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2), { encoding: "utf-8" });
        } else {
            throw new Error('Error de servidor');
        }
    }

}