import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "../pages/Home"
import Login from "../pages/Login"
import Register from "../pages/Register"
import ExitoRegister from "../pages/Exito_Register"
import RoomsPage from "../pages/admin/RoomsPage.jsx";

import UserLayout from "../layouts/UserLayout"
import CoachLayout from "../layouts/CoachLayout"
import AdminLayout from "../layouts/AdminLayout"


import UserDashboard from "../pages/user/UserDashboard"
import CoachDashboard from "../pages/coach/CoachDashboard"
import AdminDashboard from "../pages/admin/AdminDashboard"


import ProtectedRoute from "./ProtectedRoutes"
import UsersPage from "../pages/admin/UsersPage.jsx";
import SportsManagement from "../pages/admin/SportManagment.jsx";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/exito-register" element={<ExitoRegister />} />

                <Route element={<ProtectedRoute rolPermitido="user" />}>
                    <Route path="/user" element={<UserLayout />}>
                        <Route path="dashboard" element={<UserDashboard />} />
                    </Route>
                </Route>

                <Route element={<ProtectedRoute rolPermitido="coach" />}>
                    <Route path="/coach" element={<CoachLayout />}>
                        <Route path="dashboard" element={<CoachDashboard />} />
                    </Route>
                </Route>

                <Route element={<ProtectedRoute rolPermitido="admin" />}>
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="gestion" element={<UsersPage />} />
                        <Route path = "deportes" element ={<SportsManagement />} />
                        <Route path="salas" element={<RoomsPage />} />
                    </Route>
                </Route>

            </Routes>
        </BrowserRouter>
    )
}
export default AppRoutes