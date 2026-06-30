import { Link, Outlet } from "react-router-dom"
import Navbar_Coach from "../components/NavbarCoach.jsx";
function CoachLayout() {
    return (
        <div>
            <Navbar_Coach />
            <main>
                <Outlet />
            </main>
        </div>
    )
}
export default CoachLayout