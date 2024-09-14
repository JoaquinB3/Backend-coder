import 'dotenv/config'

export const config = {
    PORT: 8080,
    MONGO_URL: `mongodb+srv://joaquinbotteri:${process.env.MONGODB_PASS}@cluster0.amlvz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
    DB_NAME: "tecnoDB"
}