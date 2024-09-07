import { useContext, useEffect, useState } from "react";
import "../../css/global.css";
import "../../css/cart.css";
import "../../css/product-state.css";
import HeaderBar from "../../components/HeaderBar";
import binIcon from "../../assets/bin.png";
import shoppingCartIcon from "../../assets/shopping-cart.png";

import AuthContext from "../../context/AuthContext";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";
import { Link } from "react-router-dom"

const MySwal = withReactContent(Swal);

function Cart() {
  const {user} = useContext(AuthContext);
  const [cart, setCart] = useState([]);
  const [phones, setPhones] = useState([]);
  const [save, setSave] = useState([]);
  const [savedPhones, setSavedPhones] = useState([]);
  const [total, setTotal] = useState(0);
  const [updatedCart, setUpdatedCart] = useState(false);
  const [updatedSave, setUpdatedSave] = useState(false);

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
          let retrievedPhones = [];
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

  function updateSave() {
    if (user) {
      axios.get('/api/saveForLater', {
        params: {
          userId: user._id
        }
      })
      .then(async (res) => {
        setSave(res.data.save.items);
        const saves = res.data.save.items;
        let retrievedPhones = [];
        for (let i = 0; i < saves.length; i++) {
          const phoneUid = saves[i].phoneUid;
          await axios.get('/api/product', {
            params: {
              uid: phoneUid
            }
          })
          .then((res) => {
            retrievedPhones.push(res.data);
          })
          .catch((err) => console.log(err));
        }
        setSavedPhones(retrievedPhones);
      })
      .catch((err) => console.log(err));
    }
  }

  // useEffect being continously called even though that is not what I want
  useEffect(() => {
    updateCart();
  }, [updatedCart]);
  
  useEffect(() => {
    updateSave();
  }, [updatedSave]);

  function removeFromCart(phoneUid, showPopUp) {
    axios.post('/api/removeFromCart', {userId: user._id, phoneUid: phoneUid})
      .then((res) => {
        if (res.data.error) {
          MySwal.fire({
            title: res.data.error,
            icon: "error"
          });
        } else if (showPopUp) {
          MySwal.fire({
            title: res.data.success,
            icon: "success"
          });
          setUpdatedCart(!updatedCart);
        }
      })
      .catch((err) => console.log(err));
  }

  function removeFromSaveForLater(phoneUid, showPopUp) {
    axios.post('/api/removeFromSaveForLater', {userId: user._id, phoneUid: phoneUid})
      .then((res) => {
        if (res.data.error) {
          MySwal.fire({
            title: res.data.error,
            icon: "error"
          });
        } else if (showPopUp) {
          MySwal.fire({
            title: res.data.success,
            icon: "success"
          });
          setUpdatedSave(!updatedSave);
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
          setUpdatedCart(!updatedCart);
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
              setUpdatedCart(!updatedCart);
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
              setUpdatedCart(!updatedCart);
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
              setUpdatedCart(!updatedCart);
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

  function saveForLater(index) {
    const cartItem = cart[index];
    if (user) {
      axios
        .post("/api/addToSaveForLater", {userId: user._id, uid: cartItem.phoneUid, quantity: cartItem.quantity})
        .then((res) => {
          if (res.data.success) {
            removeFromCart(cartItem.phoneUid, false);
            MySwal.fire({
              title: "Saved For Later",
              icon: "success"
            });
            setUpdatedCart(!updatedCart);
            setUpdatedSave(!updatedSave);
          } else if (res.data.error) {
            MySwal.fire({
              title: res.data.error,
              icon: "error"
            });
          } else {
            MySwal.fire({
              title: "Cannot save item for later",
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

  function moveToCart(index) {
    const cartItem = save[index];
    if (user) {
      axios
        .post("/api/addToCart", {userId: user._id, uid: cartItem.phoneUid, quantity: cartItem.quantity})
        .then((res) => {
          if (res.data.success) {
            removeFromSaveForLater(cartItem.phoneUid, false);
            MySwal.fire({
              title: "Added To Cart",
              icon: "success"
            });
            setUpdatedCart(!updatedCart);
            setUpdatedSave(!updatedSave);
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
      <div className="cart-contents">
        <p className="p-heading">SHOPPING CART</p>
        {cart && cart.length > 0 && phones.length > 0 ? (
          <table className="cart">
            <thead>
              <tr>
                <th className="cart-img cart"></th>
                <th className="cart-title cart"></th>
                <th className="cart ps-fs-20">Price</th>
                <th className="cart ps-fs-20">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                const rows = [];
                for (let i = 0; i < cart.length; i++) {
                  const item = cart[i];
                  const phone = phones[i];
                  if (phone !== undefined) {
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
                            <button className="text-btn ps-fs-24" onClick={() => saveForLater(i)}><u>Save For Later</u></button>
                            <div className="vertical-line-cart"></div>
                            <img className="bin-cart-image" src={binIcon} alt={binIcon} onClick={() => {removeFromCart(item.phoneUid, true)}}></img>
                          </div>
                        </td>
                        <td className="cart ps-fs-20">${phone.price}</td>
                        <td className="cart ps-fs-20">${(phone.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    );
                  }
                }
                return rows;
              })()}
              <tr>
                <td></td>
                <td></td>
                <td className="center-text ps-fs-20">Total:</td>
                <td className="center-text ps-fs-20">${total}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td className="center-text"><button className="checkout-btn" onClick={() => checkOut()}>Checkout</button></td>
              </tr>
            </tfoot>
          </table>
        ): (
          <p>No items in cart</p>
        )}
      </div>
      <div className="cart-contents">
        <p className="p-heading">SAVE FOR LATER</p>
        {savedPhones && savedPhones.length > 0 ? (
          <div className="saved-phones">
            {(() => {
              const displayedSavedPhones = [];
              for (let i = 0; i < savedPhones.length; i++) {
                const phone = savedPhones[i];
                displayedSavedPhones.push(
                  <div key={phone.uid}>
                    <div className='saved-phone-listing'>
                      <Link to={"/product?uid=" + phone.uid} state={{phoneData: phone}} className='phone-link-style'>
                      <img className='phone-img' src={`${phone.image}`} alt={phone.image}/>
                      <p className='saved-title'>{phone.title.length > 30 ? phone.title.slice(0, 30) : phone.title}...</p><br></br>
                      <Link to={"/product?uid=" + phone.uid} state={{phoneData: phone}} className='phone-link-style'>
                          <p className='saved-price'>${phone.price}</p>
                        </Link>
                      </Link>
                      <div className="saved-price-cart">
                        <img className="bin-cart-image-small" src={binIcon} alt={binIcon} onClick={() => {removeFromSaveForLater(phone.uid, true)}}></img>
                        <img className='quick-cart-img' src={shoppingCartIcon} alt={shoppingCartIcon} onClick={() => {moveToCart(i)}}/>
                      </div>
                    </div>
                  </div>
                  );
                }
              return displayedSavedPhones;
            })()}
          </div>
        ): (
          <p>No items in saved for later</p>
        )}
      </div>
    </div>
  )
}

export default Cart;