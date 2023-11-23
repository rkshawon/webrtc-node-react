import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { RoomProvider } from "./contexts/RoomContext.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Room from "./pages/Room.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <RoomProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/room/:id" element={<Room />} />
        </Routes>
      </RoomProvider>
    </BrowserRouter>
  </React.StrictMode>
);
