document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    fetch(`https://dummyjson.com/products/${productId}`)
        .then(response => response.json())
        .then(product => {
            const productDetails = document.getElementById("productDetails");

            document.getElementById("thumbnail").src = product.images[0];
            document.getElementById("title").textContent = product.title;
            document.getElementById("description").textContent = product.description;
            document.getElementById("price").textContent = product.price;
            document.getElementById("discountPercentage").textContent = product.discountPercentage;
            document.getElementById("rating").textContent = product.rating;
            document.getElementById("stock").textContent = product.stock;
            document.getElementById("brand").textContent = product.brand;
            document.getElementById("category").textContent = product.category;
            document.getElementById("sku").textContent = product.sku;
            document.getElementById("warrantyInformation").textContent = product.warrantyInformation;
            document.getElementById("shippingInformation").textContent = product.shippingInformation;
            document.getElementById("availabilityStatus").textContent = product.availabilityStatus;
        })
        .catch(error => {
            console.error("Error al cargar los detalles del producto:", error);
            document.getElementById("productDetails").innerHTML = "<p>Hubo un error al cargar los detalles del producto.</p>";
        });
});
