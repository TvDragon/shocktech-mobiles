import { useContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import "../../css/global.css";
import "../../css/profile.css";
import HeaderBar from "../../components/HeaderBar";
import EditIcon from "../../assets/edit.png";
import BinIcon from "../../assets/bin.png";

import AuthContext from "../../context/AuthContext";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";

const MySwal = withReactContent(Swal);

function Listings() {
  const navigate = useNavigate();
  const {user} = useContext(AuthContext);
  const [allPhones, setAllPhones] = useState([]);

  useEffect(() => {
    if (user) {
      axios.get('/api/phones', {
        params: {
          userId: user._id}
        })
        .then((res) => {
          if (res.data.phones) {
            setAllPhones(res.data.phones);
          } else {
            MySwal.fire({
              title: res.data.phones,
              icon: "error"
            });
          }
        })
        .catch((err) => console.log(err));
    }
  }, []);


  

  return (
    <div className="content">
      <HeaderBar />
      {user ? (
        <div>
          {user.admin ? (
            <div id="">
              <div id="listing-bar">
                <p id="p-heading"><button className="review-back-btn" onClick={() => {navigate(-1)}}>&laquo;</button> LISTINGS</p>
                <button className="add-listing-btn">Add Listing</button>
              </div>
              <table id="table-listings">
                <thead>
                  <tr className="listings-row">
                    <th>Product Name</th>
                    <th>SKU</th>
                    <th>Price</th>
                    <th>Stock Availability</th>
                    <th>Brand</th>
                    <th>Edit</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    allPhones.map((phone) => {
                      return <tr className="listings-row">
                        <td>{phone.title}</td>
                        <td>{phone.uid}</td>
                        <td>${phone.price}</td>
                        <td>{phone.stock}</td>
                        <td>{phone.brand}</td>
                        <td><Link to={"/listing?uid=" + phone.uid}><img className="cell-icons" src={EditIcon}></img></Link></td>
                        <td><Link><img className="cell-icons" src={BinIcon}></img></Link></td>
                      </tr>
                    })
                  }
                </tbody>
              </table>
            </div>
          ): (
            <div>You do not have admin access</div>
          )}
        </div>
      ): (
        <div>Must be logged in and have admin access</div>
      )}
    </div>
  ) 
}

export default Listings;