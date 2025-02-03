const form = document.querySelector("form");

form.addEventListener("submit", function (event) {
    event.preventDefault();

    let camposValidos = comprobarCampos();
    let correoValido = validarCorreo();
    let dniValido = validarDNI();
    //let contraseniaValida = validarContrasenia();
    let nombreApellidoValido = validarNombreApellido();

    if (camposValidos && correoValido && dniValido && contraseniaValida && validarNombreApellido) {
        form.submit();
    }
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
        }
        else {
            input.style.border = "";
        }

        input.addEventListener("input", function () {
            if (input.value.trim() !== "") {
                input.style.border = "";
            }
        });
    });

    return valid;
}

function validarCorreo() {
    let valid = true;
    const mailInput = document.getElementById("mail");

    const mailPattern = /^[a-zA-Z0-9._%+-]+@comillas\.edu$/;

    if (!mailPattern.test(mailInput.value.trim())) {
        valid = false;
        mailInput.placeholder = "usuario@comillas.edu";
        mailInput.style.border = "2px solid red";
    } 
    else {
        mailInput.style.border = "";
    }

    mailInput.addEventListener("input", function () {
        mailInput.style.border = "";
    });

    return valid;
}

function validarDNI() {

    let valid = true;
    const dniInput = document.getElementById("dni");
    const dniPattern = /^([0-9]{8})([A-Z]{1})$/;

    if (!dniPattern.test(dniInput.value.trim())) {
        valid = false;
        dniInput.placeholder = "54327401B";
        dniInput.style.border = "2px solid red";
    }
    else {
        dniInput.style.border = "";
    }

    dniInput.addEventListener("input", function () {
        mailInput.style.border = "";
    });

    return valid;
}

function validarNombreApellido() {

    let valid = true;
    const name = document.getElementById("name");
    const surname = document.getElementById("surname");
    const pattern = /^[a-zA-Z]+$/;

    if (!pattern.test(name.value.trim())) {
        valid = false;
        name.style.border = "2px solid red";
    }

    if (!pattern.test(surname.value.trim())) {
        valid = false;
        name.style.border = "2px solid red";
    }

    name.addEventListener("input", function () {
        name.style.border = "";
    });

    surname.addEventListener("input", function () {
        surname.style.border = "";
    });

    return valid;
}

// function validarContrasenia()
// {
//     let valid = true;
//     const psw = document.getElementById("psw");
//     const confirmationpsw = document.getElementById("confirmationpsw");

//     if (psw.value != confirmationpsw.value)
//     {
//         valid = false;
//         psw.style.border = "2px solid red";
//         confirmationpsw.style.border = "2px solid red";
//     }
//     else {
//         psw.style.border = "";
//         confirmationpsw.style.color = "";
//     }

//     psw.addEventListener("input", function () {
//         psw.style.border = "";
//     });
    
//     confirmationpsw.addEventListener("input", function () {
//         confirmationpsw.style.border = "";
//     });
    
//     return valid;
// }

document.getElementById("confirmationpsw").addEventListener("keyup", function () {
    
    const psw = document.getElementById("psw");
    const spanpsw = document.getElementById("spanpsw");

    if (this.value !== psw.value)
    {
        this.style.border = "2px solid red";
        psw.style.border = "2px solid red";

        spanpsw.style.display = "block";
    }
    else
    {
        this.style.border = "";
        psw.style.border = "";
        spanpsw.style.display = "none";
    }

})

document.getElementById("confirmationpsw").addEventListener("blur", function () {
    const psw = document.getElementById("psw");
    const spanpsw = document.getElementById("spanpsw");

    if (this.value !== psw.value) {
        this.classList.add("shake");
        psw.classList.add("shake");

        setTimeout(() => {
            this.classList.remove("shake");
            psw.classList.remove("shake");
        }, 200);
    }
});
