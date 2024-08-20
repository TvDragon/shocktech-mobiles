import { useContext, useEffect, useState } from "react";
import "../../css/global.css";
import "../../css/cart.css";
import "../../css/product-state.css";
import HeaderBar from "../../components/HeaderBar";
import binIcon from "../../assets/bin.png";

import AuthContext from "../../context/AuthContext";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";

const MySwal = withReactContent(Swal);

function Cart() {
  const {user} = useContext(AuthContext);
  const [cart, setCart] = useState([]);
  const [phones, setPhones] = useState([]);
  const [total, setTotal] = useState(0);

  function updateCart() {
    if (user) {
      axios.get('/api/cart', {
          params: {
            userId: user._id
          }
        })
        .then(async (res) => {
          setCart(res.data.cart.items);
          const shoppingCart = res.data.cart.items;
          var retrievedPhones = [];
          var currTotal = 0;
          for (let i = 0; i < shoppingCart.length; i++) {
            const phoneUid = shoppingCart[i].phoneUid;
            await axios.get('/api/product', {
              params: {
                uid: phoneUid
              }
            })
            .then((res) => {
              retrievedPhones.push(res.data);
              currTotal += (shoppingCart[i].quantity * res.data.price);
            })
            .catch((err) => console.log(err));
          }
          setPhones(retrievedPhones);
          setTotal(currTotal.toFixed(2));
        })
        .catch((err) => console.log(err));
    }
  }

  useEffect(() => {
    updateCart();
  }, [cart]);

  function removeFromCart(phoneUid) {
    axios.post('/api/removeFromCart', {userId: user._id, phoneUid: phoneUid})
      .then((res) => {
        if (res.data.error) {
          MySwal.fire({
            title: res.data.error,
            icon: "error"
          });
        } else {
          MySwal.fire({
            title: res.data.success,
            icon: "success"
          });
        }
      })
      .catch((err) => console.log(err));
  }

  function checkOut() {
    axios.post('/api/checkout', {userId: user._id, total: total})
      .then((res) => {
        if (res.data.error) {
          MySwal.fire({
            title: res.data.error,
            icon: "error"
          });
        } else {
          MySwal.fire({
            title: res.data.success,
            icon: "success"
          });
          updateCart();
        }
      })
      .catch((err) => console.log(err));
  }

  function minusQty(index) {
    if (user) {
      if (cart[index].quantity - 1 > 0) {
        axios
          .post("/api/addToCart", {userId: user._id, uid: cart[index].phoneUid, quantity: -1})
          .then((res) => {
            if (res.data.success) {
            } else if (res.data.error) {
              MySwal.fire({
                title: res.data.error,
                icon: "error"
              });
            } else {
              MySwal.fire({
                title: "Cannot reduce item from cart",
              icon: "error"
            });
          }
        })
        .catch((err) => console.log(err));
      } else {
        removeFromCart(cart[index].phoneUid);
      }
    }  else {
      MySwal.fire({
        title: "Login to add to cart",
        icon: "info"
      });
    }
  }

  function addQty(index) {
    if (user) {
      if (cart[index].quantity + 1 <= phones[index].stock) {
        axios
          .post("/api/addToCart", {userId: user._id, uid: cart[index].phoneUid, quantity: 1})
          .then((res) => {
            if (res.data.success) {
            } else if (res.data.error) {
              MySwal.fire({
                title: res.data.error,
                icon: "error"
              });
            } else {
              MySwal.fire({
                title: "Cannot add more quantity for item in cart",
              icon: "error"
            });
          }
        })
        .catch((err) => console.log(err));
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

  const changeQuantity = (e, index) => {
    if (user) {
      if (e.target.value <= phones[index].stock && e.target.value > 0) {
        axios
          .post("/api/addToCart", {userId: user._id, uid: cart[index].phoneUid, quantity: (e.target.value - cart[index].quantity)})
          .then((res) => {
            if (res.data.success) {
            } else if (res.data.error) {
              MySwal.fire({
                title: res.data.error,
                icon: "error"
              });
            } else {
              MySwal.fire({
                title: "Cannot adjust quantity for item in cart",
              icon: "error"
            });
          }
        })
        .catch((err) => console.log(err));
      } else if (e.target.value > phones[index].stock) {
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
      <div className="cart-page">
        <p className="p-heading">SHOPPING CART</p>
        {cart && cart.length > 0 && phones.length > 0 ? (
          <table id="cart">
            <thead>
              <tr>
                <th className="cart-img cart"></th>
                <th className="cart-title cart"></th>
                <th className="cart ps-fs-20">Price</th>
                <th className="cart ps-fs-20">Subtotal</th>
                <th className="cart"></th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                const rows = [];
                for (let i = 0; i < cart.length; i++) {
                  const item = cart[i];
                  const phone = phones[i];
                  rows.push(
                    <tr key={item.phoneUid}>
                      <td className="cart-img cart"><img className='phone-img' src={`${phone.image}`} alt={phone.image}/></td>
                      <td className="cart-title cart ps-fs-24">
                        {phone.title}
                        <div className="cart-quantity-adjuster">
                          <div className="quantity-add-to-cart">
                            <button className="minus-quantity text-color" onClick={() => minusQty(i)}>−</button>
                            <input className="qty-input text-color" value={item.quantity} onChange={(e) => changeQuantity(e, i)}></input>
                            <button className="add-quantity text-color add-quantity-cart" onClick={() => addQty(i)}>+</button>
                          </div>
                          <div className="vertical-line-cart"></div>
                        </div>
                      </td>
                      <td className="cart ps-fs-20">${phone.price}</td>
                      <td className="cart ps-fs-20">${phone.price * item.quantity}</td>
                      <td className="cart"><img className="icon-image" src={binIcon} alt={binIcon} onClick={() => {removeFromCart(item.phoneUid)}}></img></td>
                    </tr>
                  );
                }
                return rows;
              })()}<br></br>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td className="center-text ps-fs-20">Total:</td>
                <td className="center-text ps-fs-20">${total}</td>
                <td></td>
              </tr><br></br>
            </tbody>
            <tfoot>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td className="center-text"><button className="checkout-btn" onClick={() => checkOut()}>Checkout</button></td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        ): (
          <p>No items in cart</p>
        )}
      </div>
    </div>
  )
}

export default Cart;