import { Link } from "react-router-dom"
import '../../css/global.css';
import '../../css/home-state.css';
import ShoppingCartIcon from "../../assets/shopping-cart.png";

function DisplayPhones({ phones }) {

	function addToCart(event, phoneUID) {
		// event.stopPropagation();
  	console.log(phoneUID);
	}

	return (
		<div className='categories'>
			{phones && phones.length > 0 ? (
				phones.map((phone) => {
					return (
						<div key={phone.uid}>
								<div className='phone-listing'>
              		<Link to={"/item/" + phone.uid} className='phone-link-style'>
										<img className='phone-img' src={`${phone.image}`} alt={phone.image}/>
										<p className='title'>{phone.title.length > 30 ? phone.title.slice(0, 30) : phone.title}...</p>
									</Link>
									<div className="price-cart">
              			<Link to={"/item/" + phone.uid} className='phone-link-style'>
											<p className='price'>${phone.price}</p>
										</Link>
										{/* <button className="quick-cart-btn" onClick={(event) => addToCart(event, phone.uid)}></button> */}
										<img className='quick-cart-img' src={ShoppingCartIcon} alt={ShoppingCartIcon} onClick={(event) => addToCart(event, phone.uid)}/>
									</div>
								</div>
						</div>
					);
				})
			): (
				<div>No phones left</div>
			)}
		</div>
	)
}

export default DisplayPhones;