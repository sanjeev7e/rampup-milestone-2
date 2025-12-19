import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import AdminLayout from "../components/layout/AdminLayout";

const router = createBrowserRouter([
  {
    path: "/admin",
    element: (
      <AdminLayout>
        <Outlet />
      </AdminLayout>
    ),
    children: [
      {
        index: true,
        element: <div className='p-4'>Dashboard</div>,
      },
      {
        path: "orders",
        element: <div className='p-4'>Orders</div>,
      },
      {
        path: "products",
        element: <div className='p-4'>Products</div>,
      },
      {
        path: "vendors",
        element: <div className='p-4'>Vendors</div>,
      },
      {
        path: "settings",
        element: <div className='p-4'>Settings</div>,
      },
    ],
  },
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}
