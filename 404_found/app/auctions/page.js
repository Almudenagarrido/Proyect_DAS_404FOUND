"use client";
import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./auctions.module.css";

// Componente para envolver el contenido en Suspense
function AuctionContent() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";

  useEffect(() => {
    fetch("https://dummyjson.com/products")
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

  return (
    <main className={styles.auctionPage}>
      <aside className={styles.sidebar}>
        <label>Rango de Precios:</label>
        <div className={styles.priceRange}>
          <span>{minPrice}€</span>
          <input
            type="range"
            min="0"
            max="100"
            value={minPrice}
            onChange={(e) => setMinPrice(Number(e.target.value))}
          />
          <input
            type="range"
            min="0"
            max="100"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
          <span>{maxPrice}€</span>
        </div>

        <label>Categorías:</label>
        <div className={styles.categories}>
          {["beauty", "fragrances", "groceries", "home", "toys", "sports", "automotive", "books", "health", "food"].map(
            (category) => (
              <div key={category}>
                <input
                  type="checkbox"
                  id={category}
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                />
                <label htmlFor={category}>{category}</label>
              </div>
            )
          )}
        </div>
      </aside>

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

export default function Auction() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuctionContent />
    </Suspense>
  );
}
