import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../css/global.css";
import "../../css/profile.css";
import HeaderBar from "../../components/HeaderBar";
import StarRating from "./StarRating";

import AuthContext from "../../context/AuthContext";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";

const MySwal = withReactContent(Swal);

function ProductReviews() {
  const {user} = useContext(AuthContext);
  const [results, setResults] = useState([]);

  useEffect(() => {
    axios.get('/api/productReviews',{
            params: {
              userId: user._id
            }})
          .then((res) => {
            if (res.data.error) {
              MySwal.fire({
                title: res.data.error,
                icon: "error"
              });
            } else {
              setResults(res.data.results);
            }
          })
          .catch((err) => console.log(err));
  }, []);
  
  return (
    <div className="content">
      <HeaderBar />
      <div id="account-information">
        <div id="left-tab">
          <Link to="/profile"><button className="profile-options">ACCOUNT INFORMATION</button></Link><br></br><br></br>
          <button className="profile-options">MY ORDERS</button><br></br><br></br>
          <button className="profile-options">MY PRODUCT REVIEWS &#10148;</button><br></br><br></br>
          <Link to="/changePassword"><button className="profile-options">CHANGE PASSWORD</button></Link><br></br><br></br>
          {user.admin !== undefined ? (
            <div><button className="profile-options">MANAGE LISTINGS</button><br></br><br></br></div>
          ): <div></div>
          }
          <button className="profile-options">SIGN OUT</button>
        </div>
        <div id="account-table">
          <p id="p-heading">MY PRODUCT REVIEWS</p><br></br>
          {results && results.length > 0 ? (
            <table>
              <tr>
                <th>Phone</th>
                <th>Rating</th>
                <th>Action</th>
              </tr>
              {
                results.map((phone) => {
                  return (
                    <tr key={phone.uid}>
                      <td className="title-col">{phone.title}</td>
                      <td>
                        {phone.reviews
                          .filter((review) => review.reviewer === user._id)
                          .map((filteredReview) => filteredReview.rating)}
                      </td>
                      <td>View More</td>
                    </tr>  
                  )
                })
              }
            </table>
          ): (<div>
            No product reviews
          </div>)}
        </div>
      </div>
    </div>
  );
}

export default ProductReviews;