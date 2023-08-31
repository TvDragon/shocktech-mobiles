import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import HeaderBar from "../../components/HeaderBar";
import "../../css/global.css";
import "../../css/search-state.css";
import DisplayPhones from "../Home/DisplayPhones";
import DisplayBrands from "./DisplayBrands";

function SearchState() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchTitle = queryParams.get('searchTitle');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState([]);
  const [brandNames, setBrandNames] = useState([]);
  const [displayBrandNames, setDisplayBrandsNames] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);

  useEffect(() => {
    axios
      .get("/api/search", {
        params: {
          searchTitle: searchTitle,
        }
      })
      .then((res) => {
        setResults(res.data.phones);
        setShowResults(res.data.phones);
        setBrandNames(res.data.brands);
        setDisplayBrandsNames(res.data.brands);
        setMinPrice(res.data.minPrice !== null &&
                    res.data.minPrice !== undefined ? res.data.minPrice : 0);
        setMaxPrice(res.data.maxPrice !== null &&
                    res.data.maxPrice !== undefined ? res.data.maxPrice : 0);
      })
      .catch((err) => console.log(err));
  }, [searchTitle]);

  function setPriceLimit() {
    const resultsLen = results.length;
    const displayResults = [];
    setMinPrice(Number(minPrice));
    setMaxPrice(Number(maxPrice));
    for (var i = 0; i < resultsLen; i++) {
      if (results[i].price <= maxPrice && results[i].price >= minPrice) {
        displayResults.push(results[i]);
      }
    }
    setShowResults(displayResults);
  }

  function updateSelectedBrands(selectedBrands) {
    var route = `/api/search?searchTitle=${searchTitle}`;
    for (var i = 0; i < selectedBrands.length; i++) {
      route += `&brand=${selectedBrands[i]}`;
    }
    axios
      .get(route)
      .then((res) => {
        setResults(res.data.phones);
        setBrandNames(res.data.brands);
      })
      .catch((err) => console.log(err));
  }
  
  const brandNameChange = (e) => {
    var brand = e.target.value;
    if (brand === '') {
      setDisplayBrandsNames(brandNames);
    } else {
      brand = brand.toLowerCase();
      var brandsLen = brandNames.length;
      var brandLen = brand.length;
      const showBrands = [];
      for (var i = 0; i < brandsLen; i++) {
        if (brandNames[i][0].substring(0, brandLen).toLowerCase() === brand) {
          showBrands.push(brandNames[i]);
        }
      }
      setDisplayBrandsNames(showBrands);
    }
  }

  const minPriceChange = (e) => {
    setMinPrice(e.target.value);
  }
  
  const maxPriceChange = (e) => {
    setMaxPrice(e.target.value);
  }
  
  return (
    <div className="content">
      <HeaderBar />
      <div className="components">
        <div className="component-one">
          <div className="filter-by-brand">
            <p id="brand-filter-title">Brand</p>
            <div className="brandBar">
              <input id="brandBar" name="search" type="text" placeholder="Search..." onChange={brandNameChange}></input>
            </div>
            <DisplayBrands brands={displayBrandNames} searchTitle={searchTitle} updateSelectedBrands={updateSelectedBrands}/>
          </div>
          <div className="filter-by-price">
            <p id="price-filter-title">Price</p>
            <div className="filter-price">
              <input className="price-input" value={minPrice} onChange={minPriceChange}></input>
              <p id="to">To</p>
              <input className="price-input" value={maxPrice} onChange={maxPriceChange}></input>
              <button id="searchBtn" type="submit" onClick={setPriceLimit}><p id="go">GO</p></button>
            </div>
          </div>
        </div>
        <div className="component-two">
          <div className="component-two-header">
            <div className="sort-by-component">
              <p className="sort-by-text">Sort By</p>
              <select name="options" id="sort-by">
                <option value="Relevancy">Relevancy</option>
                <option value="Price: Low - High">Price: Low - High</option>
                <option value="Price: High - Low">Price: High - Low</option>
                <option value="Popularity">Popularity</option>
              </select>
            </div>
          </div>
          <div className="phones">
            <DisplayPhones phones={showResults}/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchState;