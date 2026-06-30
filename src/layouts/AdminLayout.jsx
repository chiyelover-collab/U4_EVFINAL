import { Link, Outlet } from "react-router-dom"
import Navbar_Admin from "../components/admin/NavbarAdmin.jsx";
function AdminLayout() {
    return (
        <div>
            <Navbar_Admin />
            <main>
                <Outlet />
            </main>
        </div>
    )   
}
export default AdminLayout