const orders = [
    {
        id: 1001,
        customer: "Rahul Patil",
        mobile: "9876543210",
        medicines: [
            {
                name: "Dolo 650",
                quantity: 2,
                price: 35,
            },
            {
                name: "Crocin",
                quantity: 1,
                price: 28,
            },
        ],
        total: 98,
        status: "Pending",
        payment: "Cash",
        date: "2026-07-04",
        pickupTime: "10:30 AM",
        address: "Ratnagiri, Maharashtra",
    },

    {
        id: 1002,
        customer: "Sneha Joshi",
        mobile: "9988776655",
        medicines: [
            {
                name: "Azithromycin",
                quantity: 1,
                price: 120,
            },
        ],
        total: 120,
        status: "Accepted",
        payment: "Online",
        date: "2026-07-04",
        pickupTime: "11:15 AM",
        address: "Chiplun, Maharashtra",
    },

    {
        id: 1003,
        customer: "Amit Sharma",
        mobile: "9012345678",
        medicines: [
            {
                name: "Paracetamol",
                quantity: 3,
                price: 30,
            },
        ],
        total: 90,
        status: "Ready for Pickup",
        payment: "Cash",
        date: "2026-07-03",
        pickupTime: "05:00 PM",
        address: "Mumbai, Maharashtra",
    },

    {
        id: 1004,
        customer: "Priya Deshmukh",
        mobile: "9090909090",
        medicines: [
            {
                name: "Vitamin C",
                quantity: 2,
                price: 75,
            },
        ],
        total: 150,
        status: "Completed",
        payment: "Online",
        date: "2026-07-02",
        pickupTime: "03:00 PM",
        address: "Pune, Maharashtra",
    },

    {
        id: 1005,
        customer: "Rohit Kulkarni",
        mobile: "9123456789",
        medicines: [
            {
                name: "Amoxicillin",
                quantity: 1,
                price: 180,
            },
        ],
        total: 180,
        status: "Rejected",
        payment: "Cash",
        date: "2026-07-01",
        pickupTime: "09:00 AM",
        address: "Kolhapur, Maharashtra",
    },
];

export default orders;