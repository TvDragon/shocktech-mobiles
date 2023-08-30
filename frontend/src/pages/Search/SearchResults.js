import "../../css/search-state.css";

function SearchResults({ results }) {
  return (
    <div className="brands">
      {results && results.length > 0 ? (
        results.map((brand) => {
          return (
            <div key={brand} className="brand-option">
              <input className="brand-input" type="checkbox" value={brand}></input>
              <p className="brand-name">{brand}</p>
            </div>
          );
        })
      ): (
        <div></div>
      )}
    </div>
  )
}

export default SearchResults;