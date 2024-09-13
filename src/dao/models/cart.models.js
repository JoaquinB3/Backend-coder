import mongoose from "mongoose";

const cartColl = "carts"
const cartsSchema = new mongoose.Schema(
    {
        products: [
            {
                id: String,
                quantity: Number
            }
        ]
    },
    {
        timestamps: true,
        strict: false
    }
)

export const cartsModel = mongoose.model(
    cartsColl,
    cartsSchema
)