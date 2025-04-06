"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./auctions.module.css";

export default function Auction() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [possibleCategories, setPossibleCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectAllCategories, setSelectAllCategories] = useState(true); 
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/auctions/")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data.results);
        setFilteredProducts(data.results);
      })
      .catch((error) => console.error("Error al cargar las subastas:", error));
  }, []);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/auctions/categories/")  
      .then((response) => {
        return response.json(); 
      })
      .then((data) => {
        const categories = data.results; 
        console.log("Categorías recibidas:", categories);
        setPossibleCategories(categories);
      })
      .catch((error) => {
        console.error("Error al cargar las categorías:", error); 
      });
  }, []);
  

  useEffect(() => {
    const filtered = products.filter((product) => {
      const matchesSearch =
        product.title.toLowerCase().includes(searchQuery) ||
        product.description.toLowerCase().includes(searchQuery);

      const matchesPrice = product.price >= minPrice && product.price <= maxPrice;
      
      console.log("Categorías seleccionadas:", selectedCategories);
      console.log("Categoría:", product.category);
      const matchesCategory =
        selectedCategories.length === 0 || selectedCategories.includes(product.category);
      console.log("Encaja categoria:", matchesCategory);

      return matchesSearch && matchesPrice && matchesCategory;
    });

    setFilteredProducts(filtered);
  }, [searchQuery, minPrice, maxPrice, selectedCategories, products]);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const handleSelectAllChange = () => {
    if (selectAllCategories) {
      setSelectedCategories([]); 
    } else {
      setSelectedCategories(possibleCategories.map((category) => category.id)); 
    }
    setSelectAllCategories(!selectAllCategories); 
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
            <span>Min: {minPrice} €</span>
            <input
              type="range"
              min="0"
              max="100000"
              value={minPrice}
              onChange={(e) => setMinPrice(Number(e.target.value))}
            />
            <input
              type="range"
              min="0"
              max="100000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
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
              <label htmlFor="selectAllCategories">todas</label>
            </div>

            {possibleCategories.map((category) => (
              <div key={category.id}>
                <input
                  type="checkbox"
                  id={category.name}
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => handleCategoryChange(category.id)} 
                  disabled={selectAllCategories} 
                />
                <label htmlFor={category.name}>{category.name}</label> 
              </div>
            ))}
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
                    <h4 className={styles.subastaPrice}>{product.price} €</h4>
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
      </div>
    </main>
  );
}

