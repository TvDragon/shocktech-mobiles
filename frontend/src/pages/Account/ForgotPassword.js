import { useState } from "react";
import axios from "axios";
import "../../css/global.css";
import "../../css/account-form.css";
import HeaderBar from "../../components/HeaderBar";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

function ForgotPassword() {
  const [email, setEmail] = useState("");

  function resetEmailLink() {
    axios.post('/api/resetPassword', {email: email})
      .then((res) => {
        if (res.data.error) {
          MySwal.fire({
            title: res.data.error,
            icon: "error"
          });
        } else {
          MySwal.fire({
            title: res.data.msg,
            icon: "success"
          });
        }
      })
      .catch((err) => console.log(err));
  }
  
  const changeEmail = (e) => {
    setEmail(e.target.value);
  }

  return (
    <div className="content">
      <HeaderBar />
      <div id="reset-pass-form">
        <p id="reset-pass-title">RESET YOUR PASSWORD</p>
        <p id="reset-pass-info">Enter your user account's verified email address and we will send you a password reset link.</p>
        <div id="forms">
          <div id="reset-pass-block">
            <label>Email</label><span className="asterik">*</span><br></br>
            <input type="email" onChange={changeEmail}></input><br></br><br></br>
            <div className="center-container">
              <button className="shared-btn" onClick={() => {resetEmailLink()}}>Sent password reset email</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword;