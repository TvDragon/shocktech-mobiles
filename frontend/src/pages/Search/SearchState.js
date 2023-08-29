import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import HeaderBar from "../../components/HeaderBar";
import "../../css/global.css";
import "../../css/search-state.css";
import SearchResults from "./SearchResults";

function SearchState() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchTitle = queryParams.get('searchTitle');
	const [results, setResults] = useState([]);
	const [brandName, setBrandName] = useState("");
	const [brandNames, setBrandNames] = useState([]);
	const [minPrice, setMinPrice] = useState(0);
	const [maxPrice, setMaxPrice] = useState(2000);

	useEffect(() => {
		axios
			.get("/api/search", {
				params: {
					searchTitle: searchTitle
				}
			})
			.then((res) => {
				setResults(res.data.phones);
				setBrandNames(res.data.brands);
			})
			.catch((err) => console.log(err));
	}, [searchTitle]);

	function setPriceLimit() {

	}

	function filterBrand() {

	}
	
	const brandNameChange = (e) => {
		setBrandName(e.target.value);
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
							<button id="searchBtn" type="submit" onClick={filterBrand}><i className="fa fa-search"></i></button>
						</div>
						<SearchResults results={brandNames}/>
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
						<p>phones</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default SearchState;