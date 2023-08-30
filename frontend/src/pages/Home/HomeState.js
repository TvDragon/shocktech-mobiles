import { useState, useEffect } from "react";
import axios from 'axios';
import "../../css/global.css";
import "../../css/home-state.css";
import DisplayPhones from "./DisplayPhones";
import HeaderBar from "../../components/HeaderBar";

function HomeState() {
  const [soldOutSoon, setSoldOutSoon] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);

  useEffect(() => {
    // const interval = setInterval(() => {
      axios
        .get('/api/sold-out-soon')
        .then((res) => {
          setSoldOutSoon(res.data);
          console.log(res.data);
        })
        .catch((err) => console.log(err));
      axios.get('/api/best-sellers')
        .then((res) => {
          setBestSellers(res.data);
          console.log(res.data);
        })
        .catch((err) => console.log(err));
    // }, 1000);	// Make a request to the server every second
    // return () => clearInterval(interval);
  }, []);

  return (
    <div className="content fill-page">
      <HeaderBar />
      <div className="home-page">
        <div className="contents">
          <h1 className="headings">SOLD OUT SOON</h1>
          <DisplayPhones phones={soldOutSoon}/>
          <h1 className="headings">BEST SELLERS</h1>
          <DisplayPhones phones={bestSellers}/>
        </div>
      </div>
    </div>
  );
}

export default HomeState;