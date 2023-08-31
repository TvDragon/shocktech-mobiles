import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "../../css/global.css";
import "../../css/product-state.css";
import HeaderBar from "../../components/HeaderBar";

function ProductState() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const uid = queryParams.get('uid');
  const [phone, setPhone] = useState([]);
  
  useEffect(() => {
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
          </div>
        </div>
        <div id="reviews">
        </div>
      </div>
    </div>
  )
}

export default ProductState;