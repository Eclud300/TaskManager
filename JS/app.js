document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('formulario-registro');

    if (formulario) {
        formulario.addEventListener('submit', (e) => {
            e.preventDefault(); // Evita que la página se recargue

            const nombre = document.getElementById('nombre').value.trim();
            const correo = document.getElementById('correo').value.trim();
            const password = document.getElementById('password').value.trim();

            // Validación muy básica
            if (nombre === '' || correo === '' || password === '') {
                alert('Por favor, completa todos los campos del registro.');
                return;
            }

            // Si todo está correcto (Aquí iría la conexión a una base de datos)
            alert(`¡Registro exitoso, ${nombre}! Bienvenido a TaskManager.`);
            formulario.reset(); // Limpia el formulario
        });
    }
});