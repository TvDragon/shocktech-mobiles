import "../../css/product-state.css";
import "../../css/global.css";

const StarRating = ({rating, totalStars=5}) => {
  const filledStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = totalStars - filledStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="star-rating">
      {Array(filledStars).fill(null).map((_, index) => (
        <i key={index} className="fas fa-star"></i>
      ))}
      {hasHalfStar && <i className="fas fa-star-half-alt"></i>}
      {Array(emptyStars).fill(null).map((_, index) => (
        <i key={index} className="far fa-star"></i>
      ))}
    </div>
  );
};

export default StarRating;