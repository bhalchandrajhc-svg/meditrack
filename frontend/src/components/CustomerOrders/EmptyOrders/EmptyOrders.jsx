import { PackageSearch } from "lucide-react";

import "./EmptyOrders.css";

function EmptyOrders(){

    return(

        <div className="empty-orders">

            <PackageSearch

                size={90}

                strokeWidth={1.5}

            />

            <h2>

                No Orders Yet

            </h2>

            <p>

                You haven't reserved any medicine yet.

            </p>

            <button>

                Find Medicines

            </button>

        </div>

    );

}

export default EmptyOrders;