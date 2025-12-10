import { createBrowserRouter } from "react-router";
import MainLayout from "../layouts/MainLayout/MainLayout";
import Error from "../pages/Error/Error";
import Home from "../pages/Home/Home";
import AllScholarships from "../pages/Scholarships/AllScholarships/AllScholarships";
import ScholarshipDetails from "../pages/Scholarships/ScholarshipDetails/ScholarshipDetails";
import Login from "../pages/Auth/Login/Login";
import Register from "../pages/Auth/Register/Register";
import PrivateRoute from "./PrivateRoute";
import Checkout from "../pages/Payment/Checkout/Checkout";
import PaymentSuccess from "../pages/Payment/PaymentSuccess/PaymentSuccess";
import PaymentFailed from "../pages/Payment/PaymentFailed/PaymentFailed";
import DashboardLayout from "../layouts/DashboardLayout/DashboardLayout";
import MyProfile from "../pages/Dashboard/Student/MyProfile/MyProfile";
import RoleRoute from "./RoleRoute";
import MyApplications from "../pages/Dashboard/Student/MyApplications/MyApplications";
import MyReviews from "../pages/Dashboard/Student/MyReviews/MyReviews";
import ManageApplications from "../pages/Dashboard/Moderator/ManageApplications/ManageApplications";
import AllReviews from "../pages/Dashboard/Moderator/AllReviews/AllReviews";
import AddScholarship from "../pages/Dashboard/Admin/AddScholarship/AddScholarship";
import ManageScholarships from "../pages/Dashboard/Admin/ManageScholarships/ManageScholarships";
import ManageUsers from "../pages/Dashboard/Admin/ManageUsers/ManageUsers";
import Analytics from "../pages/Dashboard/Admin/Analytics/Analytics";

const Routes = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <Error />,
    children: [
      // public routes
      { index: true, element: <Home /> },
      { path: "scholarships", element: <AllScholarships /> },
      { path: "scholarships-details/:id", element: <ScholarshipDetails /> },

      // auth
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },

      // payment (must be logged in
      {
        path: "checkout/:id",
        element: (
          <PrivateRoute>
            <Checkout />
          </PrivateRoute>
        ),
      },

      {
        path: "payment/success",
        element: (
          <PrivateRoute>
            <PaymentSuccess />
          </PrivateRoute>
        ),
      },
      {
        path: "payment/failed",
        element: (
          <PrivateRoute>
            <PaymentFailed />
          </PrivateRoute>
        ),
      },
    ],
  },

  // dashboard layout (all private)
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      // ------- Student routes -------
      {
        index: true,
        element: (
          <RoleRoute allowedRoles={["Student", "Admin", "Moderator"]}>
            <MyProfile />
          </RoleRoute>
        ),
      },
      {
        path: "my-profile",
        element: (
          <RoleRoute allowedRoles={["Student", "Admin", "Moderator"]}>
            <MyProfile />
          </RoleRoute>
        ),
      },
      {
        path: "my-applications",
        element: (
          <RoleRoute allowedRoles={["Student"]}>
            <MyApplications />
          </RoleRoute>
        ),
      },
      {
        path: "my-reviews",
        element: (
          <RoleRoute allowedRoles={["Student"]}>
            <MyReviews />
          </RoleRoute>
        ),
      },

      // ------- Moderator routes -------
      {
        path: "manage-applications",
        element: (
          <RoleRoute allowedRoles={["Moderator", "Admin"]}>
            <ManageApplications />
          </RoleRoute>
        ),
      },
      {
        path: "all-reviews",
        element: (
          <RoleRoute allowedRoles={["Moderator", "Admin"]}>
            <AllReviews />
          </RoleRoute>
        ),
      },

      // ------- Admin routes -------
      {
        path: "add-scholarship",
        element: (
          <RoleRoute allowedRoles={["Admin"]}>
            <AddScholarship />
          </RoleRoute>
        ),
      },
      {
        path: "manage-scholarships",
        element: (
          <RoleRoute allowedRoles={["Admin"]}>
            <ManageScholarships />
          </RoleRoute>
        ),
      },
      {
        path: "manage-users",
        element: (
          <RoleRoute allowedRoles={["Admin"]}>
            <ManageUsers />
          </RoleRoute>
        ),
      },
      {
        path: "analytics",
        element: (
          <RoleRoute allowedRoles={["Admin"]}>
            <Analytics />
          </RoleRoute>
        ),
      },
    ],
  },
]);

export default Routes