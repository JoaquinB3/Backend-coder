import  mongoose from "mongoose";
import paginate from "mongoose-paginate-v2"

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

productsSchema.plugin(paginate)

export const productsModel = mongoose.model(
    productsColl,
    productsSchema
)