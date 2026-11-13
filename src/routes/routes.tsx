import { createBrowserRouter, Navigate } from "react-router-dom";
import ClientLayout from "@/client/layout/ClientLayout";
import Home from "@/client/pages/Home";
import ContactPage from "@/client/pages/ContactPage";
import AboutPage from "@/client/pages/AboutPage";
import ServicesPage from "@/client/pages/ServicesPage";
import ClientProjectsPage from "@/client/pages/ProjectsPage";
import AdminRoot from "@/admin/layout/AdminRoot";
import RequireAuth from "@/admin/components/RequireAuth";
import RequireSuperAdmin from "@/admin/components/RequireSuperAdmin";
import RedirectIfAuthenticated from "@/admin/components/RedirectIfAuthenticated";
import AdminLayout from "@/admin/layout/AdminLayout";
import AuthLayout from "@/admin/layout/AuthLayout";
import LoginPage from "@/admin/pages/LoginPage";
import RegisterPage from "@/admin/pages/RegisterPage";
import VerifyEmailPage from "@/admin/pages/VerifyEmailPage";
import ForgotPasswordPage from "@/admin/pages/ForgotPasswordPage";
import SetPasswordPage from "@/admin/pages/SetPasswordPage";
import DashboardPage from "@/admin/pages/DashboardPage";
import ChangePasswordPage from "@/admin/pages/ChangePasswordPage";
import UsersPage from "@/admin/pages/UsersPage";
import PendingApprovalsPage from "@/admin/pages/PendingApprovalsPage";
import TagsPage from "@/admin/pages/TagsPage";
import ArticlesPage from "@/admin/pages/ArticlesPage";
import ArticleEditorPage from "@/admin/pages/ArticleEditorPage";
import ArticleOrderPage from "@/admin/pages/ArticleOrderPage";
import AdminServicesPage from "@/admin/pages/ServicesPage";
import ServiceEditorPage from "@/admin/pages/ServiceEditorPage";
import ServiceOrderPage from "@/admin/pages/ServiceOrderPage";
import PricingPage from "@/admin/pages/PricingPage";
import ProjectsPage from "@/admin/pages/ProjectsPage";
import ProjectEditorPage from "@/admin/pages/ProjectEditorPage";
import ProjectOrderPage from "@/admin/pages/ProjectOrderPage";
import AdminProductsPage from "@/admin/pages/ProductsPage";
import ProductEditorPage from "@/admin/pages/ProductEditorPage";
import ProductOrderPage from "@/admin/pages/ProductOrderPage";
import FaqsPage from "@/admin/pages/FaqsPage";
import CertificatesPage from "@/admin/pages/CertificatesPage";
import ReviewsPage from "@/admin/pages/ReviewsPage";
import ContactSubmissionsPage from "@/admin/pages/ContactSubmissionsPage";
import CurrenciesPage from "@/admin/pages/CurrenciesPage";
import TrashPage from "@/admin/pages/TrashPage";

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
  {
    // The CMS sits outside the marketing layout and has its own auth state.
    path: "/admin",
    element: <AdminRoot />,
    children: [
      {
        element: <RedirectIfAuthenticated />,
        children: [
          {
            element: <AuthLayout />,
            children: [
              {
                path: "login",
                element: <LoginPage />,
              },
              {
                path: "register",
                element: <RegisterPage />,
              },
              {
                path: "verify-email",
                element: <VerifyEmailPage />,
              },
              {
                path: "forgot-password",
                element: <ForgotPasswordPage />,
              },
              {
                path: "set-password",
                element: <SetPasswordPage />,
              },
            ],
          },
        ],
      },
      {
        element: <RequireAuth />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              {
                index: true,
                element: <DashboardPage />,
              },
              {
                element: <RequireSuperAdmin />,
                children: [
                  {
                    path: "users",
                    element: <UsersPage />,
                  },
                  {
                    path: "approvals",
                    element: <PendingApprovalsPage />,
                  },
                ],
              },
              {
                path: "projects",
                element: <ProjectsPage />,
              },
              {
                path: "projects/new",
                element: <ProjectEditorPage />,
              },
              {
                path: "projects/order",
                element: <ProjectOrderPage />,
              },
              {
                path: "projects/:id",
                element: <ProjectEditorPage />,
              },
              {
                path: "products",
                element: <AdminProductsPage />,
              },
              {
                path: "products/new",
                element: <ProductEditorPage />,
              },
              {
                path: "products/order",
                element: <ProductOrderPage />,
              },
              {
                path: "products/:id",
                element: <ProductEditorPage />,
              },
              {
                path: "articles",
                element: <ArticlesPage />,
              },
              {
                path: "articles/new",
                element: <ArticleEditorPage />,
              },
              {
                path: "articles/order",
                element: <ArticleOrderPage />,
              },
              {
                path: "articles/:id",
                element: <ArticleEditorPage />,
              },
              {
                path: "tags",
                element: <TagsPage />,
              },
              {
                path: "services",
                element: <AdminServicesPage />,
              },
              {
                path: "services/new",
                element: <ServiceEditorPage />,
              },
              {
                path: "services/order",
                element: <ServiceOrderPage />,
              },
              {
                path: "services/:id",
                element: <ServiceEditorPage />,
              },
              {
                path: "pricing",
                element: <PricingPage />,
              },
              {
                path: "faqs",
                element: <FaqsPage />,
              },
              {
                path: "certificates",
                element: <CertificatesPage />,
              },
              {
                path: "reviews",
                element: <ReviewsPage />,
              },
              {
                path: "contact-submissions",
                element: <ContactSubmissionsPage />,
              },
              {
                path: "currencies",
                element: <CurrenciesPage />,
              },
              {
                path: "trash",
                element: <TrashPage />,
              },
              {
                path: "change-password",
                element: <ChangePasswordPage />,
              },
            ],
          },
        ],
      },
    ],
  },
]);
