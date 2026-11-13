import { createBrowserRouter, Navigate } from "react-router-dom";
import ClientLayout from "@/client/layout/ClientLayout";
import Home from "@/client/pages/Home";
import ContactPage from "@/client/pages/ContactPage";
import AboutPage from "@/client/pages/AboutPage";
import ServicesPage from "@/client/pages/ServicesPage";
import ClientProjectsPage from "@/client/pages/ProjectsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <ClientLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "services",
        element: <ServicesPage />,
      },
      {
        path: "about",
        element: <AboutPage />,
      },
      {
        path: "projects",
        element: <ClientProjectsPage />,
      },
      {
        // The old portfolio URL.
        path: "work",
        element: <Navigate to="/projects" replace />,
      },
      {
        path: "contact",
        element: <ContactPage />,
      },
      {
        // The site is five pages; retired URLs (/blog, /pricing, …) go home.
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);
