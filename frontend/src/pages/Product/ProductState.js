import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "../../css/global.css";

function ProductState() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const uid = queryParams.get('uid');
  const [phone, setPhone] = useState([]);
  
  useEffect(() => {
    axios
      .get("/api/product", {
        params: {
          uid: uid
        }
      })
      .then((res) => {
        setPhone(res.data);
      })
      .catch((err) => console.log(err));
  }, [uid]);

  return (
    <div key={phone.uid}>
      {phone.title}
    </div>
  )
}

export default ProductState;