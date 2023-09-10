import { useState } from "react";
import "../../css/global.css";
import "../../css/product-state.css";
import StarRating from "./StarRatings";

function DisplayReviews({reviews}) {
  const [displayViewsCount, setDisplayViewsCount] = useState(5);
  
  function showMore() {
    setDisplayViewsCount(displayViewsCount + 5);
  }
  
  return (
    <div className="reviews">
      {reviews && reviews.length > 0 ? (
        Array.from(reviews.entries()).slice(0, displayViewsCount).map(([index, review]) => (
          <div key={index} className="review">
              <p className="reviewer">{review.reviewerObj[0].firstname} {review.reviewerObj[0].lastname}</p>
              <StarRating rating={review.rating}/>
              <p className="comment">{review.comment}</p>
          </div>
        ))
      ): <div>No Reviews</div>}
      {reviews && reviews.length > 0 && displayViewsCount < reviews.length ? (
        <div className="center-container">
          <button className="shared-btn" onClick={showMore}>Show More</button>
        </div>
      ): null}
    </div>
  )
}

export default DisplayReviews;