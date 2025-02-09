const form = document.querySelector("form");

form.addEventListener("submit", function (event) {
    event.preventDefault();

    let camposValidos = comprobarCampos();

    if (camposValidos) {
        form.submit();
    }
});

function comprobarCampos() {
    let valid = true;
    const requiredFields = ["name", "surname", "dni", "mail", "psw", "confirmationpsw"];

    requiredFields.forEach(field => {
        const input = document.getElementById(field);

        if (input.value.trim() === "") {
            valid = false;
            input.style.border = "2px solid red";
        }
        else {
            switch (field) {
                case "name":
                case "surname":
                    const namePattern = /^[a-zA-Z]+$/;
                    if (!namePattern.test(input.value.trim())) {
                        valid = false;
                        input.style.border = "2px solid red";
                    }
                    break;

                case "dni":
                    const dniPattern = /^([0-9]{8})([A-Z]{1})$/;
                    if (!dniPattern.test(input.value.trim())) {
                        valid = false;
                        input.style.border = "2px solid red";
                    }
                    break;

                case "mail":
                    const mailPattern = /^[a-zA-Z0-9._%+-]+@comillas.edu$/;
                    if (!mailPattern.test(input.value.trim())) {
                        valid = false;
                        input.style.border = "2px solid red";
                    }
                    break;

                case "psw":
                    if (input.value.length < 8) {
                        valid = false;
                        input.style.border = "2px solid red";
                    }
                    break;

                case "confirmationpsw":
                    const psw = document.getElementById("psw");
                    if (input.value !== psw.value) {
                        valid = false;
                        input.style.border = "2px solid red";
                        psw.style.border = "2px solid red";
                    }
                    break;
            }
        }
    });

    return valid;
}

document.getElementById("name").addEventListener("blur", function(){
    const pattern = /^[a-zA-Z]+$/;

    if (!pattern.test(this.value.trim())) {
        this.style.border = "2px solid red";
    }
    else {
        this.style.border = "";
    }
})

document.getElementById("surname").addEventListener("blur", function(){
    const pattern = /^[a-zA-Z]+$/;

    if (!pattern.test(this.value.trim())) {
        this.style.border = "2px solid red";
    }
    else {
        this.style.border = "";
    }
})

document.getElementById("dni").addEventListener("keyup", function(){
    const dniPattern = /^([0-9]{8})([A-Z]{1})$/;

    if (!dniPattern.test(this.value.trim())) {
        this.style.border = "2px solid red";
    }
    else {
        this.style.border = "";
    }
})

document.getElementById("mail").addEventListener("blur", function (){
    const mailInput = this.value
    const mailPattern = /^[a-zA-Z0-9._%+-]+@comillas.edu/;
    const spanMail = document.getElementById("spanMail");

    if (!mailPattern.test(mailInput.trim())){
        this.style.border = "2px solid red";
        spanMail.style.display = "block";
    } 
    else{
        this.style.border = "";
        spanMail.style.display = "none";
    }
})

document.getElementById("birthday").addEventListener("blur", function(){
    const dateInput = this.value;
    const spanBday = document.getElementById("spanBday");

    const date = new Date(dateInput);

    if (isNaN(date)) {
        spanBday.textContent = "Fecha no válida";
        spanBday.style.display = "block";
        this.style.border = "2px solid red";
    }
    else {
        spanBday.style.display = "none";
        this.style.border = "";
    }

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const today = new Date();
    const today_year = today.getFullYear();
    const today_month = today.getMonth() + 1;
    const today_day = today.getDate();

    let age = today_year - year;
    const monthDifference = today_month - month;
    const dayDifference = today_day - day;
    
    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
        age--;
    }

    if (age < 18){
        this.style.border = "2px solid red";
        spanBday.style.display = "block";
    } 
    else {
        spanBday.style.display = "none";
        this.style.border = "";
    };
})

document.getElementById("psw").addEventListener("keyup", function () {
    const spanpswl = document.getElementById("spanpswl");
    
    if (this.value.length < 8){
        this.style.border = "2px solid red";
        spanpswl.style.display = "block";
    }
    else {
        spanpswl.style.display = "none";
        this.style.border = "";
    }
})

document.getElementById("psw").addEventListener("blur", function () {
    const spanpswl = document.getElementById("spanpswl");
    
    if (this.value.length < 8){
        this.classList.add("shake");

        setTimeout(() => {
            this.classList.remove("shake");
        }, 200);
    }
    else {
        spanpswl.style.display = "none";
    }
})

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

document.getElementById("comunity").addEventListener("change", function() {
    const comunities_cities = {
        "Andalucia": ["Sevilla", "Málaga", "Granada", "Córdoba", "Jaén", "Huelva", "Almería", "Linares", "Cádiz"],
        "Aragon": ["Zaragoza", "Huesca", "Teruel"],
        "Cataluña": ["Barcelona", "Girona", "Lleida", "Tarragona"],
        "Madrid": ["Madrid"],
        "Valencia": ["Alicante", "Valencia", "Castellón"],
        "Galicia": ["Vigo", "Santiago de Compostela", "A Coruña", "Ourense"],
        "CastillaLaMancha": [], 
        "CastillaYLeon": ["Ávila", "Segovia", "Salamanca", "Valladolid", "León", "Palencia", "Burgos"],
        "Extremadura": ["Badajoz", "Cáceres"],
        "Murcia": ["Murcia", "Cartagena"],
        "Navarra": ["Pamplona"],
        "PaisVasco": ["Bilbao", "Vitoria-Gasteiz", "San Sebastián"],
        "Cantabria": [],  
        "LaRioja": ["Logroño"],
        "IslasCanarias": ["Las Palmas de Gran Canaria", "Santa Cruz de Tenerife"],
        "IslasBaleares": ["Palma de Mallorca"],
        "Ceuta": ["Ceuta"],
        "Melilla": ["Melilla"]
    }
    
    const comunity = this.value;
    const cities = comunities_cities[comunity] || [];
    const citySelect = document.getElementById("city");

    citySelect.innerHTML = '<option value="">-- Selecciona una ciudad --</option>';

    cities.forEach(city => {
        const option = document.createElement("option");
        option.value = city.toLowerCase();
        option.textContent = city;
        citySelect.appendChild(option);
    });
});
