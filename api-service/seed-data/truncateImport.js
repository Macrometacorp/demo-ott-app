const jsC8 = require("jsc8")

const jsc8Client = new jsC8({
    url: process.env.GDN_URL,
    apiKey: process.env.API_KEY,
})

const collections = [
    "assets",
    "credits",
    "asset_credit_edge",
    "genres_asset_edge",
    "my_list",
    // "users",
]

exports.truncateCollection = async () => {
    collections.forEach(async (name) => {
        try {
            await jsc8Client.collection(name).truncate()
        } catch (error) {
            console.log("\n----------------")
            console.log("Truncate failed for collection: ", name)
            console.log(error)
            console.log("----------------\n")
        }
    })
}
