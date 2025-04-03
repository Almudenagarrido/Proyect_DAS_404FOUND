document.addEventListener("DOMContentLoaded", function () {
    const subastasContainer = document.getElementById("productsContainer");

    fetch("http://127.0.0.1:8000/api/auctions/")
        .then(response => response.json())
        .then(data => {
            subastasContainer.innerHTML = "";

            if (data.products && Array.isArray(data.products)) {
                data.products.forEach(product => {
                    const subastaDiv = document.createElement("div");
                    subastaDiv.classList.add("subasta");

                    const contenidoDiv = document.createElement("div");
                    contenidoDiv.classList.add("subasta-contenido");
                    contenidoDiv.innerHTML = `
                        <a href="Subastas_Detalle.html?id=${product.id}">
                            <img src="${product.thumbnail}" alt="${product.title}" class="product-thumbnail">
                            <h3>${product.title}</h3>
                        </a>
                    `;

                    subastaDiv.appendChild(contenidoDiv);
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
