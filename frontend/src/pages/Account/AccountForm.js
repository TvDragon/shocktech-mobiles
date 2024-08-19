import { useEffect, useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import axios from "axios";
import "../../css/global.css";
import "../../css/account-form.css";
import HeaderBar from "../../components/HeaderBar";

import AuthContext from "../../context/AuthContext";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

function AccountForm() {
  const navigate = useNavigate();
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const {updateUser} = useContext(AuthContext);

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
      axios
        .post("/api/login", {email, password})
        .then((res) => {
          if (res.data.error) {
            MySwal.fire({
              title: res.data.error,
              icon: "error"
            });
          } else {
            localStorage.setItem("auth-token", res.data.token);
            axios.post('/api/getUserFromToken', {token: localStorage.getItem("auth-token")})
              .then((res) => {
                updateUser(res.data.token.user);
                navigate("/");
              })
              .catch((err) => {
                console.log("ERROR INSIDE Login.js - LoginFunc()");
              });
              
            MySwal.fire({
              title: res.data.success,
              icon: "success"
            });
          }
        })
        .catch((err) => {console.log(err)});
    }
  }

  function signUp() {
    if (fname === "" || lname === "" || email === "" || password === "" || confirmPassword === "") {
      MySwal.fire({
        title: "Fields Cannot Be Empty",
        icon: "error",
      });
    } else if (password !== confirmPassword) {
      MySwal.fire({
        title: "Password in fields do not match",
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

  const changeConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
  }

  useEffect(() => {
    let token = localStorage.getItem("auth-token");
    axios.post('/api/validateToken', {token}, null).then((res) => {
      // console.log(res);
      // user = res.user;
    }).catch((err) => {
      // console.log(err);
    });
  }, [])
  
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
                  <Link to="/forgotPassword"><button className="text-btn ps-fs-20"><u>Forgot your password?</u></button></Link>
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
              <label>Confirm Password</label><span className="asterik">*</span><br></br>
              <input type="password" onChange={changeConfirmPassword}></input><br></br><br></br>
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