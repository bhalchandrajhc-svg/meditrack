import "./RecentOrders.css";

const orders = [
  {
    id: "#ORD1001",
    customer: "Rahul Patil",
    medicine: "Paracetamol 650mg",
    qty: 2,
    amount: "₹120",
    status: "Pending",
  },
  {
    id: "#ORD1002",
    customer: "Sneha Joshi",
    medicine: "Azithromycin",
    qty: 1,
    amount: "₹250",
    status: "Accepted",
  },
  {
    id: "#ORD1003",
    customer: "Amit Sharma",
    medicine: "Vitamin C",
    qty: 3,
    amount: "₹540",
    status: "Ready",
  },
];

function RecentOrders() {
  return (
    <div className="recent-orders">

      <div className="table-header">
        <h3>Recent Orders</h3>
        <button>View All</button>
      </div>

      <table>

        <thead>

          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Medicine</th>
            <th>Qty</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>

        </thead>

        <tbody>

          {orders.map((order) => (

            <tr key={order.id}>

              <td>{order.id}</td>

              <td>{order.customer}</td>

              <td>{order.medicine}</td>

              <td>{order.qty}</td>

              <td>{order.amount}</td>

              <td>

                <span className={`status ${order.status.toLowerCase()}`}>
                  {order.status}
                </span>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default RecentOrders;