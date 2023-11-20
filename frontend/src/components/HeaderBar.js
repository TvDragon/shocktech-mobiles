import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import "../css/header-bar.css";
import Logo from "../assets/shocktech-mobile-logo.png";
import ProfileIcon from "../assets/profile-icon.png";
import ShoppingCartIcon from "../assets/shopping-cart.png";

import AuthContext from "../context/AuthContext";

function HeaderBar() {

  const { user, updateUser } = useContext(AuthContext);
  const [searchTitle, setSearchTitle] = useState("");
  const [showDefaultIcons, setShowDefaultIcons] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (window.innerWidth > 650) {
        setShowDropdown(false);
        setShowDefaultIcons(true);
      } else {
        setShowDefaultIcons(false);
      }
    }, 1000);	// For production I can change this
    return () => clearInterval(interval);
  });

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const searchTitleChange = (e) => {
    setSearchTitle(e.target.value);
  }

  return (
    <nav>
      <ul>
        <li>
          <img id="logo" src={Logo} alt={Logo}></img>
        </li>
        <li id="brand"><Link to="/" className="no-link-style">ShockTech Mobiles</Link></li>
        <li className="searchBar">
          <input id="searchBar" name="search" type="text" placeholder="Search..." onChange={searchTitleChange}></input>
          <Link id="searchLink" to={"/search?searchTitle=" + searchTitle}>
            <button id="searchBtn" type="submit"><i className="fa fa-search"></i></button>
          </Link>
        </li>
        {showDefaultIcons && (
            <li className="dropdown-icons">
              <div className="icon">
                {!user ?
                  <Link to="/account">
                    <img className="icon-image" src={ProfileIcon} alt={ProfileIcon}></img>
                  </Link>  
                : <Link to="/profile">
                    <img className="icon-image" src={ProfileIcon} alt={ProfileIcon}></img>
                  </Link>  
                }
              </div>
              <div className="icon">
                <Link to="/cart">
                  <img className="icon-image" src={ShoppingCartIcon} alt={ShoppingCartIcon}></img>
                </Link>
              </div>
            </li>
          )}
        <li className="smallIcon" onClick={toggleDropdown}>
          &#9776;
          {showDropdown && (
            <div className="dropdown-icons">
              <div className="icon">
                {!user ?
                  <Link to="/account">
                    <img className="icon-image" src={ProfileIcon} alt={ProfileIcon}></img>
                  </Link>  
                : <Link to="/profile">
                    <img className="icon-image" src={ProfileIcon} alt={ProfileIcon}></img>
                  </Link>  
                }
              </div>
              <div className="icon">
                <Link to="/cart">
                  <img className="icon-image" src={ShoppingCartIcon} alt={ShoppingCartIcon}></img>
                </Link>
              </div>
            </div>
          )}
        </li>
      </ul>
    </nav>	
  );
}

export default HeaderBar;