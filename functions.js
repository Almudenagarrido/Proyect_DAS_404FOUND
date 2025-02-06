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
        this.placeholder = "54327401B";
        this.style.border = "2px solid red";
    }
    else {
        this.style.border = "";
    }
})

document.getElementById("mail").addEventListener("blur", function (){
    const mailInput = this.value
    const mailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
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
    
    // Comprobar si ya ha pasado el cumpleaños de este año
    const monthDifference = today_month - month;
    const dayDifference = today_day - day;
    
    // Si el mes actual es anterior al mes de nacimiento o el mes es el mismo pero el día aún no ha llegado
    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
        age--; // Restar 1 año si aún no ha cumplido años este año
    }

    // Verificar si la persona tiene 18 años o más
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
    
    // Coger los valores que queremos
    const comunity = this.value;
    const cities = comunities_cities[comunity] || [];
    const citySelect = document.getElementById("city");

    // Limpiar opciones anteriores
    citySelect.innerHTML = '<option value="">-- Selecciona una ciudad --</option>';

    // Si hay ciudades, agregarlas al select
    cities.forEach(city => {
        const option = document.createElement("option");
        option.value = city.toLowerCase();
        option.textContent = city;
        citySelect.appendChild(option);
    });
});


document.getElementById("cargar_subastas").addEventListener("click", function() {

    // Contenedor donde se mostrarán las subastas
    const subastasContainer = document.getElementById("productsContainer");
    // Llamada a la API o a los datos para obtener las subastas
    fetch("https://dummyjson.com/products") // O tu URL de subastas
    .then(response => response.json())  // Parseamos la respuesta JSON
    .then(data => {
        // Limpiar el contenedor antes de agregar nuevas subastas
        subastasContainer.innerHTML = "";

        // Verificamos si los datos contienen productos
        if (data.products && Array.isArray(data.products)) {
            // Iterar sobre los productos (subastas)
            data.products.forEach(product => {
                // Crear un contenedor para cada subasta
                const subastaDiv = document.createElement("div");
                subastaDiv.classList.add("subasta"); // Clases para estilo

                // Añadir contenido del producto/subasta
                subastaDiv.innerHTML = `
                    <h3>${product.title}</h3>
                    <img src="${product.thumbnail}" alt="${product.title}" class="product-thumbnail">
                    <p><strong>Precio:</strong> $${product.price}</p>
                    <p><strong>Descuento:</strong> ${product.discountPercentage}%</p>
                    <p><strong>Stock:</strong> ${product.stock}</p>
                    <p><strong>Marca:</strong> ${product.brand}</p>
                    <p><strong>Categoría:</strong> ${product.category}</p>
                `;

                // Agregar la subasta al contenedor
                subastasContainer.appendChild(subastaDiv);
            });
        } else {
            subastasContainer.innerHTML = "<p>No se encontraron subastas.</p>";
        }
    })
    .catch(error => {
        console.error("Error al cargar las subastas:", error);
        subastasContainer.innerHTML = "<p>Hubo un error al cargar las subastas.</p>";
    });
});

