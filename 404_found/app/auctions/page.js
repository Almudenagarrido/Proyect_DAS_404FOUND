"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./auctions.module.css";

export default function Auction() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("https://dummyjson.com/products")
      .then((response) => response.json())
      .then((data) => setProducts(data.products))
      .catch((error) => console.error("Error al cargar las subastas:", error));
  }, []);

  return (
    <main>
      <h1 className={styles.h1}>Subastas Disponibles</h1>
      <section className={styles.productsContainer}>
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className={styles.subasta}>
              <div className={styles.subastaContenido}>
                <Link href={`/subasta/${product.id}`}>
                  <div className={styles.imageWrapper}>
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className={styles.productThumbnail}
                    />
                  </div>
                  <h3 className={styles.subastaTitle}>{product.title}</h3>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className={styles.noSubastas}>No se encontraron subastas.</p>
        )}
      </section>
    </main>
  );
}
