import  mongoose from "mongoose";

const productsColl = "products"
const productsSchema = new mongoose.Schema(
    {
        title: String,
        description: String,
        code: String,
        price: Number,
        status: String,
        stock: Number,
        category: String,
        thumbnails: [],
    },
    {
        timestamps: true,
        strict: false,
    }
)

export const productsModel = mongoose.model(
    productsColl,
    productsSchema
)