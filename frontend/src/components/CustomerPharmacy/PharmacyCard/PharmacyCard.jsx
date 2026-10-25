import {

    Building2,

    Phone,

    MapPin,

    Navigation

} from "lucide-react";

import "./PharmacyCard.css";

function PharmacyCard() {

    return (

        <div className="pharmacy-card">

            <div className="pharmacy-image">

                <img

                    src="https://placehold.co/400x220"

                    alt=""

                />

            </div>

            <div className="pharmacy-body">

                <h3>Pharmacy Name</h3>

                <p>

                    <Building2 size={16}/>

                    Medical Store

                </p>

                <p>

                    <MapPin size={16}/>

                    Address

                </p>

                <p>

                    <Phone size={16}/>

                    Mobile Number

                </p>

                <div className="distance">

                    <Navigation size={16}/>

                    1.2 KM Away

                </div>

                <button className="view-btn">

                    View Pharmacy

                </button>

            </div>

        </div>

    );

}

export default PharmacyCard;