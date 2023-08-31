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
  const [tickedBrands, setTickedBrands] = useState([]);
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
    const selectedBrandsLen = tickedBrands.length;
    for (var i = 0; i < resultsLen; i++) {
      if (results[i].price <= maxPrice && results[i].price >= minPrice) {
        if (selectedBrandsLen != 0) {
          for (var j = 0; j < selectedBrandsLen; j++) {
            if (results[i].brand === tickedBrands[j]) {
              displayResults.push(results[i]);
            }
          }
        } else {
          displayResults.push(results[i]);
        }
      }
    }
    setShowResults(displayResults);
  }

  function updateSelectedBrands(selectedBrands) {
    setTickedBrands(selectedBrands);
    var route = `/api/search?searchTitle=${searchTitle}`;
    for (var i = 0; i < selectedBrands.length; i++) {
      route += `&brand=${selectedBrands[i]}`;
    }
    axios
      .get(route)
      .then((res) => {
        setShowResults(res.data.phones);
        setBrandNames(res.data.brands);
        setMinPrice(0);
        setMaxPrice(res.data.maxPrice);
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
          <div className="phones">
            <DisplayPhones phones={showResults}/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchState;