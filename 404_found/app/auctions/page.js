"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./page.module.css";

export default function Auction() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("https://dummyjson.com/products")
      .then(response => response.json())
      .then(data => setProducts(data.products))
      .catch(error => console.error("Error al cargar las subastas:", error));
  }, []);

  return (
    <main>
    <section id="productsContainer" className="grid-container">
        {products.length > 0 ? (
        products.map(product => (
            <div key={product.id} className="subasta">
            <div className="subasta-contenido">
                <Link href={`/subasta/${product.id}`}>
                  <img src={product.thumbnail} alt={product.title} className="product-thumbnail" />
                    <h3>{product.title}</h3>
                </Link>
            </div>
            </div>
        ))
        ) : (
        <p>No se encontraron subastas.</p>
        )}
    </section>
    </main>
  );
}
