import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "../../css/global.css";
import "../../css/product-state.css";
import HeaderBar from "../../components/HeaderBar";
import StarRating from "./StarRatings";

function ProductState() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const uid = queryParams.get('uid');
  const [phone, setPhone] = useState([]);
  
  useEffect(() => {
    if (uid) {
      axios
        .get("/api/product", {
          params: {
            uid: uid
          }
        })
        .then((res) => {
          setPhone(res.data);
        })
        .catch((err) => console.log(err));
    } else {
      console.log("uid not available");
    }
  }, [uid]);

  return (
    <div className="content">
      <HeaderBar />
      <div key={phone.uid} id="product">
        <div id="product-info">
          <div id="product-phone-img">
            <img src={`${phone.image}`} alt={phone.image}/>
          </div>
          <div id="product-desc">
            <p id="title" className="text-color">{phone.title}</p>
            <p id="item-number">Item Number: {phone.uid}</p>
            {typeof phone.avgRatings === "number" && <StarRating rating={phone.avgRatings} numReviews={phone.numReviews}/>}
            <p id="price">${phone.price}</p>
          </div>
        </div>
        <div id="reviews">
        </div>
      </div>
    </div>
  )
}

export default ProductState;