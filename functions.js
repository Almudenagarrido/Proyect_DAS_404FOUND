document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        let camposValidos = comprobarCampos();
        let correoValido = validarCorreo();
        let dniValido = validarDNI();

        if (camposValidos && correoValido && dniValido) {
            form.submit();
        }
    });
});

function comprobarCampos() {
    
    let valid = true;
    const requiredFields = ["name", "surname", "dni", "mail"];

    requiredFields.forEach(field => {
        const input = document.getElementById(field);

        if (input.value.trim() === "") {
            valid = false;
            input.placeholder = "Campo obligatorio vacío";
            input.style.border = "2px solid red";
            input.style.color = "red";
        }
        else {
            input.style.border = "";
            input.style.color = "";
        }
    });

    return valid;
}

function validarCorreo() {
    let valid = true;
    const mailInput = document.getElementById("mail");

    const mailPattern = /^[a-zA-Z0-9._%+-]+@comillas\.edu$/;

    if (!mailPattern.test(mailInput.value.trim())) {
        valid = false;
        mailInput.value = "";
        mailInput.placeholder = "<usuario>@comillas.edu";
        mailInput.style.border = "2px solid red";
        mailInput.style.color = "red";
    } 
    else {
        mailInput.style.border = "";
        mailInput.style.color = "";
    }

    return valid;
}

function validarDNI() {
    let valid = true;

    const dniInput = document.getElementById("dni");

    const dniPattern = /^([0-9]{8})([A-Z]{1})$/;

    if (!dniPattern.test(dniInput.value.trim())) {
        valid = false;
        dniInput.placeholder = "45345465Y";
        dniInput.style.border = "2px solid red";
        dniInput.style.color = "red";
    }
    else {
        dniInput.style.border = "";
        dniInput.style.color = "";
    }

    return valid;
}