import { useEffect, useState } from "react";
import axios from "axios";
import "../../css/global.css";
import "../../css/profile.css";

function FullOrder({order}) {
  const [phones, setPhones] = useState([]);
  const [items, setItems] = useState([]);

  async function updateOrder() {

    const items = order.items;
    const numItems = items.length;
    var retrievedPhones = [];
    for (let i = 0; i < numItems; i++) {
      const phoneUid = items[i].phoneUid;
      await axios.get('/api/product', {
        params: {
          uid: phoneUid
        }
      })
      .then((res) => {
        retrievedPhones.push(res.data);
      })
      .catch((err) => console.log(err));
    }
    setItems(order.items);
    setPhones(retrievedPhones);
  }

  useEffect(() => {
    updateOrder();
  }, [order]);

  return (
    <table id="profile-table">
      <thead>
        <tr id="order-header">
          <th className="profile-cell">Product Name</th>
          <th className="profile-cell">SKU</th>
          <th className="profile-cell">Price</th>
          <th className="profile-cell">QTY</th>
          <th className="profile-cell">Subtotal</th>
        </tr>
      </thead>
      <tbody>
        {(() => {
          const rows = [];
          const numItems = items.length;
          for (let i = 0; i < numItems; i++) {
            const item = items[i];
            const phone = phones[i];
            rows.push(
              <tr key={item.phoneUid}>
                <td className="profile-cell">{phone.title}</td>
                <td className="profile-cell">{phone.uid}</td>
                <td className="profile-cell">${phone.price}</td>
                <td className="profile-cell">{item.quantity}</td>
                <td className="profile-cell">${phone.price * item.quantity}</td>
              </tr>
            )
          }
          return rows;
        })()}
      </tbody>
      <tfoot className="order-footer">
        <tr>
          <td className="total"><b>Total:</b></td>
          <td></td>
          <td></td>
          <td></td>
          <td className="profile-cell">${order.totalCost}</td>
        </tr>
      </tfoot>
    </table>
  )
}

export default FullOrder;