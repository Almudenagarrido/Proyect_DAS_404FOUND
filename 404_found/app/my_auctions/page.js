"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import styles from "./my_auctions.module.css";

export default function Auction() {
  const [products, setProducts] = useState([]);
  const [possibleCategories, setPossibleCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectAllCategories, setSelectAllCategories] = useState(true);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [minAvailablePrice, setMinAvailablePrice] = useState(0);
  const [maxAvailablePrice, setMaxAvailablePrice] = useState(10000);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";
  const router = useRouter();

  // Current autenticated user
  useEffect(() => {
    const token = localStorage.getItem("access");

    if (!token) {
      router.push("/login");
      return;
    }

    fetch("http://127.0.0.1:8000/api/users/profile/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setCurrentUserId(data.id);
      })
      .catch((err) => {
        console.error("Error al obtener el usuario:", err);
        router.push("/login");
      });
  }, [router]);

  // Categories
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
      const token = localStorage.getItem("access");
      if (!token) return;

      fetch("http://127.0.0.1:8000/api/auctions/users/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => res.json())
        .then((data) => {
          const prices = data.map((p) => p.price);
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
  
    const token = localStorage.getItem("access");

    if (!token) return;

    fetch(`http://127.0.0.1:8000/api/auctions/users/?${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setProducts(data))
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

  // Filter auctions
  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!currentUserId || !token) return;

    fetch("http://127.0.0.1:8000/api/auctions/users/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const userAuctions = data.filter(
          (auction) => auction.auctioneer === currentUserId
        );
        setProducts(userAuctions);
        setFilteredProducts(userAuctions);
      })
      .catch((error) => {
        console.error("Error al cargar las subastas:", error);
      });
  }, [currentUserId]);

  // Filters
  useEffect(() => {
    const filtered = products.filter((product) => {
      const matchesSearch =
        product.title.toLowerCase().includes(searchQuery) ||
        product.description.toLowerCase().includes(searchQuery);

      const matchesPrice =
        product.price >= minPrice && product.price <= maxPrice;

      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(product.category);

      return matchesSearch && matchesPrice && matchesCategory;
    });

    setFilteredProducts(filtered);
  }, [searchQuery, minPrice, maxPrice, selectedCategories, products]);

  function auctionRegister() {
    router.push("/edit_auction");
  }

  function deleteButtonClick(product_id) {
    const token = localStorage.getItem("access");

    if (window.confirm("¿Estás seguro de que deseas eliminar esta subasta?")) {
      fetch(`http://127.0.0.1:8000/api/auctions/${product_id}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            alert("Subasta eliminada con éxito");
            setFilteredProducts((prevProducts) =>
              prevProducts.filter((product) => product.id !== product_id)
            );
          } else {
            throw new Error("Error al eliminar la subasta");
          }
        })
        .catch((error) => {
          console.error("Error al eliminar la subasta:", error);
          alert("Hubo un problema al eliminar la subasta.");
        });
    }
  }

  return (
    <main className={styles.auctionPage}>
      <div className={styles.header}>
        <h2 className={styles.title}>Mis Subastas</h2>
        <hr className={styles.line} />
      </div>
      <section className={styles.buttonContainer}>
        <button className={styles.createButton} onClick={auctionRegister}>
          Crear subasta
        </button>
      </section>

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
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product.id} className={styles.subasta}>
              <div className={styles.subastaContenido}>
                <Link href={`/details/${product.id}`}>
                  <div>
                    <div className={styles.imageWrapper}>
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className={styles.productThumbnail}
                      />
                    </div>
                    <h3 className={styles.subastaTitle}>{product.title}</h3>
                  </div>
                </Link>

                <section className={styles.buttonContainer}>
                  <Link href={`/edit_auction/${product.id}`}>
                    <button className={styles.editButton}>
                      <Image
                        src="/images/pencil.webp"
                        alt="Editar"
                        width={50}
                        height={50}
                        className={styles.image}
                        priority
                      />
                    </button>
                  </Link>

                  <button
                    className={styles.deleteButton}
                    onClick={() => deleteButtonClick(product.id)}
                  >
                    <Image
                      src="/images/basurita.png"
                      alt="Eliminar"
                      width={50}
                      height={50}
                      className={styles.image}
                      priority
                    />
                  </button>
                </section>
              </div>
            </div>
            ))
          ) : (
            <p className={styles.noSubastas}>
              {searchQuery
                ? "No se encontraron subastas con ese término."
                : "Cargando subastas..."}
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
