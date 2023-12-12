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

const MySwal = withReactContent(Swal);

function Profile() {
  const navigate = useNavigate();
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [currEmail, setCurrEmail] = useState("");
  const [email, setEmail] = useState("");
  const { user, updateUser } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      setFname(user.firstname);
      setLname(user.lastname);
      setCurrEmail(user.email);
      setEmail(user.email);
    }
  }, [user]);

  function saveProfile() {
    if (fname === "" || lname === "" || email === "") {
      MySwal.fire({
        title: "Fields Cannot Be Empty",
        icon: "error",
      });
    } else {
      axios.post('/api/saveProfile', {fname: fname, lname: lname, currEmail: currEmail, newEmail: email})
        .then((res) => {
          if (res.data.msg) {
            MySwal.fire({
              title: res.data.msg,
              icon: "error"
            });
          } else {
            updateUser(res.data.user);
            setFname(res.data.user.fname);
            setLname(res.data.user.lname);
            setCurrEmail(res.data.user.email);
            setEmail(res.data.user.email);
            MySwal.fire({
              title: "Update Profile Successfully",
              icon: "success"
            });
          }
        })
        .catch((err) => {console.log(err)});
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

  const changeFname = (e) => {
    setFname(e.target.value);
  }
  
  const changeLname = (e) => {
    setLname(e.target.value);
  }

  const changeEmail = (e) => {
    setEmail(e.target.value);
  }

  return (
    <div className="content">
      <HeaderBar/>
      {user ? (
        <div id="account-information">
          <div id="left-tab">
            <button className="profile-options">ACCOUNT INFORMATION &#10148;</button><br></br><br></br>
            <Link to="/orders"><button className="profile-options">MY ORDERS</button></Link><br></br><br></br>
            <Link to="/productReviews"><button className="profile-options">MY PRODUCT REVIEWS</button></Link><br></br><br></br>
            <Link to="/changePassword"><button className="profile-options">CHANGE PASSWORD</button></Link><br></br><br></br>
            {user.admin ? (
              <Link to="/listings"><button className="profile-options">MANAGE LISTINGS</button><br></br><br></br></Link>
            ): <div></div>
            }
            <button className="profile-options" onClick={() => {signout()}}>SIGN OUT</button>
          </div>
          <div id="account-info-tab">
            <p id="p-heading">ACCOUNT INFORMATION</p>
            <hr></hr><br></br>
            <div id="personal-info">
              <label>First Name</label><br></br>
              <input type="text" value={fname} onChange={changeFname}></input><br></br><br></br>
              <label>Last Name</label><br></br>
              <input type="text" value={lname} onChange={changeLname}></input><br></br><br></br>
              <label>Email</label><br></br>
              <input type="email" value={email} onChange={changeEmail}></input><br></br><br></br>
              <button className="shared-btn" onClick={() => {saveProfile()}}>Save Profile</button>
            </div>
          </div>
        </div>
      ): (
        <div>Must be logged in</div>
      )}
    </div>
  );
}

export default Profile;