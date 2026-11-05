// script.js - Lógica principal del Frontend para Salud 360

let usuarioAutenticado = false;
let nombreUsuarioActual = "";

document.addEventListener('DOMContentLoaded', () => {
    const formLogin = document.getElementById('formLogin');
    const formRegistro = document.getElementById('formRegistro');
    
    if (formLogin) formLogin.reset();
    if (formRegistro) formRegistro.reset();

    // Verificamos si ya hay una sesión activa guardada en localStorage (Persistencia al recargar)
    const sesionGuardada = localStorage.getItem('sesionActivaSalud360');
    if (sesionGuardada) {
        const datosUsuario = JSON.parse(sesionGuardada);
        usuarioAutenticado = true;
        nombreUsuarioActual = datosUsuario.nombre;
        
        actualizarInterfazAutenticada();
        cambiarSeccion('dashboard');
    } else {
        const userInfoHeader = document.getElementById('userInfoHeader');
        const sidebarNav = document.getElementById('sidebarNav');

        if (userInfoHeader) {
            userInfoHeader.classList.add('hidden');
            userInfoHeader.classList.remove('flex');
        }
        if (sidebarNav) {
            sidebarNav.classList.add('hidden');
        }
        cambiarSeccion('home');
    }

    console.log("Salud 360 - Frontend inicializado correctamente");
});

function cambiarSeccion(seccionId) {
    const secciones = ['home', 'dashboard', 'citas', 'tramites', 'resultados', 'pagos', 'directorio', 'calificacion', 'auth'];
    
    const seccionesPrivadas = ['dashboard', 'citas', 'tramites', 'resultados', 'pagos', 'calificacion'];
    if (seccionesPrivadas.includes(seccionId) && !usuarioAutenticado) {
        mostrarModal("Acceso Restringido", "Debes iniciar sesión con tu cuenta para acceder a los servicios de salud.");
        seccionId = 'auth';
    }

    secciones.forEach(sec => {
        const elementoSec = document.getElementById(`sec-${sec}`);
        const navBtn = document.getElementById(`nav-${sec}`);
        
        if (elementoSec) {
            elementoSec.classList.add('hidden');
        }
        
        if (navBtn) {
            navBtn.className = "w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition";
        }
    });

    const secActiva = document.getElementById(`sec-${seccionId}`);
    if (secActiva) {
        secActiva.classList.remove('hidden');
    }

    const activeNav = document.getElementById(`nav-${seccionId}`);
    if (activeNav) {
        activeNav.className = "w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sky-700 bg-sky-50 transition";
    }
}

// --- LOGIN SEGURO CON PERSISTENCIA ---
function iniciarSesion(e) {
    e.preventDefault();
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');

    const email = emailInput ? emailInput.value.trim() : "";
    const password = passwordInput ? passwordInput.value.trim() : "";

    const usuariosRegistrados = JSON.parse(localStorage.getItem('usuariosSalud360')) || [];
    const usuarioEncontrado = usuariosRegistrados.find(u => u.correo === email && u.password === password);

    if (usuarioEncontrado) {
        usuarioAutenticado = true;
        nombreUsuarioActual = usuarioEncontrado.nombre;
        
        // Guardamos la sesión activa en localStorage para que persista al recargar la página
        localStorage.setItem('sesionActivaSalud360', JSON.stringify({ nombre: nombreUsuarioActual, correo: email }));

        actualizarInterfazAutenticada();
        mostrarModal("Bienvenido de nuevo", `Has ingresado como ${nombreUsuarioActual}.`);
        cambiarSeccion('dashboard');
    } else {
        mostrarModal("Error de Autenticación", "Correo o contraseña incorrectos. Por favor, verifica tus datos o regístrate si no tienes cuenta.");
    }
}

// --- REGISTRO SEGURO CON PERSISTENCIA ---
function registrarUsuario(e) {
    e.preventDefault();
    
    const nombreInput = document.getElementById('regNombre');
    const tipoDocInput = document.getElementById('regTipoDoc');
    const numDocInput = document.getElementById('regNumDoc');
    const emailInput = document.getElementById('regEmail');
    const telefonoInput = document.getElementById('regTelefono');
    const passwordInput = document.getElementById('regPassword');

    const nombre = nombreInput ? nombreInput.value.trim() : "";
    const tipoDoc = tipoDocInput ? tipoDocInput.value : "";
    const numDoc = numDocInput ? numDocInput.value.trim() : "";
    const correo = emailInput ? emailInput.value.trim() : "";
    const telefono = telefonoInput ? telefonoInput.value.trim() : "";
    const password = passwordInput ? passwordInput.value.trim() : "";

    if (!nombre || !numDoc || !correo || !telefono || !password) {
        mostrarModal("Campos Incompletos", "Por favor, completa todos los campos obligatorios para crear tu cuenta.");
        return;
    }

    let usuariosRegistrados = JSON.parse(localStorage.getItem('usuariosSalud360')) || [];

    const existeCorreo = usuariosRegistrados.some(u => u.correo === correo);
    if (existeCorreo) {
        mostrarModal("Correo ya registrado", "Este correo electrónico ya se encuentra asociado a una cuenta. Intenta iniciar sesión.");
        return;
    }

    const nuevoUsuario = {
        nombre: nombre,
        tipoDoc: tipoDoc,
        numDoc: numDoc,
        correo: correo,
        telefono: telefono,
        password: password
    };

    usuariosRegistrados.push(nuevoUsuario);
    localStorage.setItem('usuariosSalud360', JSON.stringify(usuariosRegistrados));

    usuarioAutenticado = true;
    nombreUsuarioActual = nombre;
    
    // Guardamos la sesión activa tras el registro
    localStorage.setItem('sesionActivaSalud360', JSON.stringify({ nombre: nombreUsuarioActual, correo: correo }));

    actualizarInterfazAutenticada();
    mostrarModal("¡Registro Exitoso!", `Tu cuenta ha sido creada correctamente, ${nombreUsuarioActual}. ¡Bienvenido!`);
    cambiarSeccion('dashboard');
}

function cerrarSesion() {
    usuarioAutenticado = false;
    nombreUsuarioActual = "";
    
    // Borramos la sesión activa del almacenamiento local
    localStorage.removeItem('sesionActivaSalud360');
    
    const userInfoHeader = document.getElementById('userInfoHeader');
    if (userInfoHeader) {
        userInfoHeader.classList.add('hidden');
        userInfoHeader.classList.remove('flex');
    }

    const sidebarNav = document.getElementById('sidebarNav');
    if (sidebarNav) {
        sidebarNav.classList.add('hidden');
    }
    
    const btnAuth = document.getElementById('btnAuthHeader');
    if (btnAuth) {
        btnAuth.textContent = "Iniciar Sesión / Registro";
        btnAuth.onclick = function() { cambiarSeccion('auth'); };
        btnAuth.className = "bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition";
    }
    
    mostrarModal("Sesión Finalizada", "Has salido del portal de afiliados correctamente.");
    cambiarSeccion('home');
}

function actualizarInterfazAutenticada() {
    const userInfoHeader = document.getElementById('userInfoHeader');
    if (userInfoHeader) {
        userInfoHeader.classList.remove('hidden');
        userInfoHeader.classList.add('flex');
    }

    const sidebarNav = document.getElementById('sidebarNav');
    if (sidebarNav) {
        sidebarNav.classList.remove('hidden');
    }

    const headerUserName = document.getElementById('headerUserName');
    const dashUserName = document.getElementById('dashUserName');
    
    if (headerUserName) headerUserName.textContent = nombreUsuarioActual;
    if (dashUserName) dashUserName.textContent = nombreUsuarioActual;
    
    const btnAuth = document.getElementById('btnAuthHeader');
    if (btnAuth) {
        btnAuth.textContent = "Ir a mi Panel";
        btnAuth.onclick = function() { cambiarSeccion('dashboard'); };
        btnAuth.className = "bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition";
    }
}

function agendarCita(e) {
    e.preventDefault();
    const especialidad = document.getElementById('especialidad').value;
    const fecha = document.getElementById('fechaCita').value;
    const sede = document.getElementById('sedeCita').value;

    mostrarModal("¡Cita Agendada con Éxito!", `Tu cita de ${especialidad} ha sido confirmada para el día ${fecha} en la ${sede}.`);
    cambiarSeccion('dashboard');
}

function descargarCertificado() {
    mostrarModal("Descarga Exitosa", "Su certificado de afiliación en PDF ha sido generado y descargado correctamente.");
}

function mostrarArchivoCargado() {
    const input = document.getElementById('ordenMedica');
    const nombre = document.getElementById('nombreArchivo');
    if (input && input.files.length > 0 && nombre) {
        nombre.textContent = `✔ Archivo adjunto: ${input.files[0].name}`;
    }
}

function verResultadoDetalle(examen, fecha, detalle) {
    mostrarModal(`Resultado: ${examen}`, `Fecha del examen: ${fecha}\nDiagnóstico: ${detalle}`);
}

function simularPagoPSE() {
    mostrarModal("Pago Exitoso (PSE)", "La transacción de su cuota moderadora por valor de $4.500 se ha realizado con éxito mediante PSE.");
}

function calificar(estrellas) {
    const mensajeCalificacion = document.getElementById('mensajeCalificacion');
    if (mensajeCalificacion) {
        mensajeCalificacion.textContent = `Has seleccionado ${estrellas} de 5 estrellas. ¡Gracias por tu opinión!`;
    }
}

function enviarCalificacion() {
    mostrarModal("¡Muchas Gracias!", "Su calificación ha sido enviada con éxito.");
    cambiarSeccion('dashboard');
}

function cambiarTabAuth(tab) {
    const formLogin = document.getElementById('formLogin');
    const formRegistro = document.getElementById('formRegistro');
    const tabLogin = document.getElementById('tab-login');
    const tabRegistro = document.getElementById('tab-registro');

    if (tab === 'login') {
        if (formLogin) formLogin.classList.remove('hidden');
        if (formRegistro) formRegistro.classList.add('hidden');
        if (tabLogin) tabLogin.className = "flex-1 pb-2 font-bold text-sm text-sky-600 border-b-2 border-sky-600";
        if (tabRegistro) tabRegistro.className = "flex-1 pb-2 font-bold text-sm text-slate-400";
    } else {
        if (formLogin) formLogin.classList.add('hidden');
        if (formRegistro) formRegistro.classList.remove('hidden');
        if (tabRegistro) tabRegistro.className = "flex-1 pb-2 font-bold text-sm text-sky-600 border-b-2 border-sky-600";
        if (tabLogin) tabLogin.className = "flex-1 pb-2 font-bold text-sm text-slate-400";
    }
}

function mostrarModal(titulo, mensaje) {
    const modalTitulo = document.getElementById('modalTitulo');
    const modalMensaje = document.getElementById('modalMensaje');
    const modalAlert = document.getElementById('modalAlert');

    if (modalTitulo) modalTitulo.textContent = titulo;
    if (modalMensaje) modalMensaje.textContent = mensaje;
    if (modalAlert) modalAlert.classList.remove('hidden');
}

function cerrarModal() {
    const modalAlert = document.getElementById('modalAlert');
    if (modalAlert) modalAlert.classList.add('hidden');
}
