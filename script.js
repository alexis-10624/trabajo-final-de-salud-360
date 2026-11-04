/**
 * Salud 360 - Lógica de interacciones (Pública / Privada)
 */

let usuarioAutenticado = false;
let nombreUsuarioActual = "Alexis Restrepo";

function cambiarSeccion(seccionId) {
    const secciones = ['home', 'dashboard', 'citas', 'tramites', 'resultados', 'pagos', 'directorio', 'calificacion', 'auth'];
    
    // Restricción de secciones privadas
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

function iniciarSesion(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    
    usuarioAutenticado = true;
    nombreUsuarioActual = email.split('@')[0];
    
    actualizarInterfazAutenticada();
    mostrarModal("Bienvenido de nuevo", `Has ingresado como ${nombreUsuarioActual}.`);
    cambiarSeccion('dashboard');
}

function registrarUsuario(e) {
    e.preventDefault();
    const nombre = document.getElementById('regNombre').value;
    
    usuarioAutenticado = true;
    nombreUsuarioActual = nombre || "Alexis Restrepo";
    
    actualizarInterfazAutenticada();
    mostrarModal("¡Registro Exitoso!", "Tu cuenta ha sido creada y has iniciado sesión correctamente.");
    cambiarSeccion('dashboard');
}

function cerrarSesion() {
    usuarioAutenticado = false;
    const sidebar = document.getElementById('sidebarNav');
    sidebar.classList.add('hidden');
    sidebar.classList.remove('md:block');
    
    document.getElementById('userInfoHeader').classList.add('hidden');
    
    const btnAuth = document.getElementById('btnAuthHeader');
    btnAuth.textContent = "Iniciar Sesión / Registro";
    btnAuth.onclick = function() { cambiarSeccion('auth'); };
    
    mostrarModal("Sesión Finalizada", "Has salido del portal de afiliados correctamente.");
    cambiarSeccion('home');
}

function actualizarInterfazAutenticada() {
    const sidebar = document.getElementById('sidebarNav');
    sidebar.classList.remove('hidden');
    sidebar.classList.add('md:block');
    
    document.getElementById('userInfoHeader').classList.remove('hidden');
    document.getElementById('headerUserName').textContent = nombreUsuarioActual;
    document.getElementById('dashUserName').textContent = nombreUsuarioActual;
    
    const btnAuth = document.getElementById('btnAuthHeader');
    btnAuth.textContent = "Ir a mi Panel";
    btnAuth.onclick = function() { cambiarSeccion('dashboard'); };
}

function agendarCita(e) {
    e.preventDefault();
    const especialidad = document.getElementById('especialidad').value;
    const fecha = document.getElementById('fechaCita').value;
    const sede = document.getElementById('sedeCita').value;

    mostrarModal("¡Cita Agendada con Éxito!", `Tu cita de ${especialidad} ha sido confirmada para el día ${fecha} en la ${sede}.`);
    cambiarSeccion('dashboard');
}

function confirmarCancelacion(btn) {
    if (confirm("¿Estás seguro de que deseas cancelar esta cita?")) {
        btn.parentElement.remove();
        mostrarModal("Cita Cancelada", "El cupo ha sido liberado exitosamente.");
    }
}

function descargarCertificado() {
    mostrarModal("Descarga Exitosa", "Su certificado de afiliación en PDF ha sido generado y descargado correctamente.");
}

function mostrarArchivoCargado() {
    const input = document.getElementById('ordenMedica');
    const nombre = document.getElementById('nombreArchivo');
    if (input.files.length > 0) {
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
    document.getElementById('mensajeCalificacion').textContent = `Has seleccionado ${estrellas} de 5 estrellas. ¡Gracias por tu opinión!`;
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
        formLogin.classList.remove('hidden');
        formRegistro.classList.add('hidden');
        tabLogin.className = "flex-1 pb-2 font-bold text-sm text-sky-600 border-b-2 border-sky-600";
        tabRegistro.className = "flex-1 pb-2 font-bold text-sm text-slate-400";
    } else {
        formLogin.classList.add('hidden');
        formRegistro.classList.remove('hidden');
        tabRegistro.className = "flex-1 pb-2 font-bold text-sm text-sky-600 border-b-2 border-sky-600";
        tabLogin.className = "flex-1 pb-2 font-bold text-sm text-slate-400";
    }
}

function mostrarModal(titulo, mensaje) {
    document.getElementById('modalTitulo').textContent = titulo;
    document.getElementById('modalMensaje').textContent = mensaje;
    document.getElementById('modalAlert').classList.remove('hidden');
}

function cerrarModal() {
    document.getElementById('modalAlert').classList.add('hidden');
}