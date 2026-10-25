import "./OrderFilter.css";

function OrderFilter() {

    return (

        <div className="order-filter">

            <button className="active">

                All

            </button>

            <button>

                Pending

            </button>

            <button>

                Confirmed

            </button>

            <button>

                Ready

            </button>

            <button>

                Completed

            </button>

            <button>

                Cancelled

            </button>

        </div>

    );

}

export default OrderFilter;