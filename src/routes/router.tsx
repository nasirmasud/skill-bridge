import { createBrowserRouter } from "react-router-dom"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { PublicLayout } from "@/components/layout/PublicLayout"
import ManageCategories from "@/pages/dashboard/admin/ManageCategories"
import ManageOrders from "@/pages/dashboard/admin/ManageOrders"
import ManageUsers from "@/pages/dashboard/admin/ManageUsers"
import ClientProfile from "@/pages/dashboard/client/ClientProfile"
import MyOrders from "@/pages/dashboard/client/MyOrders"
import CreateService from "@/pages/dashboard/freelancer/CreateService"
import EditService from "@/pages/dashboard/freelancer/EditService"
import MyServices from "@/pages/dashboard/freelancer/MyServices"
import ReceivedOrders from "@/pages/dashboard/freelancer/ReceivedOrders"
import Home from "@/pages/home/Home"
import NotFound from "@/pages/NotFound"
import Login from "@/pages/auth/Login"
import Register from "@/pages/auth/Register"
import { OAuthCallback } from "@/pages/auth/OAuthCallback"
import ServiceDetails from "@/pages/services/ServiceDetails"
import ServiceList from "@/pages/services/ServiceList"
import { ProtectedRoute } from "./ProtectedRoute"

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <OAuthCallback><Home /></OAuthCallback> },
      { path: "/services", element: <ServiceList /> },
      { path: "/services/:id", element: <ServiceDetails /> },
      { path: "*", element: <NotFound /> },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },

  {
    element: <ProtectedRoute allowedRoles={["CLIENT"]} />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: "/dashboard/client/orders", element: <MyOrders /> },
          { path: "/dashboard/client/profile", element: <ClientProfile /> },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={["FREELANCER"]} />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: "/dashboard/freelancer/services", element: <MyServices /> },
          {
            path: "/dashboard/freelancer/services/new",
            element: <CreateService />,
          },
          {
            path: "/dashboard/freelancer/services/:id/edit",
            element: <EditService />,
          },
          { path: "/dashboard/freelancer/orders", element: <ReceivedOrders /> },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={["ADMIN"]} />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: "/dashboard/admin/users", element: <ManageUsers /> },
          {
            path: "/dashboard/admin/categories",
            element: <ManageCategories />,
          },
          { path: "/dashboard/admin/orders", element: <ManageOrders /> },
        ],
      },
    ],
  },

  { path: "*", element: <NotFound /> },
])
