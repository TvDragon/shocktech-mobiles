import { useContext, useEffect, useState } from "react";
import Popup from "reactjs-popup";
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
  const [displayDeletePopUp, setDisplayDeletePopUp] = useState(false);

  function getListings() {
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
  }
  useEffect(() => {
    getListings();
  }, []);

  function deleteListing(uid) {
    axios.post('/api/deleteListing', {userId: user._id, uid: uid})
      .then((res) => {
        if (res.data.error) {
          MySwal.fire({
            title: res.data.error,
            icon: "error"
          });
        } else {
          MySwal.fire({
            title: `Delete Listing #${uid}`,
            icon: "success"
          });
          getListings();
        }
      })
      .catch((err) => console.log(err));
  }

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
                        <Popup trigger=
                          {<td><img className="cell-icons" src={BinIcon}></img></td>} modal nested>
                          {
                            close => (
                              <form method='post' action=''>
                                <div className="review-form">
                                  <button className="close" onClick={close}>&times;</button>
                                  <p className="title-review center-text">Are you sure you wish to delete listing #{phone.uid}?</p>
                                  <p className="center-text">Click yes to confirm otherwise no to cancel.</p>
                                  <div className="center-buttons">
                                    <button className="shared-btn" onClick={() => {deleteListing(phone.uid);close();}}>Yes</button>
                                    <button className="shared-btn" onClick={() => {close();}}>No</button>
                                  </div>
                                </div>
                              </form>
                            )
                          }
                        </Popup>
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