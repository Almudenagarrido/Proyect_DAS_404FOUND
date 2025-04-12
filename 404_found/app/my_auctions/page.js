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
  const [maxPrice, setMaxPrice] = useState(100000);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";
  const router = useRouter();

  // 1. Current autenticated user
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

  // 2. Filter auctions
  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!currentUserId || !token) return;

    fetch("http://127.0.0.1:8000/api/auctions/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const userAuctions = data.results.filter(
          (auction) => auction.auctioneer === currentUserId
        );
        setProducts(userAuctions);
        setFilteredProducts(userAuctions);
      })
      .catch((error) => {
        console.error("Error al cargar las subastas:", error);
      });
  }, [currentUserId]);

  // 3. Filters
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
      <section className={styles.productsContainer}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} className={styles.subasta}>
              <div className={styles.subastaContenido}>
                <div className={styles.imageWrapper}>
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className={styles.productThumbnail}
                  />
                </div>
                <h3 className={styles.subastaTitle}>{product.title}</h3>
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
    </main>
  );
}
