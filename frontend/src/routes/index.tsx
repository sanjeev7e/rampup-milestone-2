import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom";
import AdminLayout from "../components/layout/AdminLayout";
import ListProductsScreen from "../pages/admin/products/ListProductsScreen";
import ViewProductScreen from "../pages/admin/products/ViewProductScreen";
import AddEditProductScreen from "../pages/admin/products/AddEditProductScreen";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to='/admin/products' replace />,
  },
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
        element: <Navigate to='products' replace />,
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
            element: <AddEditProductScreen />,
          },
          {
            path: "edit/:id",
            element: <AddEditProductScreen />,
          },
          {
            path: "view/:id",
            element: <ViewProductScreen />,
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
