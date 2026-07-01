// src/pages/admin/UsersPage.jsx
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Badge, InputGroup, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import ManagementTable from '../../components/admin/ManagementTable';
import GenericFormModal from '../../components/GenericFormModal';
import { getUsers, createUser, updateUser, deleteUser } from '../../services/AdminServices';
import '../../assets/css/DashboardAdmin.css'; 

const UsersPage = () => {
    // 1. Estados de la página
    const [usuarios, setUsuarios] = useState([]);
    const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busqueda, setBusqueda] = useState("");

    // Estados del Modal
    const [showModal, setShowModal] = useState(false);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
    const [erroresFormulario, setErroresFormulario] = useState({});

    // 2. CONFIGURACIÓN DINÁMICA DE CAMPOS PARA EL MODAL
    const camposBase = [
        { name: 'full_name', label: 'Nombre Completo', type: 'text', placeholder: 'Ej: Xiao Chiye', maxLength: 50 },
        { name: 'email', label: 'Email', type: 'email', placeholder: 'usuario@correo.com', maxLength: 50 },
        { 
            name: 'role', 
            label: 'Rol', 
            type: 'select', 
            options: [
                { value: 'admin', label: 'Administrador' },
                { value: 'coach', label: 'Entrenador' },
                { value: 'user', label: 'Usuario Estándar' }
            ]
        }
    ];

    const camposPassword = [
        { name: 'password', label: 'Contraseña', type: 'password', placeholder: 'Mín. 8 caracteres, 1 Mayúscula, número y símbolo', maxLength: 40},
        { name: 'confirm', label: 'Confirmar Contraseña', type: 'password', placeholder: 'Repita la contraseña', maxLength: 40 }
    ];

    // Si estamos editando, solo mostramos los base. Si estamos creando, sumamos los de contraseña.
    const camposUsuario = usuarioSeleccionado ? camposBase : [...camposBase, ...camposPassword];

    // 3. Carga de datos
    const cargarUsuarios = async () => {
        try {
            setLoading(true);
            const data = await getUsers();
            const lista = data.data || data; 
            setUsuarios(lista);
            setUsuariosFiltrados(lista);
        } catch (error) {
            Swal.fire("Error", "No se pudo cargar la lista de usuarios: " + error.message, "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarUsuarios();
        document.body.className = "class_body";
        return () => { document.body.className = ""; };
    }, []);

    // 4. Manejo visual (Búsqueda y Modales)
    const handleBuscar = (e) => {
        const termino = e.target.value.toLowerCase();
        setBusqueda(termino);
        const filtrados = usuarios.filter(u => 
            u.full_name.toLowerCase().includes(termino) || 
            u.email.toLowerCase().includes(termino)
        );
        setUsuariosFiltrados(filtrados);
    };

    const abrirModalCrear = () => {
        setUsuarioSeleccionado(null);
        setErroresFormulario({});
        setShowModal(true);
    };

    const abrirModalEditar = (usuario) => {
        setUsuarioSeleccionado(usuario);
        setErroresFormulario({});
        setShowModal(true);
    };

    const cerrarModal = () => {
        setShowModal(false);
        setUsuarioSeleccionado(null);
        setErroresFormulario({});
    };

    // 5. Función principal de guardado con VALIDACIONES
    const handleGuardar = async (formData) => {
        let nuevosErrores = {};
        let esValido = true;

        const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*_]).{8,}$/;

        if (!formData.full_name || formData.full_name.trim().length < 3) {
            nuevosErrores.full_name = "El nombre debe tener al menos 3 caracteres";
            esValido = false;
        } else if (!nombreRegex.test(formData.full_name)) {
            nuevosErrores.full_name = "El nombre solo puede contener letras";
            esValido = false;
        }

        if (!formData.email || !emailRegex.test(formData.email)) {
            nuevosErrores.email = "Ingrese un correo electrónico válido";
            esValido = false;
        }

        if (!formData.role) {
            nuevosErrores.role = "Debe seleccionar un rol";
            esValido = false;
        }

        // Validación de contraseñas SOLO si estamos creando un usuario nuevo
        if (!usuarioSeleccionado) {
            if (!formData.password || !passRegex.test(formData.password)) {
                nuevosErrores.password = "Mínimo 8 caracteres, incluya Mayúscula, número y símbolo (!@#*)";
                esValido = false;
            }
            if (formData.password !== formData.confirm) {
                nuevosErrores.confirm = "Las contraseñas no coinciden";
                esValido = false;
            }
        }

        if (!esValido) {
            setErroresFormulario(nuevosErrores);
            return;
        }

        setErroresFormulario({});

        try {
            // Removemos el campo 'confirm' antes de enviar al backend por limpieza
            const datosParaGuardar = { ...formData };
            delete datosParaGuardar.confirm;

            if (usuarioSeleccionado) {
                await updateUser(usuarioSeleccionado.id, datosParaGuardar);
                Swal.fire("¡Actualizado!", "Los datos del usuario han sido modificados.", "success");
            } else {
                await createUser(datosParaGuardar);
                Swal.fire("¡Creado!", "El nuevo usuario ha sido registrado con éxito.", "success");
            }
            cerrarModal();
            cargarUsuarios();
        } catch (error) {
            Swal.fire("Error", error.message, "error");
        }
    };

    // 6. Eliminar
    const handleEliminar = async (id, nombre) => {
        const confirmacion = await Swal.fire({
            title: '¿Eliminar usuario?',
            text: `Estás a punto de eliminar a ${nombre}. Esta acción no se puede deshacer.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (confirmacion.isConfirmed) {
            try {
                await deleteUser(id);
                Swal.fire("¡Eliminado!", "El usuario ha sido eliminado correctamente.", "success");
                cargarUsuarios();
            } catch (error) {
                Swal.fire("Error al eliminar", error.message, "error");
            }
        }
    };

    const getBadgeColor = (rol) => {
        const rolLower = rol?.toLowerCase() || '';
        if (rolLower === 'admin') return 'danger';
        if (rolLower === 'coach') return 'primary';
        return 'success'; 
    };

    // 7. Instrucciones
    const instrucciones = [
        { title: "Búsqueda", text: "Filtre instantáneamente por nombre o correo desde la barra superior." },
        { title: "Gestión", text: <span>Use los botones para <span className="text-warning fw-bold">Editar</span> o <span className="text-danger fw-bold">Eliminar</span> registros.</span> },
        { title: "Roles", text: "Los badges identifican el nivel de acceso (Admin, Coach, User)." },
        { title: "Seguridad", text: "Al crear un usuario, asegúrese de que las contraseñas coincidan y cumplan con los requisitos." }
    ];

    return (
        <Container as="main" className="my-4">
            <Row className="mb-4 align-items-center">
                <Col md={8}>
                    <InputGroup>
                        <InputGroup.Text className="bg-white">
                            <i className="fas fa-search"></i>
                        </InputGroup.Text>
                        <Form.Control 
                            type="text" 
                            placeholder="Buscar usuario por nombre o correo..." 
                            value={busqueda}
                            onChange={handleBuscar}
                        />
                    </InputGroup>
                </Col>
                <Col md={4} className="text-end mt-3 mt-md-0">
                    <Button variant="success" onClick={abrirModalCrear}>
                        <i className="fas fa-user-plus me-2"></i> Nuevo Usuario
                    </Button>
                </Col>
            </Row>

            <ManagementTable 
                title="Listado de Usuarios"
                icon="fa-users"
                columns={["ID", "Nombre Completo", "Email", "Rol", "Acciones"]}
                data={usuariosFiltrados}
                loading={loading}
                emptyMessage="No se encontraron usuarios que coincidan con la búsqueda."
                instructions={instrucciones}
                renderRow={(user) => (
                    <tr key={user.id}>
                        <td>{String(user.id).padStart(3, '0')}</td>
                        <td className="text-center fw-bold">{user.full_name}</td>
                        <td className="text-center">{user.email}</td>
                        <td>
                            <Badge bg={getBadgeColor(user.role)}>
                                {user.role}
                            </Badge>
                        </td>
                        <td>
                            <div className="d-flex justify-content-center gap-2">
                                <Button variant="warning" size="sm" onClick={() => abrirModalEditar(user)}>
                                    <i className="fas fa-edit"></i>
                                </Button>
                                <Button variant="danger" size="sm" onClick={() => handleEliminar(user.id, user.full_name)}>
                                    <i className="fas fa-trash"></i>
                                </Button>
                            </div>
                        </td>
                    </tr>
                )}
            />

            <GenericFormModal 
                show={showModal} 
                handleClose={cerrarModal} 
                handleSave={handleGuardar} 
                title={usuarioSeleccionado ? "Editar Usuario" : "Crear Nuevo Usuario"}
                fields={camposUsuario} // <-- Pasamos el arreglo dinámico
                initialData={{ full_name: "", email: "", role: "", password: "", confirm: "" }}
                selectedItem={usuarioSeleccionado} 
                errores={erroresFormulario}
            />
        </Container>
    );
};

export default UsersPage;