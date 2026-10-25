import "./StockHistory.css";

function StockHistory({ history }) {

    return (

        <div className="stock-history">

            <div className="history-header">

                <h3>Stock History</h3>

            </div>

            <table>

                <thead>

                    <tr>

                        <th>Medicine</th>
                        <th>Action</th>
                        <th>Quantity</th>
                        <th>Reason</th>
                        <th>Date</th>

                    </tr>

                </thead>

                <tbody>

                    {history.length === 0 ? (

                        <tr>

                            <td
                                colSpan="5"
                                className="empty-history"
                            >

                                No History Available

                            </td>

                        </tr>

                    ) : (

                        history.map((item) => (

                            <tr key={item.id}>

                                <td>{item.name}</td>

                                <td>

                                    {item.type === "add"
                                        ? "Added"
                                        : "Reduced"}

                                </td>

                                <td>{item.quantity}</td>

                                <td>{item.reason}</td>

                                <td>{item.date}</td>

                            </tr>

                        ))

                    )}

                </tbody>

            </table>

        </div>

    );

}

export default StockHistory;