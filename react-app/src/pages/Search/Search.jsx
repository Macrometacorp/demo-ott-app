import "./search.scss"
import Poster from "../../components/Poster/Poster"
import { motion } from "framer-motion"
import { searchVariants, staggerHalf } from "../../motionUtils"
import { useHistory } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { selectSearchInputValue } from "../../redux/search/search.selectors"
import { changeSearchInputValue, fetchSearchResultsAsync } from "../../redux/search/search.actions"
import { FaCheck, FaTimes } from "react-icons/fa"
import { useEffect, useState } from "react"

const Search = (searchResults) => {
    const history = useHistory()
    const dispatch = useDispatch()
    const selectInputValue = useSelector(selectSearchInputValue)
    const { results } = searchResults

    const [assetsSuggestions, setAssetsSuggestions] = useState([])
    const [assetsNewSuggestions, setAssetsNewSuggestions] = useState([])

    const [castSuggestions, setCastSuggestions] = useState([])
    const [castNewSuggestions, setCastNewSuggestions] = useState([])

    const [crewSuggestions, setCrewSuggestions] = useState([])
    const [crewNewSuggestions, setCrewNewSuggestions] = useState([])

    const style = { border: `2px solid #9C1AFF` }

    useEffect(() => {
        if (results.assets) {
            setAssetsSuggestions(results.assets.slice(1).slice(0, 5))
            setAssetsNewSuggestions(results.assets.slice(6, results.assets.length))
            setCastSuggestions(results.cast.slice(0, 5))
            setCastNewSuggestions(results.cast.slice(6, results.cast.length))
            setCrewSuggestions(results.crew.slice(0, 5))
            setCrewNewSuggestions(results.crew.slice(6, results.crew.length))
        }
    }, [results])

    const addSearchTerm = (searchTerm, type) => {
        let searchInputs = ""
        let _type = type
        if (_type === "asset") {
            searchInputs = searchTerm
        } else {
            _type = "credits"
            searchInputs =
                typeof selectInputValue === "string"
                    ? [selectInputValue, searchTerm]
                    : [...selectInputValue, searchTerm]
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

    const removeSuggestions = (removeSuggestion, type) => {
        let suggestion
        switch (type) {
            case "asset":
                {
                    const _assetsSuggestions = assetsSuggestions.filter((suggestion) => {
                        if (suggestion.title) {
                            return suggestion.title !== removeSuggestion
                        }
                        return suggestion.name !== removeSuggestion
                    })
                    suggestion = assetsNewSuggestions.shift()
                    suggestion
                        ? setAssetsSuggestions(() => [..._assetsSuggestions, suggestion])
                        : setAssetsSuggestions(() => [..._assetsSuggestions])
                }
                break
            case "cast":
                {
                    const _castSuggestions = castSuggestions.filter(
                        (suggestion) => suggestion.name !== removeSuggestion,
                    )
                    suggestion = castNewSuggestions.shift()
                    suggestion
                        ? setCastSuggestions(() => [..._castSuggestions, suggestion])
                        : setCastSuggestions(() => [..._castSuggestions])
                }
                break
            default:
                {
                    const _crewSuggestions = crewSuggestions.filter(
                        (suggestion) => suggestion.name !== removeSuggestion,
                    )
                    suggestion = crewNewSuggestions.shift()
                    suggestion
                        ? setCrewSuggestions(() => [..._crewSuggestions, suggestion])
                        : setCrewSuggestions(() => [..._crewSuggestions])
                }
                break
        }
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
                {assetsSuggestions && assetsSuggestions.length > 0 ? (
                    <motion.ul>
                        {assetsSuggestions.map((result, index) => (
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
                                    onClick={() => addSearchTerm(result.title || result.name, "asset")}
                                />
                                <span className="Search__search-term">{result.title || result.name}</span>
                                <FaTimes
                                    className="Search__remove-search-term"
                                    onClick={() => removeSuggestions(result.title || result.name, "asset")}
                                />
                            </motion.li>
                        ))}
                    </motion.ul>
                ) : (
                    <></>
                )}

                <motion.ul>
                    {results.cast && results.cast.length > 0 && castSuggestions.length ? (
                        castSuggestions.map((result, index) => (
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
                                <FaTimes
                                    className="Search__remove-search-term"
                                    onClick={() => removeSuggestions(result.name, "cast")}
                                />
                            </motion.li>
                        ))
                    ) : (
                        <></>
                    )}
                </motion.ul>

                <motion.ul>
                    {results.crew && results.crew.length > 0 && crewSuggestions.length ? (
                        crewSuggestions.map((result, index) => (
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
                                <FaTimes
                                    className="Search__remove-search-term"
                                    onClick={() => removeSuggestions(result.name, "crew")}
                                />
                            </motion.li>
                        ))
                    ) : (
                        <></>
                    )}
                </motion.ul>
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
