"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import styles from "./my_auctions.module.css";
import { useRouter } from "next/navigation";

export default function Auction() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";
  const router = useRouter();

  useEffect(() => {
    fetch("http://localhost:8000/api/auctions/", 
      {method: "GET",})
      .then((response) => response.json())
      .then((data) => {
        setProducts(data.products);
        setFilteredProducts(data.products);
      })
      .catch((error) => console.error("Error al cargar las subastas:", error));
  }, []);

  useEffect(() => {
    const filtered = products.filter((product) => {
      const matchesSearch =
        product.title.toLowerCase().includes(searchQuery) ||
        product.description.toLowerCase().includes(searchQuery);

      const matchesPrice = product.price >= minPrice && product.price <= maxPrice;
      
      const matchesCategory =
        selectedCategories.length === 0 || selectedCategories.includes(product.category);

      return matchesSearch && matchesPrice && matchesCategory;
    });

    setFilteredProducts(filtered);
  }, [searchQuery, minPrice, maxPrice, selectedCategories, products]);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  function auctionRegister() {
    router.push("/create_auction")
  }

  return (
    <main className={styles.auctionPage}>
      <section className={styles.buttonContainer}>
        <button className={styles.createButton} onClick={auctionRegister}>Crear subasta</button>
      </section>
      <section className={styles.productsContainer}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} className={styles.subasta}>
              <div className={styles.subastaContenido}>
                <Link href={`/details/${product.id}`}>
                  <div className={styles.imageWrapper}>
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className={styles.productThumbnail}
                    />
                  </div>
                  <h3 className={styles.subastaTitle}>{product.title}</h3>
                  <section className={styles.buttonContainer}>
                    <button className={styles.editButton}>
                        <Image
                            src="/images/pencil.webp"
                            alt="Logo"
                            width={50}
                            height={50}
                            className={styles.image}
                            priority
                        />
                    </button>
                    <button className={styles.deleteButton}>
                        <Image
                            src="/images/basurita.png"
                            alt="Logo"
                            width={50}
                            height={50}
                            className={styles.image}
                            priority
                        />
                    </button>
                  </section>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className={styles.noSubastas}>
            {searchQuery ? "No se encontraron subastas con ese término." : "Cargando subastas..."}
          </p>
        )}
      </section>
    </main>
  );
}
