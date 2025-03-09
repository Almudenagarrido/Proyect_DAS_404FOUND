"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import styles from "./details.module.css";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (id) {
      fetch(`https://dummyjson.com/products/${id}`)
        .then((response) => response.json())
        .then((data) => setProduct(data))
        .catch((error) => console.error("Error al cargar detalles:", error));
    }
  }, [id]);

  if (!product) return <p className={styles.noDetalles}>Cargando detalles...</p>;

  return (
    <main className={styles.detailsContainer}>
      <div className={styles.productDetails}>
        <img src={product.thumbnail} alt={product.title} className={styles.productImage} />
        <div className={styles.info}>
          <h2>{product.title}</h2>
          <p>{product.description}</p>
          <p><strong>Precio:</strong> ${product.price}</p>
          <p><strong>Descuento:</strong> {product.discountPercentage}%</p>
          <p><strong>Valoración:</strong> {product.rating}</p>
          <p><strong>Stock:</strong> {product.stock}</p>
          <p><strong>Marca:</strong> {product.brand}</p>
          <p><strong>Categoría:</strong> {product.category}</p>
        </div>
      </div>
    </main>
  );
}
