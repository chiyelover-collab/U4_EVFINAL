
const API_URL = "http://localhost:3000/api/users";
const API_URL_RESERVATIONS = "http://localhost:3000/api/reservations";
const AUTH_API_URL = "http://localhost:3000/api/auth";


const getHeaders = () => {
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    };
};

export const getCurrentUser = () => {
    try {
        const sessionData = localStorage.getItem('user');
        if (!sessionData) return null;

        const usuario = JSON.parse(sessionData);

        return {
            full_name: usuario.full_name || "Usuario",
            email: usuario.email || "sin-correo@correo.com",
            edad: usuario.age || usuario.edad || "25",
            objetivos: Array.isArray(usuario.objectives) 
                ? usuario.objectives 
                : (usuario.objectives ? usuario.objectives.split(',') : ["Perder peso", "Ganar músculo", "Mejorar resistencia"]),
            avatar_url: usuario.avatar_url || usuario.foto || null
        };
    } catch (error) {
        console.error("Error leyendo los datos del usuario:", error);
        return null;
    }
};


export async function getPerfil() {
    const response = await fetch(`${AUTH_API_URL}/me`, {
        method: 'GET',
        headers: getHeaders()
    });
    if (!response.ok) throw new Error("Error al obtener perfil");
    return await response.json();
}

export async function updatePerfil(datos) {
    const response = await fetch(`${AUTH_API_URL}/me`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(datos)
    });
    if (!response.ok) throw new Error("Error al guardar cambios");
    return await response.json();
}

export async function updatePassword(passwordData) {
    const response = await fetch(`${AUTH_API_URL}/me/password`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(passwordData)
    });
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.mensaje || "Contraseña actual incorrecta");
    }
    return true;
}
export const getMyReservations = async () => {
    try {
        const response = await fetch(`${API_URL_RESERVATIONS}/my-reservations`, {
            method: 'GET',
            headers: getHeaders() 
        });
        if (!response.ok) throw new Error("Error al obtener las reservas");
        return await response.json();
    } catch (error) {
        console.error("Error obteniendo reservas:", error);
        return null;
    }
};

export const createReservation = async (class_schedule_id) => {
    try {
        const response = await fetch(API_URL_RESERVATIONS, {
            method: 'POST',
            headers: getHeaders(), 
            body: JSON.stringify({ class_schedule_id })
        });
        if (!response.ok) throw new Error("Error al crear la reserva");
        return await response.json();
    } catch (error) {
        console.error("Error creando reserva:", error);
        return null;
    }
};

export const cancelReservation = async (id) => {
    try {
        const response = await fetch(`${API_URL_RESERVATIONS}/${id}/cancel`, {
            method: 'PATCH',
            headers: getHeaders() 
        });
        if (!response.ok) throw new Error("Error al cancelar la reserva");
        return await response.json();
    } catch (error) {
        console.error("Error cancelando reserva:", error);
        return null;
    }
};