import mongoose from "mongoose";

const cartsColl = "carts"
const cartsSchema = new mongoose.Schema(
    {
        products: {
            type: [
                {
                    product: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "products",
                    },
                    quantity: Number
                }
            ]
        }
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