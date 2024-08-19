import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import HeaderBar from "../../components/HeaderBar";
import "../../css/global.css";
import "../../css/search-state.css";
import DisplayPhones from "../Home/DisplayPhones";
import DisplayBrands from "./DisplayBrands";
import DisplayConditions from "./DisplayConditions";

function SearchState() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchTitle = queryParams.get('searchTitle');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState([]);
  const [sortByValue, setSortByValue] = useState("Relevancy");
  const [brandNames, setBrandNames] = useState([]);
  const [tickedBrands, setTickedBrands] = useState([]);
  const [displayBrandNames, setDisplayBrandsNames] = useState([]);
  const [tickedConditions, setTickedConditions] = useState([]);
  const [displayConditions, setDisplayConditions] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [isBrandDropdownVisible, setIsBrandDropdownVisible] = useState(false);
  const [isPriceDropdownVisible, setIsPriceDropdownVisible] = useState(false);

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
        setDisplayConditions(res.data.conditions);
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
    const selectedConditionsLen = tickedConditions.length;
    for (var i = 0; i < resultsLen; i++) {
      if (results[i].price <= maxPrice && results[i].price >= minPrice) {
        if (selectedBrandsLen !== 0 && selectedConditionsLen !== 0) {
          for (let j = 0; j < selectedBrandsLen; j++) {
            if (results[i].brand === tickedBrands[j] && (displayResults.indexOf(results[i]) < 0)) { // Don't add if already found in array
              displayResults.push(results[i]);
            }
          }

          for (let j = 0; j < selectedConditionsLen; j++) {
            if (results[i].condition === tickedConditions[j] && (displayResults.indexOf(results[i]) < 0)) {
              displayResults.push(results[i])
            }
          }
        } else if (selectedBrandsLen !== 0) {
          for (let j = 0; j < selectedBrandsLen; j++) {
            if (results[i].brand === tickedBrands[j]) {
              displayResults.push(results[i]);
            }
          }
        } else if (selectedConditionsLen !== 0) {
          for (let j = 0; j < selectedConditionsLen; j++) {
            if (results[i].condition === tickedConditions[j]) {
              displayResults.push(results[i])
            }
          }
        } else {
          displayResults.push(results[i]);
        }
      }
    }
    setShowResults(displayResults);
  }

  function updateFilter(selectedBrands, selectedConditions) {
    setTickedBrands(selectedBrands);
    setTickedConditions(selectedConditions);
    var route = `/api/search?searchTitle=${searchTitle}&sortBy=${sortByValue}`;
    for (let i = 0; i < selectedBrands.length; i++) {
      route += `&brand=${selectedBrands[i]}`;
    }
    for (let i = 0; i < selectedConditions.length; i++) {
      route += `&condition=${selectedConditions[i]}`;
    }
    axios
      .get(route)
      .then((res) => {
        setResults(res.data.phones);
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

  const toggleBrandDropdown = () => {
    setIsBrandDropdownVisible(!isBrandDropdownVisible);
  }
  
  const togglePriceDropdown = () => {
    setIsPriceDropdownVisible(!isPriceDropdownVisible);
  }

  function sortBy(e) {
    const sortByValue = e.target.value;
    setSortByValue(e.target.value);
    var route = `/api/search?searchTitle=${searchTitle}&sortBy=${sortByValue}`;
    for (let i = 0; i < tickedBrands.length; i++) {
      route += `&brand=${tickedBrands[i]}`;
    }
    for (let i = 0; i < tickedConditions.length; i++) {
      route += `&condition=${tickedConditions[i]}`;
    }
    axios
      .get(route)
      .then((res) => {
        setResults(res.data.phones);
        setShowResults(res.data.phones);
        setBrandNames(res.data.brands);
        setMinPrice(0);
        setMaxPrice(res.data.maxPrice);
      })
      .catch((err) => console.log(err));
  }
  
  return (
    <div className="content">
      <HeaderBar />
      <div className="filter-small">
        <div className="brand-filter">
          <button onClick={toggleBrandDropdown}>Brand {isBrandDropdownVisible ? "↑" : "↓"}</button>
          {isBrandDropdownVisible ? 
            <div className="filter-by-brand">
              <div className="brandBar">
                <input id="brandBar" name="search" type="text" placeholder="Search..." onChange={brandNameChange}></input>
              </div>
              <DisplayBrands brands={displayBrandNames} selectedConditions={tickedConditions} updateFilter={updateFilter}/>
            </div> : <div></div>
          }
        </div>
        <div className="price-filter">
          <button onClick={togglePriceDropdown}>Price {isPriceDropdownVisible ? "↑" : "↓"}</button>
          {isPriceDropdownVisible ?
            <div className="filter-price">
              <input className="price-input" value={minPrice} onChange={minPriceChange}></input>
              <p id="to">To</p>
              <input className="price-input" value={maxPrice} onChange={maxPriceChange}></input>
              <button id="searchBtn" type="submit" onClick={setPriceLimit}><p id="go">GO</p></button>
            </div> : <div></div>
          }
        </div>
      </div>
      <div className="components">
        <div className="component-one">
          <div className="filter-by-brand">
            <p id="brand-filter-title">Brand</p>
            <div className="brandBar">
              <input id="brandBar" name="search" type="text" placeholder="Search..." onChange={brandNameChange}></input>
            </div>
            <DisplayBrands brands={displayBrandNames} selectedConditions={tickedConditions} updateFilter={updateFilter}/>
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
          <div className="filter-by-condition">
            <p id="condition-filter-title">Condition</p>
            <DisplayConditions conditions={displayConditions} selectedBrands={tickedBrands} updateFilter={updateFilter} />
          </div>
        </div>
        <div className="component-two">
          <div className="component-two-header">
            <div className="sort-by-component">
              <p className="sort-by-text">Sort By</p>
              <select name="options" id="sort-by" onChange={sortBy}>
                <option value="Relevancy">Relevancy</option>
                <option value="Price: Low - High">Price: Low - High</option>
                <option value="Price: High - Low">Price: High - Low</option>
                <option value="Popularity">Popularity</option>
                <option value="Title: A - Z">Title: A - Z</option>
                <option value="Title: Z - A">Title: Z - A</option>
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