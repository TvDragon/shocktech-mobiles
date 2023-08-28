import '../../css/global.css';
import '../../css/home-state.css';
import { Link } from "react-router-dom"

function DisplayPhones({ phones }) {
	return (
		<div className='categories'>
			{phones && phones.length > 0 ? (
				phones.map((phone) => {
					return (
						<div key={phone.uid}>
              <Link to={"/item/" + phone.uid} className='phone-link-style'>
								<div className='phone-listing'>
									<img className='phone-img' src={`${phone.image}`} alt={phone.image}/>
									<p className='title'>{phone.title.length > 30 ? phone.title.slice(0, 30) : phone.title}...</p>
									<p className='price'>${phone.price}</p>
								</div>
							</Link>
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