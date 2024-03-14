import { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import Popup from "reactjs-popup";
import axios from "axios";
import "../../css/global.css";
import "../../css/product-state.css";
import HeaderBar from "../../components/HeaderBar";
import StarRating from "./StarRatings";
import DisplayReviews from "./DisplayReviews";
import Ratings from "./Ratings";

import AuthContext from "../../context/AuthContext";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

function ProductState() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const uid = queryParams.get('uid');
  const [phone, setPhone] = useState([]);
  const [quantity, setQuantity] = useState(0);
  const [comment, setComment] = useState("");
  const { user } = useContext(AuthContext);
  const [isAdmin, setIsAdmin] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  
  useEffect(() => {
    setQuantity(1);
    if (user) {
      if (user.admin !== undefined) {
        setIsAdmin(user.admin);
      }
    }
    if (location.state) {
      const {phoneData} = location.state;
      setPhone(phoneData);
    } else if (uid) {
      const interval = setInterval(() => {
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
      }, 1000);
      return () => clearInterval(interval);
    } else {
      console.log("uid not available");
    }
  }, [uid]);

  function minusQty() {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  }
  
  function addQty() {
    if (quantity < phone.stock) {
      setQuantity(quantity + 1);
    }
  }

  const changeQuantity = (e) => {
    if (Number(e.target.value) <= phone.stock) {
      setQuantity(Number(e.target.value));
    }
  }

  function submitReview() {
    if (user) {
      if (comment !== "") {
        const userId = user._id;
        axios
          .post("/api/comment", {phone: phone, review: comment, rating: rating, userId: userId})
          .then((res) => {
            if (res.data.success) {
              MySwal.fire({
                title: "Review Accepted",
                icon: "success"
              });
              setComment("");
              setRating(0);
            } else {
              MySwal.fire({
                title: "Error submitting review",
                icon: "error"
              });
            }
          })
          .catch((err) => console.log(err));
      } else {
        MySwal.fire({
          title: "You must type something in the review",
          icon: "info"
        });
      }
    } else {
      MySwal.fire({
        title: "You need to login to leave a review",
        icon: "info"
      });
    }
  }

  function addToCart() {
    if (user) {
      if (quantity <= phone.stock) {
        if (quantity > 0) {
          axios
            .post("/api/addToCart", {userId: user._id, uid: uid, quantity: quantity})
            .then((res) => {
              if (res.data.success) {
                MySwal.fire({
                  title: "Added To Cart",
                  icon: "success"
                });
              } else if (res.data.error) {
                MySwal.fire({
                  title: res.data.error,
                  icon: "error"
                });
              } else {
                MySwal.fire({
                  title: "Cannot add item to cart",
                icon: "error"
              });
            }
          })
          .catch((err) => console.log(err));
        } else {
          MySwal.fire({
            title: "Cannot have negative or zero quantity",
            icon: "info"
          });
        }
      } else {
        MySwal.fire({
          title: "Cannot purchase more than available stock",
          icon: "info"
        });
      }
    } else {
      MySwal.fire({
        title: "Login to add to cart",
        icon: "info"
      });
    }
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
            {typeof phone.avgRatings === "number" && <StarRating rating={phone.avgRatings} numReviews={Array.from(phone.reviews.entries()).length}/>}
            <p id="price">${phone.price}</p>
            <div className="quantity-add-to-cart">
              <button className="minus-quantity text-color" onClick={minusQty}>−</button>
              <input className="qty-input text-color" value={quantity} onChange={changeQuantity}></input>
              <button className="add-quantity text-color" onClick={addQty}>+</button>
              <button className="add-to-cart-btn text-color" onClick={addToCart}>Add To Cart</button>
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
            <Popup trigger=
              {<button className="shared-btn">Write a review</button>} modal nested>
              {
                close => (
                  <form method='post' action=''>
                    <div className="review-form">
                      <button className="close" onClick={close}>&times;</button>
                      <p className="title-review">My Review for {phone.title}</p>
                      <label htmlFor="comment">Comment</label><br></br>
                      <textarea type="text" id="comment" name="comment" rows="5"
                        value={comment} onChange={(event) => setComment(event.target.value)}></textarea><br></br>
                      <label htmlFor="rating">Rating</label><br></br>
                      <Ratings rating={rating} hover={hover} setHover={setHover} setRating={setRating} />
                      <div className="center-container">
                        <button className="shared-btn" onClick={() => {submitReview(); close();}}>Submit Review</button>
                      </div>
                    </div>
                  </form>
                )
              }
            </Popup>
          </div>
          <hr className="reviews"></hr>
          <DisplayReviews uid={uid} reviews={phone.reviews} isAdmin={isAdmin}/>
        </div>
      </div>
    </div>
  )
}

export default ProductState;