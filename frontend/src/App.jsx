import { Routes, Route, Outlet } from "react-router-dom";
import Register from "./pages/Register";

function Layout() {
  return (
    <>
      <Outlet />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Register />} />
        {/* Add more routes as needed */}
      </Route>
    </Routes>
  );
}