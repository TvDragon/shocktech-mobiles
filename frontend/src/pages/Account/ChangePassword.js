import { useContext, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import "../../css/global.css";
import "../../css/profile.css";
import HeaderBar from "../../components/HeaderBar";

import AuthContext from "../../context/AuthContext";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";

const MySwal = withReactContent(Swal);

function ChangePassword() {
  const navigate = useNavigate();
  const [currPassword, setCurrPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const {user, updateUser} = useContext(AuthContext);

  function changePassword() {
    if (newPassword !== confirmNewPassword) {
      MySwal.fire({
        title: "New password not matching",
        icon: "error"
      });
    } else {
      console.log(user.email);
      axios.post('/api/changePassword', {email: user.email,
                                          currPassword: currPassword,
                                          newPassword: newPassword})
          .then((res) => {
            if (res.data.error) {
              MySwal.fire({
                title: res.data.error,
                icon: "error"
              });
            } else {
              updateUser(res.data.user);
              MySwal.fire({
                title: "Updated Password",
                icon: "success"
              });
            }
          })
          .catch((err) => (console.log(err)));
    }
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

  const changeCurrPassword = (e) => {
    setCurrPassword(e.target.value);
  }

  const changeNewPassword = (e) => {
    setNewPassword(e.target.value);
  }

  const changeConfirmNewPassword = (e) => {
    setConfirmNewPassword(e.target.value);
  }

  return (
    <div className="content">
      <HeaderBar />
      {user ? (
        <div id="account-information">
          <div id="left-tab">
            <Link to="/profile"><button className="profile-options">ACCOUNT INFORMATION</button></Link><br></br><br></br>
            <Link to="/orders"><button className="profile-options">MY ORDERS</button></Link><br></br><br></br>
            <Link to="/productReviews"><button className="profile-options">MY PRODUCT REVIEWS</button></Link><br></br><br></br>
            <button className="profile-options">CHANGE PASSWORD &#10148;</button><br></br><br></br>
            {user.admin ? (
              <Link to="/listings"><button className="profile-options">MANAGE LISTINGS</button><br></br><br></br></Link>
            ): <div></div>
            }
            <button className="profile-options" onClick={() => {signout()}}>SIGN OUT</button>
          </div>
          <div id="account-info-tab">
            <p id="p-heading">CHANGE PASSWORD</p>
            <hr></hr><br></br>
            <div id="personal-info">
              <label>Current password</label><span className="asterik">*</span><br></br>
              <input type="password" onChange={changeCurrPassword}></input><br></br><br></br>
              <label>New password</label><span className="asterik">*</span><br></br>
              <input type="password" onChange={changeNewPassword}></input><br></br><br></br>
              <label>Confirm new password</label><span className="asterik">*</span><br></br>
              <input type="password" onChange={changeConfirmNewPassword}></input><br></br><br></br>
              <button className="shared-btn" onClick={() => {changePassword()}}>Save Profile</button>
            </div>
          </div>
        </div>
      ): (
        <div>Must be logged in</div>
      )}
    </div>
  ); 
}

export default ChangePassword;