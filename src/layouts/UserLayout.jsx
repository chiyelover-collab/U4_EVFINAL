import { Link, Outlet } from "react-router-dom"
import NavbarUsuario from "../components/NavbarUsuario.jsx";
function UserLayout() {
    return (
        <div>
            <NavbarUsuario />
            <main>
                <Outlet />
            </main>
        </div>
    )
}
export default UserLayout