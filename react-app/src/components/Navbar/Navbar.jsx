import "./navbar.scss";
import { useState, useRef } from "react";
import useViewport from "../../hooks/useViewport";
import useScroll from "../../hooks/useScroll";
import useOutsideClick from "../../hooks/useOutsideClick";
import { motion } from "framer-motion";
import { navbarFadeInVariants } from "../../motionUtils";
import { LOGO_URL, PROFILE_PIC_URL } from "../../requests";
import { FaCaretDown } from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";
import Searchbar from "../Searchbar/Searchbar";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/auth/auth.selectors";
import { signOutStart } from "../../redux/auth/auth.actions";

const Navbar = () => {
    const { width } = useViewport();
    const isScrolled = useScroll(70);
    const [genresNav, setGenresNav] = useState(false);
    const [profileNav, setProfileNav] = useState(false);
    const genresNavRef = useRef();
    const profileNavRef = useRef();
    const currentUser = useSelector(selectCurrentUser);
    const dispatch = useDispatch();
    const [isHoveringTv, setIsHoveringTv] = useState(false);
    const [isHoveringMovies, setIsHoveringMovies] = useState(false);

    useOutsideClick(genresNavRef, () => {
        if (genresNav) setGenresNav(false);
    });
    useOutsideClick(profileNavRef, () => {
        if (profileNav) setProfileNav(false);
    });

    return (
        <>
            <motion.nav
                className={`Navbar ${isScrolled && "Navbar__fixed"}`}
                variants={navbarFadeInVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
            >
                <Link to="/">
                    <img
                        className="Navbar__logo"
                        src={width >= 600 ? LOGO_URL : LOGO_URL}
                        alt=""
                    />
                </Link>
                {width >= 1024 ? (
                    <ul className="Navbar__primarynav Navbar__navlinks">
                        <li className="Navbar__navlinks--link">
                            <NavLink
                                to="/browse"
                                activeClassName="activeNavLink"
                            >
                                Home
                            </NavLink>
                        </li>
                        <li
                            className="Navbar__navlinks--link"
                            onMouseEnter={() => setIsHoveringTv(true)}
                            onMouseLeave={() => setIsHoveringTv(false)}
                        >
                            <NavLink
                                to="/tvseries"
                                activeClassName="activeNavLink"
                            >
                                TV Series
                            </NavLink>
                            {isHoveringTv && (
                                <div className="Navbar__navprofile--content active">
                                    <ul className="Navbar__navprofile--content-wrp">
                                        <li className="Navbar__navlinks--link">
                                            <NavLink
                                                to="/tvseries/macrometa"
                                                activeClassName="activeNavLink"
                                            >
                                                Macrometa Originals
                                            </NavLink>
                                        </li>
                                        <li className="Navbar__navlinks--link">
                                            <NavLink
                                                to="/tvseries/trending"
                                                activeClassName="activeNavLink"
                                            >
                                                Trending Now
                                            </NavLink>
                                        </li>
                                        <li className="Navbar__navlinks--link">
                                            <NavLink
                                                to="/tvseries/actionadventure"
                                                activeClassName="activeNavLink"
                                            >
                                                Action & Adventure
                                            </NavLink>
                                        </li>
                                        <li className="Navbar__navlinks--link">
                                            <NavLink
                                                to="/tvseries/animation"
                                                activeClassName="activeNavLink"
                                            >
                                                Animation
                                            </NavLink>
                                        </li>
                                        <li className="Navbar__navlinks--link">
                                            <NavLink
                                                to="/tvseries/comedy"
                                                activeClassName="activeNavLink"
                                            >
                                                Comedy
                                            </NavLink>
                                        </li>
                                        <li className="Navbar__navlinks--link">
                                            <NavLink
                                                to="/tvseries/scififantasy"
                                                activeClassName="activeNavLink"
                                            >
                                                Sci-Fi & Fantas
                                            </NavLink>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </li>
                        <li
                            className="Navbar__navlinks--link"
                            onMouseEnter={() => setIsHoveringMovies(true)}
                            onMouseLeave={() => setIsHoveringMovies(false)}
                        >
                            <NavLink
                                to="/movies"
                                activeClassName="activeNavLink"
                            >
                                Movies
                            </NavLink>
                            {isHoveringMovies && (
                                <div
                                    className="Navbar__navprofile--content active"
                                    // onMouseEnter={() =>
                                    //     setIsHoveringMovies(true)
                                    // }
                                >
                                    <ul className="Navbar__navprofile--content-wrp">
                                        <li className="Navbar__navlinks--link">
                                            <NavLink
                                                to="/movies/originals"
                                                activeClassName="activeNavLink"
                                            >
                                                Macrometa Originals
                                            </NavLink>
                                        </li>
                                        <li className="Navbar__navlinks--link">
                                            <NavLink
                                                to="/movies/action"
                                                activeClassName="activeNavLink"
                                            >
                                                Action
                                            </NavLink>
                                        </li>
                                        <li className="Navbar__navlinks--link">
                                            <NavLink
                                                to="/movies/adventure"
                                                activeClassName="activeNavLink"
                                            >
                                                Adventure
                                            </NavLink>
                                        </li>
                                        <li className="Navbar__navlinks--link">
                                            <NavLink
                                                to="/movies/comedy"
                                                activeClassName="activeNavLink"
                                            >
                                                Comedy
                                            </NavLink>
                                        </li>
                                        <li className="Navbar__navlinks--link">
                                            <NavLink
                                                to="/movies/horror"
                                                activeClassName="activeNavLink"
                                            >
                                                Horror
                                            </NavLink>
                                        </li>
                                        <li className="Navbar__navlinks--link">
                                            <NavLink
                                                to="/movies/romance"
                                                activeClassName="activeNavLink"
                                            >
                                                Romance
                                            </NavLink>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </li>
                        {/* <li className="Navbar__navlinks--link">
              <NavLink to="/popular" activeClassName="activeNavLink">
                New & Popular
              </NavLink>
            </li> */}
                        {/* <li className="Navbar__navlinks--link">
                            <NavLink to="/mylist" activeClassName="activeNavLink">
                                My list
                            </NavLink>
                        </li> */}
                    </ul>
                ) : (
                    <div
                        className={`Navbar__primarynav Navbar__navlinks ${
                            isScrolled && "Navbar__primarynav--scrolled"
                        }`}
                        onClick={() => setGenresNav(!genresNav)}
                    >
                        <span className="Navbar__navlinks--link">Discover</span>
                        <FaCaretDown className="Navbar__primarynav--toggler Navbar__primarynav--caret" />
                        <div
                            className={`Navbar__primarynav--content ${
                                genresNav ? "active" : ""
                            }`}
                        >
                            {genresNav && (
                                <ul
                                    className="Navbar__primarynav--content-wrp"
                                    ref={genresNavRef}
                                >
                                    <li className="Navbar__navlinks--link">
                                        <NavLink
                                            to="/browse"
                                            activeClassName="activeNavLink"
                                        >
                                            Home
                                        </NavLink>
                                    </li>
                                    <li className="Navbar__navlinks--link">
                                        <NavLink
                                            to="/tvseries"
                                            activeClassName="activeNavLink"
                                        >
                                            TV Series
                                        </NavLink>
                                    </li>
                                    <li className="Navbar__navlinks--link">
                                        <NavLink
                                            to="/movies"
                                            activeClassName="activeNavLink"
                                        >
                                            Movies
                                        </NavLink>
                                    </li>
                                    {/* <li className="Navbar__navlinks--link">
                                        <NavLink to="/popular" activeClassName="activeNavLink">
                                            New & Popular
                                        </NavLink>
                                    </li> */}
                                    {/* <li className="Navbar__navlinks--link">
                                        <NavLink to="/mylist" activeClassName="activeNavLink">
                                            My list
                                        </NavLink>
                                    </li> */}
                                </ul>
                            )}
                        </div>
                    </div>
                )}
                <div className="Navbar__secondarynav">
                    <div className="Navbar__navitem">
                        <Searchbar />
                    </div>
                    {currentUser && (
                        <div className="Navbar__navitem">
                            <div
                                className={`Navbar__navprofile ${
                                    profileNav && "active"
                                }`}
                                onClick={() => setProfileNav(!profileNav)}
                            >
                                <img
                                    className="Navbar__navprofile--avatar Navbar__navprofile--toggler"
                                    src={
                                        currentUser && currentUser.photoURL
                                            ? currentUser.photoURL
                                            : PROFILE_PIC_URL
                                    }
                                    alt="Profile Picture"
                                />
                                <FaCaretDown className="Navbar__navprofile--toggler Navbar__navprofile--caret" />
                                <div
                                    className={`Navbar__navprofile--content ${
                                        profileNav ? "active" : ""
                                    }`}
                                >
                                    {profileNav && (
                                        <ul
                                            className="Navbar__navprofile--content-wrp"
                                            ref={profileNavRef}
                                        >
                                            {currentUser && (
                                                <li
                                                    className="Navbar__navlinks--link"
                                                    onClick={() =>
                                                        dispatch(signOutStart())
                                                    }
                                                >
                                                    Sign Out
                                                </li>
                                            )}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </motion.nav>
        </>
    );
};

export default Navbar;
