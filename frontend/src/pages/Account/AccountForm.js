import { useState } from "react";
import axios from "axios";
import "../../css/global.css";
import "../../css/account-form.css";
import HeaderBar from "../../components/HeaderBar";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

function AccountForm() {
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function displayLoginForm() {
    setShowLoginForm(true);
  }

  function displayCreateAccountForm() {
    setShowLoginForm(false);
  }

  function signIn() {
    if (email === "" || password === "") {
      MySwal.fire({
        title: "Fields Cannot Be Empty",
        icon: "error",
      });
    } else {

    }
  }

  function signUp() {
    if (fname === "" || lname === "" || email === "" || password === "") {
      MySwal.fire({
        title: "Fields Cannot Be Empty",
        icon: "error",
      });
    } else {
      axios
        .post("/api/register", {fname, lname, email, password})
        .then((res) => {
          if (res.data.msg) {
            MySwal.fire({
              title: res.data.msg,
              icon: "error"
            });
          } else {
            MySwal.fire({
              title: "Created New Account",
              icon: "success"
            })
          }
        })
        .catch((err) => {console.log(err)});
    }
  }
  
  const changeFname = (e) => {
    setFname(e.target.value);
  }
  
  const changeLname = (e) => {
    setLname(e.target.value);
  }

  const changeEmail = (e) => {
    setEmail(e.target.value);
  }

  const changePassword = (e) => {
    setPassword(e.target.value);
  }
  
  return (
    <div className="content">
      <HeaderBar />
      <div id="account-form">
        <div className="header-account-form">
          <button onClick={displayLoginForm}>LOGIN</button>
          <div className="vert-line"></div>
          <button onClick={displayCreateAccountForm}>CREATE ACCOUNT</button>
          </div>
          <hr></hr>
          <div id="forms">
            {showLoginForm ? (
              <div id="account-form">
                <label>Email</label><span className="asterik">*</span><br></br>
                <input type="email" onChange={changeEmail}></input><br></br><br></br>
                <label>Password</label><span className="asterik">*</span><br></br>
                <input type="password" onChange={changePassword}></input><br></br><br></br>
                <div className="center-container">
                  <button className="shared-btn" onClick={() => {signIn()}}>Sign In</button>
                </div>
                <div className="center-container">
                  <button className="text-btn ps-fs-20"><u>Forgot your password?</u></button>
                </div>
            </div>
          ):
            <div id="account-form">
              <p className="pfd-fs-28">Personal Information</p><br></br>
              <label>First Name</label><span className="asterik">*</span><br></br>
              <input type="text" onChange={changeFname}></input><br></br><br></br>
              <label>Last Name</label><span className="asterik">*</span><br></br>
              <input type="text" onChange={changeLname}></input><br></br><br></br>
              <p className="pfd-fs-28">Sign-In Information</p><br></br>
              <label>Email</label><span className="asterik">*</span><br></br>
              <input type="email" onChange={changeEmail}></input><br></br><br></br>
              <label>Password</label><span className="asterik">*</span><br></br>
              <input type="password" onChange={changePassword}></input><br></br><br></br>
              <div className="center-container">
                <button className="shared-btn" onClick={() => {signUp()}}>Create Account</button>
              </div>
            </div>}
        </div>
      </div>
    </div>
  )
}

export default AccountForm;