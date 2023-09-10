import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "../../css/global.css";
import "../../css/product-state.css";
import HeaderBar from "../../components/HeaderBar";
import StarRating from "./StarRatings";
import DisplayReviews from "./DisplayReviews";

function ProductState() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const uid = queryParams.get('uid');
  const [phone, setPhone] = useState([]);
  const [quantity, setQuantity] = useState(0);
  
  useEffect(() => {
    setQuantity(1);
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

  function minusQty() {
    if (quantity > 0) {
      setQuantity(quantity - 1);
    }
  }
  
  function addQty() {
    if (quantity < phone.stock) {
      setQuantity(quantity + 1);
    }
  }

  const changeQuantity = (e) => {
    if (e.target.value <= phone.stock) {
      setQuantity(e.target.value);
    }
  }

  function writeReview() {

  }

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
            <div className="quantity-add-to-cart">
              <button className="minus-quantity text-color" onClick={minusQty}>−</button>
              <input className="qty-input text-color" value={quantity} onChange={changeQuantity}></input>
              <button className="add-quantity text-color" onClick={addQty}>+</button>
              <button className="add-to-cart-btn text-color">Add To Cart</button>
            </div>
          </div>
        </div>
        <div id="product-info-small">
          <div id="product-desc" className="center-desc">
            <p id="title" className="text-color">{phone.title}</p>
            <p id="item-number">Item Number: {phone.uid}</p>
            {typeof phone.avgRatings === "number" && <StarRating rating={phone.avgRatings} numReviews={phone.numReviews}/>}
            <div id="product-phone-img">
              <img src={`${phone.image}`} alt={phone.image}/>
            </div>
            <p id="price">${phone.price}</p>
            <div className="center-container">
              <div className="quantity-add-to-cart">
                <button className="minus-quantity text-color" onClick={minusQty}>−</button>
                <input className="qty-input text-color" value={quantity} onChange={changeQuantity}></input>
                <button className="add-quantity text-color" onClick={addQty}>+</button>
                <button className="add-to-cart-btn text-color">Add To Cart</button>
              </div>
            </div>
          </div>
        </div>
        <div id="reviews-sec">
          <div className="default-flex">
            <p className="reviews-title text-color">Reviews</p>
            <button className="shared-btn" onClick={writeReview}>Write a review</button>
          </div>
          <hr className="reviews"></hr>
          <DisplayReviews reviews={phone.reviews}/>
        </div>
      </div>
    </div>
  )
}

export default ProductState;