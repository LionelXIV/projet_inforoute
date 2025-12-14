import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import { JeuxDonnees } from "./pages/JeuxDonnees";
import { JeuDonneesDetail } from "./pages/JeuDonneesDetail";
import { Statistics } from "./pages/Statistics";
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
          <Route path="/jeux-donnees" element={<JeuxDonnees />} />
          <Route path="/jeux-donnees/:id" element={<JeuDonneesDetail />} />
          <Route path="/statistics" element={<Statistics />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
