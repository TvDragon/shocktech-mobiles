import { useState } from "react";
import axios from "axios";
import "../../css/global.css";
import "../../css/product-state.css";
import StarRating from "./StarRatings";

function DisplayReviews({uid, reviews, isAdmin}) {
  const [displayViewsCount, setDisplayViewsCount] = useState(3);

  function showMore() {
    setDisplayViewsCount(displayViewsCount + 3);
  }

  function hideReview(comment) {
    axios
      .post("/api/hideReview", {uid: uid, comment: comment})
      .then((res) => {
      })
      .catch((err) => console.log(err));
  }

  function showReview(comment) {
    axios
      .post("/api/showReview", {uid: uid, comment: comment})
      .then((res) => {
      })
      .catch((err) => console.log(err));
  }

  return (
    <div className="reviews">
      {reviews && reviews.length > 0 ? (
        Array.from(reviews.entries()).slice(0, displayViewsCount).map(([index, review]) => (
          <div key={index}>
            {review.reviewerObj[0] ? (
              <div>
                {isAdmin ? (
                  <div className="review">
                  <div className="left">
                  <p className="reviewer">{review.reviewerObj[0].firstname} {review.reviewerObj[0].lastname}</p>
                  <StarRating rating={review.rating}/>
                  <p className="comment">{review.comment}</p>
                  </div>
                  {review.hidden !== "" ? (
                    <button className="shared-btn" onClick={() => hideReview(review.comment)}>Hide Review</button>
                    ): (<button className="shared-btn" onClick={() => showReview(review.comment)}>Show Review</button>)}
                    </div>
                    ): (<div>
                      {review.hidden !== "" ? (
                <div className="review">
                  <div className="left">
                  <p className="reviewer">{review.reviewerObj[0].firstname} {review.reviewerObj[0].lastname}</p>
                  <StarRating rating={review.rating}/>
                  <p className="comment">{review.comment}</p>
                  </div>
                  </div> 
                  ): (<div></div>)}
                </div>)}
              </div>
            ): (<div>No Reviews</div>)}
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