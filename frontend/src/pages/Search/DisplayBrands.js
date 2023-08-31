import { useState, useEffect } from "react";
import "../../css/search-state.css";

function DisplayBrands({ brands, searchTitle, updateSelectedBrands }) {
  const [selectedBrands, setSelectedBrands] = useState([]);

  useEffect(() => {
    updateSelectedBrands(selectedBrands);
  }, [selectedBrands]);

  const handleCheckboxChange = (e, brand) => {
    if (e.target.checked) {
      setSelectedBrands([...selectedBrands, brand]);
    } else {
      setSelectedBrands(selectedBrands.filter(item => item !== brand));
    }
  };

  return (
    <div className="brands">
      {brands && brands.length > 0 ? (
        brands.map((brand) => {
          return (
            <div key={brand[0]} className="brand-option">
              <input className="brand-input" type="checkbox" value={brand[0]} id={brand[0]} onChange={(e) => handleCheckboxChange(e, brand[0])}></input>
              <p className="brand-name">{brand[0]}</p>
            </div>
          );
        })
      ): (
        <div></div>
      )}
    </div>
  )
}

export default DisplayBrands;