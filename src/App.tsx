import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import { dashboardRoutes, publicRoutes } from "./router/routes";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from 'react-hot-toast';
const AppRoutes = () => {
  const routes = [...publicRoutes, ...dashboardRoutes];
  return useRoutes(routes);
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
      <Toaster position="top-right" />
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;
