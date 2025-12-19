import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import AdminLayout from "../components/layout/AdminLayout";
import ListProductsScreen from "../pages/admin/products/ListProductsScreen";

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
        element: <Outlet />,
        children: [
          {
            index: true,
            element: <ListProductsScreen />,
          },
          {
            path: "add",
            element: <div className='p-4'>Add Product</div>,
          },
          {
            path: "edit/:id",
            element: <div className='p-4'>Edit Product</div>,
          },
          {
            path: "view/:id",
            element: <div className='p-4'>View Product</div>,
          },
        ],
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
