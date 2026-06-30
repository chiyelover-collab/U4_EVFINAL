import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ rolPermitido }) => {
    
    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("user");


    if (!token || !userString) {
        return <Navigate to="/login" replace />;
    }

    const user = JSON.parse(userString);
    const rolActual = user.role.toLowerCase().trim();

    if (rolPermitido && rolActual !== rolPermitido) {
        return <Navigate to="/" replace />; 
    }


    return <Outlet />;
};

export default ProtectedRoute;