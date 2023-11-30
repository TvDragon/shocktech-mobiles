import { useContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import "../../css/global.css";
import "../../css/profile.css";
import "../../css/product-state.css";
import HeaderBar from "../../components/HeaderBar";

import AuthContext from "../../context/AuthContext";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";

const MySwal = withReactContent(Swal);

function AddListing() {
  const navigate = useNavigate();
  const {user} = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [brand, setBrand] = useState("");
  const [distinctBrands, setDistinctBrands] = useState([]);

  useEffect(() => {
    axios.get("/api/getBrands")
    .then((res) => {
      if (res.data.error) {
        MySwal.fire({
          title: res.data.error,
          icon: "error"
        });
      } else {
        setDistinctBrands(res.data.brands);
        setBrand((res.data.brands)[0]);
      }
    })
    .catch((err) => console.log(err));
  }, []);

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

  function addListing() {
    axios.post('/api/addListing', {userId: user._id, title: title, brand: brand, stock: stock, price: price})
      .then((res) => {
        if (res.data.error) {
          MySwal.fire({
            title: res.data.error,
            icon: "error"
          });
        } else {
          MySwal.fire({
            title: "Added Listing",
            icon: "success"
          });
          navigate(-1);
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
            <div id="listing">
                <button className="shared-btn" onClick={() => {navigate(-1)}}>&laquo; Go Back</button>
                <div id="product-listing">
                  <div id="product-phone-img">
                    <img src={`/phone_default_images/${brand}.png`} alt={brand}/>
                  </div>
                  <div id="product-listing-desc">
                    <label>Title:</label><br></br>
                    <input type="text" value={title} onChange={changeTitle}></input><br></br><br></br>
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
                    <button className="shared-btn" onClick={() => {addListing()}}>Add Listing</button>
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

export default AddListing;