import { useContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import "../../css/global.css";
import "../../css/profile.css";
import "../../css/product-state.css";
import HeaderBar from "../../components/HeaderBar";
import StarRating from "../Product/StarRatings";

import AuthContext from "../../context/AuthContext";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";

const MySwal = withReactContent(Swal);

function Listing() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const uid = queryParams.get('uid');
  const {user} = useContext(AuthContext);
  const [phone, setPhone] = useState([]);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [brand, setBrand] = useState("");
  const [distinctBrands, setDistinctBrands] = useState([]);


  function getListing() {
    axios.get("/api/product", {
      params: {
        uid: uid
      }
    })
    .then((res) => {
      setPhone(res.data);
      setTitle(res.data.title);
      setPrice(res.data.price);
      setStock(res.data.stock);
      setBrand(res.data.brand);
    })
    .catch((err) => console.log(err));

  axios.get("/api/getBrands")
    .then((res) => {
      if (res.data.error) {
        MySwal.fire({
          title: res.data.error,
          icon: "error"
        });
      } else {
        setDistinctBrands(res.data.brands);
      }
    })
    .catch((err) => console.log(err));
  }
  useEffect(() => {
    getListing();
  }, [uid]);

  const changeTitle = (e) => {
    setTitle(e.target.value);
  }

  const changePrice = (e) => {
    setPrice(e.target.value);
  }

  const changeStock = (e) => {
    setStock(e.target.value);
  }

  const changeBrand = (e) => {
    setBrand(e.target.value);
  }

  function saveListing() {
    axios.post('/api/updateListing', {
        userId: user._id,
        uid: phone.uid,
        title: title,
        price: price,
        brand: brand,
        stock: stock
      })
      .then((res) => {
        if (res.data.error) {
          MySwal.fire({
            title: res.data.error,
            icon: "error"
          });
        } else {
          MySwal.fire({
            title: "Updated Listing",
            icon: "success"
          });
          getListing();
        }
      })
      .catch((err) => console.log(err));
  }

  return (
    <div className="content">
      <HeaderBar />
      {user ? (
        <div>
          {user.admin ? (
            <div key={phone.uid} id="listing">
                <button className="shared-btn" onClick={() => {navigate(-1)}}>&laquo; Go Back</button>
                <div id="product-listing">
                  <div id="product-phone-img">
                    <img src={`${phone.image}`} alt={phone.image}/>
                  </div>
                  <div id="product-listing-desc">
                    <label>Title:</label><br></br>
                    <input type="text" value={title} onChange={changeTitle}></input><br></br><br></br>
                    <label>UID:</label><br></br>
                    <p>{phone.uid}</p><br></br>
                    <label>Brand:</label><br></br>
                    <select name="options" id="brand-options" onChange={changeBrand} value={brand}>
                    {distinctBrands.map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                    </select><br></br><br></br>
                    <label>Price:</label><br></br>
                    <input type="number" value={price} onChange={changePrice}></input><br></br><br></br>
                    <label>Stock:</label><br></br>
                    <input type="number" value={stock} onChange={changeStock}></input><br></br><br></br>
                    <label>Average Ratings</label><br></br>
                    {typeof phone.avgRatings === "number" && <StarRating rating={phone.avgRatings} numReviews={Array.from(phone.reviews.entries()).length}/>}<br></br>
                    <button className="shared-btn" onClick={() => {saveListing()}}>Save Listing</button>
                  </div>
                </div>
            </div>
          ): (
            <div>You do not have admin access</div>
          )}
        </div>
      ): (
        <div>Must be logged in and have admin access</div>
      )}
    </div>
  )
}

export default Listing;