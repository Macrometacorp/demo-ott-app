require("dotenv").config()
const { truncateCollection } = require("./truncateImport")
const { importMovies, importTvShows } = require("./dataImport")
const jsC8 = require("jsc8")

console.log("Federation URL: ", process.env.GDN_URL)

const execute = async () => {
    // Truncate All collection supporting MetaFlix demo
    await truncateCollection()

    // Import Movies and Credits from TMDB
    await importMovies()

    // Import Tv Shows and Credits from TMDB
    await importTvShows()
}

execute()
