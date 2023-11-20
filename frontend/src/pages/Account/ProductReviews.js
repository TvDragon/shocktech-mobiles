import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../css/global.css";
import "../../css/profile.css";
import HeaderBar from "../../components/HeaderBar";

import AuthContext from "../../context/AuthContext";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";
import FullReview from "./FullReview";

const MySwal = withReactContent(Swal);

function ProductReviews() {
  const {user} = useContext(AuthContext);
  const [results, setResults] = useState([]);
  const [phoneId, setPhoneId] = useState(0);
  const [title, setTitle] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [viewReview, setViewReview] = useState(false);

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
  }, [viewReview]);
  
  function setReview(phoneID, phoneTitle, userRating, userComment) {
    setPhoneId(phoneID);
    setTitle(phoneTitle);
    setRating(userRating);
    setComment(userComment);
    setViewReview(true)
  }

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
        {viewReview ? (
          <div id="account-info-tab">
            <p id="p-heading"><button className="review-back-btn" onClick={() => {setViewReview(false)}}>&laquo;</button> REVIEW</p><hr></hr><br></br>
            <FullReview phoneId={phoneId} title={title} rating={rating} comment={comment} setViewReview={setViewReview}/>
          </div>
        ): (
          <div id="account-table">
            <p id="p-heading">MY PRODUCT REVIEWS</p><br></br>
            {results && results.length > 0 ? (
              <table id="product-reviews">
                <tr>
                  <th className="product-reviews">Phone</th>
                  <th className="product-reviews">Rating</th>
                  <th className="product-reviews">Action</th>
                </tr>
                {
                  results.map((phone) => {
                    return (
                      <tr key={phone.uid}>
                        <td className="title-col product-reviews">{phone.title}</td>
                        <td className="product-reviews">
                          {phone.reviews
                            .filter((review) => review.reviewer === user._id)
                            .map((filteredReview) => filteredReview.rating).join(', ')}
                        </td>
                        <td className="product-reviews"><button className="view-more" onClick={() => {setReview(phone._id, phone.title,
                            phone.reviews.filter((review) => review.reviewer === user._id)
                              .map((filteredReview) => filteredReview.rating).join(', '),
                            phone.reviews.filter((review) => review.reviewer === user._id)
                              .map((filteredReview) => filteredReview.comment).join(', ')
                            )}}>View More</button></td>
                      </tr>  
                    )
                  })
                }
              </table>
            ): (<div>
                No product reviews
            </div>)}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductReviews;