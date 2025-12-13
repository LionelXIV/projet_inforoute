import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/layout/ProtectedRoute";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jeux-donnees"
            element={
              <div>
                <div>Liste des jeux de données (à implémenter - Jour 2)</div>
              </div>
            }
          />
          <Route
            path="/statistics"
            element={
              <div>
                <div>Page de statistiques (à implémenter - Jour 3)</div>
              </div>
            }
          />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
