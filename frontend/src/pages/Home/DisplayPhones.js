import { useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom"
import '../../css/global.css';
import '../../css/home-state.css';
import ShoppingCartIcon from "../../assets/shopping-cart.png";

import AuthContext from "../../context/AuthContext";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

function DisplayPhones({ phones }) {
  const { user } = useContext(AuthContext);

  function addToCart(phoneUID) {
    if (user) {
      axios
        .post("/api/addToCart", {userId: user._id, uid: phoneUID, quantity: 1})
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
        title: "Login to add to cart",
        icon: "info"
      });
    }
  }

  return (
    <div className='categories'>
      {phones && phones.length > 0 ? (
        phones.map((phone) => {
          return (
            <div key={phone.uid}>
                <div className='phone-listing'>
                  <Link to={"/product?uid=" + phone.uid} state={{phoneData: phone}} className='phone-link-style'>
                    <img className='phone-img' src={`${phone.image}`} alt={phone.image}/>
                    <p className='title'>{phone.title.length > 30 ? phone.title.slice(0, 30) : phone.title}...</p>
                  </Link>
                  <div className="price-cart">
                    <Link to={"/product?uid=" + phone.uid} state={{phoneData: phone}} className='phone-link-style'>
                      <p className='price'>${phone.price}</p>
                    </Link>
                    <img className='quick-cart-img' src={ShoppingCartIcon} alt={ShoppingCartIcon} onClick={(event) => addToCart(phone.uid)}/>
                  </div>
                </div>
            </div>
          );
        })
      ): (
        <div>No phones left</div>
      )}
    </div>
  )
}

export default DisplayPhones;