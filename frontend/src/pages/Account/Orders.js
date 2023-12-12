import { useContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import "../../css/global.css";
import "../../css/profile.css";
import HeaderBar from "../../components/HeaderBar";

import AuthContext from "../../context/AuthContext";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";
import FullOrder from "./FullOrder";

const MySwal = withReactContent(Swal);

function Orders() {
  const navigate = useNavigate();
  const {user, updateUser} = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [viewOrder, setViewOrder] = useState(false);
  const [order, setOrder] = useState([]);

  useEffect(() => {
    axios.get('/api/orders', {
        params: {
          userId: user._id
        }
      })
      .then((res) => {
        if (res.data.error) {
          MySwal.fire({
            title: res.data.error,
            icon: "error"
          });
        } else {
          setOrders(res.data.orders);
        }
      })
      .catch((err) => console.log(err));
  }, [viewOrder]);

  function displayOrder(userOrder) {
    setOrder(userOrder);
    setViewOrder(true);
  }

  function signout() {
    MySwal.fire({
      title: 'Are you sure you want to logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Logout'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("auth-token");

        updateUser(null);
        navigate('/');

        MySwal.fire({
          title: 'Logout Successful',
          icon: 'success'}
        )
      }
    })
  }

  return (
    <div className="content">
      <HeaderBar />
      <div id="account-information">
        <div id="left-tab">
          <Link to="/profile"><button className="profile-options">ACCOUNT INFORMATION</button></Link><br></br><br></br>
          <button className="profile-options">MY ORDERS &#10148;</button><br></br><br></br>
          <Link to="/productReviews"><button className="profile-options">MY PRODUCT REVIEWS</button></Link><br></br><br></br>
          <Link to="/changePassword"><button className="profile-options">CHANGE PASSWORD</button></Link><br></br><br></br>
          {user.admin ? (
            <Link to="/listings"><button className="profile-options">MANAGE LISTINGS</button><br></br><br></br></Link>
          ): <div></div>
          }
          <button className="profile-options" onClick={() => {signout()}}>SIGN OUT</button>
        </div>
        {viewOrder ? (
          <div id="account-info-tab">
            <p id="p-heading"><button className="review-back-btn" onClick={() => {setViewOrder(false)}}>&laquo;</button> Order #{order.orderId}</p><hr></hr><br></br>
            <FullOrder order={order}/>
          </div>
        ): (
          <div id="account-table">
            <p id="p-heading">My Orders</p><br></br>
            {orders && orders.length > 0 ? (
              <table id="profile-table">
                <thead>
                  <tr>
                    <th className="profile-cell">Order #ID</th>
                    <th className="profile-cell">Total</th>
                    <th className="profile-cell">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    orders.map((userOrder) => {
                      return (
                        <tr key={userOrder.orderId}>
                          <td className="profile-cell">{userOrder.orderId}</td>
                          <td className="profile-cell">${userOrder.totalCost}</td>
                          <td className="profile-cell"><button className="view-more" onClick={() => displayOrder(userOrder)}>View More</button></td>
                        </tr>
                      )
                    })
                  }
                </tbody>
              </table>
            ): (
              <div>
                No Orders
              </div>
            )}
          </div>
        )}
      </div> 
    </div>
  )
}

export default Orders;