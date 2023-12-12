import { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import "../../css/global.css";
import "../../css/profile.css";
import HeaderBar from "../../components/HeaderBar";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";

const MySwal = withReactContent(Swal);

function VerifyResetPassword() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const verificationCode = queryParams.get('code');

  const navigator = useNavigate();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  function resetPassword() {
    if (email === "" || newPassword === "" || confirmNewPassword === "") {
      MySwal.fire({
        title: "Fields cannot be empty",
        icon: "error"
      });
    } else if (newPassword !== confirmNewPassword) {
      MySwal.fire({
        title: "Passwords not match",
        icon: "error"
      });
    } else {
      axios.post("/api/confirmResetPassword", {verificationCode: verificationCode, newPassword: newPassword})
        .then((res) => {
          if (res.data.success) {
            MySwal.fire({
              title: "Successfully Reset Password",
              icon: "success"
            });
            navigator('/');
          } else {
            MySwal.fire({
              title: "Failed Reset Password",
              icon: "error",
              text: "Please Try Again."
            });
          }
        })
        .catch((err) => console.log(err));
    }
  }

  const changeEmail = (e) => {
    setEmail(e.target.value);
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
      <div id="reset-pass-form">
        <p id="reset-pass-title">RESET YOUR PASSWORD</p>
        <p id="reset-pass-info">Enter your email and the new password you wish to set</p>
        <div id="forms">
          <div id="account-form">
            <label>Email</label><span className="asterik">*</span><br></br>
            <input type="email" onChange={changeEmail}></input><br></br><br></br>
            <label>New password</label><span className="asterik">*</span><br></br>
            <input type="password" onChange={changeNewPassword}></input><br></br><br></br>
            <label>Confirm new password</label><span className="asterik">*</span><br></br>
            <input type="password" onChange={changeConfirmNewPassword}></input><br></br><br></br>
            <div className="center-container">
              <button className="shared-btn" onClick={() => {resetPassword()}}>Sent password reset email</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerifyResetPassword;