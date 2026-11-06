// javascript/funciones.js - Lógica general del sistema y servicios médicos

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
