document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    
    const emailError = document.getElementById("email-error");
    const passwordError = document.getElementById("password-error");
    
    const togglePassword = document.getElementById("togglePassword");
    
    togglePassword.addEventListener("click", function () {
        const tipoActual = passwordInput.getAttribute("type");
        if (tipoActual === "password") {
            passwordInput.setAttribute("type", "text");
            togglePassword.textContent = "🙈"; // Ojito cerrado
        } else {
            passwordInput.setAttribute("type", "password");
            togglePassword.textContent = "👁️"; // Ojito abierto
        }
    });

    loginForm.addEventListener("submit", function (event) {
        // Evita que el formulario recargue la página automáticamente
        event.preventDefault(); 

        // Limpiar mensajes y bordes de error previos
        emailError.textContent = "";
        passwordError.textContent = "";
        emailInput.classList.remove("input-error");
        passwordInput.classList.remove("input-error");

        let esValido = true;
        const emailValor = emailInput.value.trim();
        const passwordValor = passwordInput.value.trim();

        // VALIDACIÓN DEL CORREO
        if (emailValor === "") {
            mostrarError(emailInput, emailError, "El correo electrónico es obligatorio.");
            esValido = false;
        } else if (!emailValor.includes("@")) {
            mostrarError(emailInput, emailError, "Te falta el '@' en tu correo (ej. @gmail.com).");
            esValido = false;
        } else {
            const partesEmail = emailValor.split("@");
            const dominio = partesEmail[1];

            if (dominio === "" || !dominio.includes(".")) {
                mostrarError(emailInput, emailError, "El correo está incompleto (te falta el .com, .net, etc.).");
                esValido = false;
            }
        }

        // VALIDACIÓN DE LA CONTRASEÑA
        const tieneMayuscula = /[A-Z]/.test(passwordValor);
        const tieneNumero = /\d/.test(passwordValor);
        const tieneCaracterEspecial = /[!@#$%^&*(),.?":{}|<>]/.test(passwordValor);

        if (passwordValor === "") {
            mostrarError(passwordInput, passwordError, "La contraseña es obligatoria.");
            esValido = false;
        } else if (passwordValor.length < 8) {
            mostrarError(passwordInput, passwordError, "La contraseña debe tener al menos 8 caracteres.");
            esValido = false;
        } else if (!tieneMayuscula) {
            mostrarError(passwordInput, passwordError, "La contraseña debe incluir al menos una letra mayúscula.");
            esValido = false;
        } else if (!tieneNumero) {
            mostrarError(passwordInput, passwordError, "La contraseña debe incluir al menos un número.");
            esValido = false;
        } else if (!tieneCaracterEspecial) {
            mostrarError(passwordInput, passwordError, "La contraseña debe incluir al menos un carácter especial (ej. @, #, !).");
            esValido = false;
        }

        // SI TODO ESTÁ CORRECTO
        if (esValido) {
            alert("¡Inicio de sesión exitoso! (Validaciones aprobadas)");
            loginForm.reset();
            // Regresar el input a tipo password por si se quedó visible
            passwordInput.setAttribute("type", "password");
            togglePassword.textContent = "👁️";
        }
    });

    // Función auxiliar para mostrar errores y pintar el borde de rojo
    function mostrarError(inputElement, errorElement, mensaje) {
        errorElement.textContent = mensaje;
        inputElement.classList.add("input-error");
    }
});