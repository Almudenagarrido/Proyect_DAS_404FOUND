"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams, Suspense } from "next/navigation";
import styles from "./auctions.module.css";

// Componente para envolver el contenido en Suspense
function AuctionContent() {
  const [products, setProducts] = useState([]);
  const [possibleCategories, setPossibleCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectAllCategories, setSelectAllCategories] = useState(true);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [minAvailablePrice, setMinAvailablePrice] = useState(0);
  const [maxAvailablePrice, setMaxAvailablePrice] = useState(10000);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // Obtener categorías
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/auctions/categories/")
      .then((response) => response.json())
      .then((data) => {
        setPossibleCategories(data.results);
      })
      .catch((error) => {
        console.error("Error al cargar las categorías:", error);
      });
  }, []);

  // Obtener rango de precios al cargar
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/auctions/")
      .then((res) => res.json())
      .then((data) => {
        const prices = data.results.map((p) => p.price);
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        setMinAvailablePrice(min);
        setMaxAvailablePrice(max);
        setMinPrice(min);
        setMaxPrice(max);
      })
      .catch((err) => console.error("Error al obtener precios:", err));
  }, []);

 // Obtener productos según filtros
 useEffect(() => {
  const params = new URLSearchParams();
  if (searchQuery) params.append("texto", searchQuery);

  if (!selectAllCategories && selectedCategories.length > 0) {
    const selectedName = possibleCategories.find(cat => cat.id === selectedCategories[0])?.name;
    if (selectedName) params.append("categoria", selectedName);
  }

  params.append("precioMin", minPrice.toString());
  params.append("precioMax", maxPrice.toString());

  fetch(`http://127.0.0.1:8000/api/auctions/?${params.toString()}`)
    .then((res) => res.json())
    .then((data) => setProducts(data.results))
    .catch((err) => console.error("Error al cargar subastas:", err));
}, [searchQuery, minPrice, maxPrice, selectedCategories, selectAllCategories, possibleCategories]);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [categoryId] 
    );
    setSelectAllCategories(false);
  };

  const handleSelectAllChange = () => {
    setSelectedCategories([]);
    setSelectAllCategories(!selectAllCategories);
  };

  const handleEmptyAction = () => {
    if (isAuthenticated) {
      router.push("/edit_auction");
    } else {
      router.push("/register");
    }
  };

  return (
    <main className={styles.auctionPage}>
      <div className={styles.header}>
        <h2 className={styles.title}>Listado de subastas</h2>
        <hr className={styles.line} />
      </div>

      <div className={styles.information}>
        <aside className={styles.sidebar}>
          <label>Rango de Precios:</label>
          <div className={styles.priceRange}>
            <input
                type="range"
                min={minAvailablePrice}
                max={maxAvailablePrice}
                value={minPrice}
                onChange={(e) => {
                  const newMin = Number(e.target.value);
                  if (newMin <= maxPrice) setMinPrice(newMin);
                }}
              />
            <span>Min: {minPrice} €</span>
            <input
              type="range"
              min={minAvailablePrice}
              max={maxAvailablePrice}
              value={maxPrice}
              onChange={(e) => {
                const newMax = Number(e.target.value);
                if (newMax >= minPrice) setMaxPrice(newMax);
              }}
            />
            <span>Max: {maxPrice} €</span>
          </div>

          <label>Categorías:</label>
          <div className={styles.categories}>
            <div>
              <input
                type="checkbox"
                id="selectAllCategories"
                checked={selectAllCategories}
                onChange={handleSelectAllChange}
              />
              <label htmlFor="selectAllCategories">Todas</label>
            </div>

            {possibleCategories.map((category) => (
              <div key={category.id}>
                <input
                  type="checkbox"
                  id={`cat-${category.id}`}
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => handleCategoryChange(category.id)}
                  disabled={selectAllCategories}
                />
                <label htmlFor={`cat-${category.id}`}>{category.name}</label>
              </div>
            ))}
          </div>
        </aside>

        <section className={styles.productsContainer}>
          {products.length > 0 ? (
            products.map((product) => (
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
                    <h4 className={styles.subastaPrice}>{product.price} €</h4>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.noSubastasContainer}>
              <p className={styles.noSubastas}>No se encontraron subastas.</p>
              <button className={styles.emptyButton} onClick={handleEmptyAction}>
                {isAuthenticated
                  ? "¡Publica una subasta!"
                  : "Regístrate para poder subir una subasta"}
              </button>
            </div>
          )}
        </section>
      </div>
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
