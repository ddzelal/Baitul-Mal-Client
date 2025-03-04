import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { AuthLayout } from "@/components/layout/auth.layout.tsx";
import NotFoundPage from "@/pages/not-found.page.tsx";
import AuthenticateLayout from "@/components/layout/authenticate.layout.tsx";
import { AuthRequests } from "@/api/requests/auth.requests.ts";
import { setupAxios } from "@/api/configs/axios.config.ts";
import axios from "axios";
import {
  protectedRoutes,
  publicRoutes,
} from "@/constants/navigation-links.tsx";
import { removeAuth, setAuth } from "@/lib/auth.utils.ts";
import ProtectedRoute from "@/routes/protected-route.tsx";
// Setup Axios before using Loader
setupAxios(axios);

const authLoader = async () => {
  try {
    const user = await AuthRequests.getMe();
    setAuth(user);
    return { user: Promise.resolve(user) };
  } catch (error) {
    console.error("Auth loader - failed to load user data:", error);
    removeAuth();
    return { user: Promise.resolve(null) };
  }
};

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      loader={authLoader}
      element={<AuthLayout />}
      errorElement={<NotFoundPage />}
    >
      {publicRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}
      <Route element={<AuthenticateLayout />}>
        {protectedRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <ProtectedRoute
                allowedRoles={route.allowedRoles}
                element={route.element}
              />
            }
          />
        ))}
      </Route>
    </Route>
  )
);
