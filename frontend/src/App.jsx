import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

// Auth
import Signup from "./pages/Signup";
import VerifyOtp from "./pages/VerifyOtp";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

// Vendor
import VendorLogin from "./pages/Vendor/VendorLogin";
import VendorSignup from "./pages/Vendor/VendorSignup";
import VendorDashboard from "./pages/Vendor/VendorDashboard";
import Medicines from "./pages/Vendor/Medicines/Medicines";
import Orders from "./pages/Vendor/Orders/Orders";
import Notifications from "./pages/Vendor/Notifications/Notifications";
import Inventory from "./pages/Vendor/Inventory/Inventory";
import Reports from "./pages/Vendor/Reports/Reports";
import Settings from "./pages/Vendor/Settings/Settings";

// Customer
import CustomerDashboard from "./pages/Customer/Dashboard/Dashboard";
import FindMedicines from "./pages/Customer/FindMedicines/FindMedicines";
import NearbyPharmacies from "./pages/Customer/NearbyPharmacies/NearbyPharmacies";
import PharmacyMedicines from "./pages/Customer/PharmacyMedicines/PharmacyMedicines";
import MedicineDetails from "./pages/Customer/MedicineDetails/MedicineDetails";
import MyOrders from "./pages/Customer/MyOrders/MyOrders";
import CustomerNotifications from "./pages/Customer/Notifications/Notifications";
import CustomerProfile from "./pages/Customer/Profile/Profile";
import CustomerSettings from "./pages/Customer/Settings/Settings";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import VendorInfo from "./pages/Admin/VendorInfo";
import AdminNotifications from "./pages/Admin/AdminNotifications";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* Authentication */}

        <Route path="/" element={<Signup />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/weblogin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/vendor-info" element={<VendorInfo />} />
        <Route path="/admin/notifications" element={<AdminNotifications />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Vendor Auth */}
        <Route path="/vendor" element={<VendorLogin />} />
        <Route path="/vendor/signup" element={<VendorSignup />} />

        {/* Vendor Dashboard & Pages */}

        <Route path="/vendor/dashboard" element={<VendorDashboard />} />
        <Route path="/vendor/medicines" element={<Medicines />} />
        <Route path="/vendor/orders" element={<Orders />} />
        <Route path="/vendor/notifications" element={<Notifications />} />
        <Route path="/vendor/inventory" element={<Inventory />} />
        <Route path="/vendor/reports" element={<Reports />} />
        <Route path="/vendor/settings" element={<Settings />} />

        {/* Customer */}

        <Route
          path="/customer/dashboard"
          element={<CustomerDashboard />}
        />

        <Route
          path="/customer/medicines"
          element={<FindMedicines />}
        />

        <Route
          path="/customer/pharmacies"
          element={<NearbyPharmacies />}
        />

        <Route
          path="/customer/pharmacy/:vendorId"
          element={<PharmacyMedicines />}
        />

        <Route
          path="/customer/medicine/:id"
          element={<MedicineDetails />}
        />

        <Route
          path="/customer/orders"
          element={<MyOrders />}
        />

        <Route
          path="/customer/notifications"
          element={<CustomerNotifications />}
        />

        <Route
          path="/customer/profile"
          element={<CustomerProfile />}
        />

        <Route
          path="/customer/settings"
          element={<CustomerSettings />}
        />

      </Routes>

    </BrowserRouter>

  );

}

export default App;
