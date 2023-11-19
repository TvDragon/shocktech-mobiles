import { useContext } from "react";
import axios from "axios";
import "../../css/global.css";
import "../../css/profile.css";
import StarRating from "./StarRating";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import AuthContext from "../../context/AuthContext";
const MySwal = withReactContent(Swal);

function FullReview({phoneId, title, rating, comment, setViewReview}) {
  const {user} = useContext(AuthContext);
  
  function deleteReview() {
    axios.post('/api/deleteReview', {phoneId: phoneId, userId: user._id})
      .then((res) => {
        if (res.data.error) {
          MySwal.fire({
            title: res.data.error,
            icon: "error"
          });
        } else {
          MySwal.fire({
            title: "Deleted Review",
            icon: "success"
          });
          setViewReview(false);
        }
      })
      .catch((err) => console.log(err));
  }

  return (
    <div>
      <p className="fs-24 publicSans">Product Name:</p>
      <p className="fs-22 publicSans">{title}</p><br></br>
      <p className="fs-24 publicSans">Rating:</p>
      <StarRating rating={rating}/><br></br>
      <p className="fs-24 publicSans">Comment:</p>
      <p className="fs-22 publicSans">{comment}</p><br></br>
      <button className="shared-btn" onClick={deleteReview}>Delete</button>
    </div>
  )
}

export default FullReview;