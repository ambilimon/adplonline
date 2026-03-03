import { MemberProvider } from '@/integrations';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { ScrollToTop } from '@/lib/scroll-to-top';
import ErrorPage from '@/integrations/errorHandlers/ErrorPage';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';

// Layout component that includes ScrollToTop
function Layout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
        routeMetadata: {
          pageIdentifier: 'home',
        },
      },
      {
        path: "product/:slug",
        element: <ProductDetailPage />,
        routeMetadata: {
          pageIdentifier: 'product-detail',
        },
      },
      {
        path: "products",
        element: <HomePage />,
        routeMetadata: {
          pageIdentifier: 'products',
        },
      },
      {
        path: "products/:category",
        element: <HomePage />,
        routeMetadata: {
          pageIdentifier: 'products-category',
        },
      },
      {
        path: "category/:type/:slug",
        element: <HomePage />,
        routeMetadata: {
          pageIdentifier: 'category',
        },
      },
      {
        path: "about-us",
        element: <HomePage />,
        routeMetadata: {
          pageIdentifier: 'about',
        },
      },
      {
        path: "contact-us",
        element: <HomePage />,
        routeMetadata: {
          pageIdentifier: 'contact',
        },
      },
      {
        path: "blog",
        element: <HomePage />,
        routeMetadata: {
          pageIdentifier: 'blog',
        },
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
], {
  basename: import.meta.env.BASE_NAME,
});

export default function AppRouter() {
  return (
    <MemberProvider>
      <RouterProvider router={router} />
    </MemberProvider>
  );
}
