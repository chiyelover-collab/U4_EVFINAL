
const API_URL = "http://localhost:3000/api/users";

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