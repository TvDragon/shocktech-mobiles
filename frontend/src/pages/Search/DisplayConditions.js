import { useState, useEffect } from "react";
import "../../css/search-state.css";

function DisplayConditions ({ conditions, selectedBrands, updateFilter }) {
  const [selectedConditions, setSelectedConditions] = useState([]);

  useEffect(() => {
    updateFilter(selectedBrands, selectedConditions);
  }, [selectedConditions]);

  const handleCheckboxChange = (e, condition) => {
    if (e.target.checked) {
      setSelectedConditions([...selectedConditions, condition]);
    } else {
      setSelectedConditions(selectedConditions.filter(item => item !== condition));
    }
  };

  return (
    <div className="conditions">
      {conditions && conditions.length > 0 ? (
        conditions.map((condition) => {
          return (
            <div key={condition[0]} className="condition-option">
              <input className="condition-input" type="checkbox" id={condition[0]} onChange={(e) => handleCheckboxChange(e, condition[0])}></input>
              <p className="condition-name">{condition[0]}</p>
            </div>
          );
        })
      ): (
        <div></div>
      )}
    </div>
  )
}

export default DisplayConditions;