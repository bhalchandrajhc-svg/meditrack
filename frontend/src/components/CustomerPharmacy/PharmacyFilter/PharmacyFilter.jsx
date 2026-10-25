import "./PharmacyFilter.css";

function PharmacyFilter({

    city,

    setCity

}) {

    return (

        <div className="pharmacy-filter">

            <button
                onClick={()=>setCity("")}
            >
                All
            </button>

            <button
                onClick={()=>setCity("Mumbai")}
            >
                Mumbai
            </button>

            <button
                onClick={()=>setCity("Pune")}
            >
                Pune
            </button>

            <button
                onClick={()=>setCity("Nashik")}
            >
                Nashik
            </button>

            <button
                onClick={()=>setCity("Thane")}
            >
                Thane
            </button>

        </div>

    );

}

export default PharmacyFilter;