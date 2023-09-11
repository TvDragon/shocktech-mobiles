import { FaStar } from "react-icons/fa";

function Ratings({rating, hover, setHover, setRating}) {

  const handleMouseLeave = () => {
    setHover(0);
  };
  /*
    Copied from StackOverflow:
    URL - https://stackoverflow.com/questions/67851499/make-only-one-post-request-with-new-state-after-clicking-on-one-of-multiple-iden
   */
  return (
    <div>
      {[...Array(5)].map((_, i) => {  // Create array of size 5 for 5 ratings
        const value = i + 1;
        return (
          <label key={i}>
            <input
              type="radio"
              name="rating"
              value={value}
              onClick={() => setRating(value)}
              style={{ display: 'none' }}
            />
            <FaStar
              size={30}
              color={value <= (hover || rating) ? '#ffc107' : '#e4e5e9'}
              onMouseEnter={() => setHover(value)}
              onMouseLeave={() => handleMouseLeave()}
            />
          </label>
        );
      })}
    </div>
  )
}

export default Ratings;