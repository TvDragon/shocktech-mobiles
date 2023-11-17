import "../../css/global.css";
import "../../css/profile.css";
import StarRating from "./StarRating";

function FullReview({title, rating, comment}) {
  
  function deleteComment() {

  }

  return (
    <div>
      <p className="fs-24 publicSans">Product Name:</p>
      <p className="fs-22 publicSans">{title}</p><br></br>
      <p className="fs-24 publicSans">Rating:</p>
      <StarRating rating={rating}/><br></br>
      <p className="fs-24 publicSans">Comment:</p>
      <p className="fs-22 publicSans">{comment}</p><br></br>
      <button className="shared-btn">Delete</button>
    </div>
  )
}

export default FullReview;