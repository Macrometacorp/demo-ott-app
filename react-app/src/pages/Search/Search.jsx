import "./search.scss"
import Poster from "../../components/Poster/Poster"
import { motion } from "framer-motion"
import { searchVariants, staggerHalf } from "../../motionUtils"
import { useHistory } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { selectSearchInputValue } from "../../redux/search/search.selectors"
import { changeSearchInputValue, fetchSearchResultsAsync } from "../../redux/search/search.actions"
import { FaCheck, FaTimes } from "react-icons/fa"

const Search = (searchResults) => {
    const history = useHistory()
    const dispatch = useDispatch()
    const selectInputValue = useSelector(selectSearchInputValue)
    const { results } = searchResults

    const style = { border: `2px solid #9C1AFF` }

    const addSearchTerm = (searchTerm, type) => {
        let searchInputs = ""
        let _type = type
        if (_type === "asset") {
            searchInputs = searchTerm
        } else {
            _type = "credits"
            searchInputs = typeof selectInputValue === "string" ? [searchTerm] : [...selectInputValue, searchTerm]
        }

        dispatch(changeSearchInputValue(searchInputs))

        history.push(`/search?q=${searchInputs}`)
        dispatch(fetchSearchResultsAsync(searchInputs, _type))
    }

    const removeSearchTerm = (searchTerm) => {
        const searchInputs = selectInputValue.filter((term) => term !== searchTerm)
        dispatch(changeSearchInputValue(searchInputs))

        history.push(`/search?q=${searchInputs}`)
        dispatch(fetchSearchResultsAsync(searchInputs))
    }

    return (
        <div className="Search">
            {results.assets && results.assets.length > 0 && (
                <div className="Search__flex">
                    <h2 className="Search__title">Search results for:&nbsp;</h2>
                    <div className="Search__flex">
                        {typeof selectInputValue !== "string" && selectInputValue.length > 1 ? (
                            selectInputValue.map((term, index) => (
                                <motion.li
                                    key={index}
                                    variants={searchVariants}
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="Search__search-term-li"
                                >
                                    <span>{term}</span>
                                    <FaTimes
                                        className="Search__remove-search-term"
                                        onClick={() => removeSearchTerm(term)}
                                    />
                                </motion.li>
                            ))
                        ) : (
                            <motion.li
                                variants={searchVariants}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.95 }}
                                className="Search__search-term-li"
                            >
                                <span>{selectInputValue}</span>
                            </motion.li>
                        )}
                    </div>
                </div>
            )}
            <motion.div className="Search__search-suggestions">
                <motion.div>
                    {results.assets && results.assets.length > 0 ? (
                        <>
                            <h3>Movie / TV</h3>
                            <motion.ul>
                                {results.assets.map((result, index) => (
                                    <motion.li
                                        key={index}
                                        variants={searchVariants}
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="Search__text-placeholder"
                                        style={style}
                                    >
                                        <FaCheck
                                            className="Search__add-search-term"
                                            onClick={() =>
                                                addSearchTerm(
                                                    result.title || result.original_title || result.name,
                                                    "asset",
                                                )
                                            }
                                        />
                                        <span className="Search__search-term">
                                            {result.title || result.original_title || result.name}
                                        </span>
                                    </motion.li>
                                ))}
                            </motion.ul>
                        </>
                    ) : (
                        <></>
                    )}
                </motion.div>

                <motion.div>
                    {results.cast && results.cast.length > 0 ? (
                        <>
                            <h3>Cast</h3>
                            <motion.ul>
                                {results.cast.map((result, index) => (
                                    <motion.li
                                        key={index}
                                        variants={searchVariants}
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="Search__text-placeholder"
                                        style={style}
                                    >
                                        <FaCheck
                                            className="Search__add-search-term"
                                            onClick={() => addSearchTerm(result.name, "cast")}
                                        />
                                        <span className="Search__search-term">{result.name}</span>
                                    </motion.li>
                                ))}
                            </motion.ul>
                        </>
                    ) : (
                        <></>
                    )}
                </motion.div>

                <motion.div>
                    {results.crew && results.crew.length > 0 ? (
                        <>
                            <h3>Crew</h3>
                            <motion.ul>
                                {results.crew.map((result, index) => (
                                    <motion.li
                                        key={index}
                                        variants={searchVariants}
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="Search__text-placeholder"
                                        style={style}
                                    >
                                        <FaCheck
                                            className="Search__add-search-term"
                                            onClick={() => addSearchTerm(result.name, "crew")}
                                        />
                                        <span className="Search__search-term">{result.name}</span>
                                    </motion.li>
                                ))}
                            </motion.ul>
                        </>
                    ) : (
                        <></>
                    )}
                </motion.div>
            </motion.div>
            <motion.div className="Search__wrp" variants={staggerHalf} initial="initial" animate="animate" exit="exit">
                {results.assets && results.assets.length > 0 ? (
                    results.assets.map((result) => <Poster key={result.id} item={result} {...result} />)
                ) : (
                    <h2 className="Search__title">
                        Sorry, we searched everywhere but we did not found any movie or tv-show with that title.
                    </h2>
                )}
            </motion.div>
        </div>
    )
}

export default Search
