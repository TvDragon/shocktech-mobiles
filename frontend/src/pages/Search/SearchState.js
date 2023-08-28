import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import HeaderBar from "../../components/HeaderBar";
import "../../css/global.css";
import "../../css/search-state.css";

function SearchState() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchTitle = queryParams.get('searchTitle');
	const [results, setResults] = useState([]);

	useEffect(() => {
		axios
			.get("/api/search", {
				params: {
					searchTitle: searchTitle
				}
			})
			.then((res) => {
				setResults(res.data);
			})
			.catch((err) => console.log(err));
	}, [searchTitle]);
	
	return (
		<div className="content">
			<HeaderBar />
			<div className="components">
				<div className="component-one">
					<div className="filter-by-brand">
						
					</div>
					<div className="filter-by-price">

					</div>
				</div>
				<div className="component-two">
					<div className="sort-by">

					</div>
					<div className="phones">

					</div>
				</div>
			</div>
		</div>
	);
}

export default SearchState;