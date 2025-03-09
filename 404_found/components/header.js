"use client";
import React, { useState, useEffect } from "react";
import styles from "./header.module.css";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Header() {
  const [search, setSearch] = useState("");
  const [username, setUsername] = useState("");  
  const router = useRouter();

  // Search
  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/auctions?search=${encodeURIComponent(search.trim())}`);
    }
  };

  // Username
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername); 
    }
  }, []);

  // Handle Logout (POR AHORA ESTÁ AQUÍ PORQUE NO TENEMOS CLARO CÓMO HAY QUE MANEJAR ESTO TODAVÍA)
  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("access"); 
    window.location.reload(); 
    router.push("/login");
  };

  return (
    <header className={styles.headerContainer}>
      <nav className={styles.navContainer}>
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <Link href={"/"}>
              <Image
                src="/images/imagen_capibara.webp"
                alt="Logo"
                width={50}
                height={50}
                className={styles.logo}
                priority
              />
            </Link>
          </li>
          <li className={styles.searchBar}>
            <form className={styles.searchForm} onSubmit={handleSearch}>
              <input
                className={styles.searchInput}
                name="search"
                placeholder="Buscar productos.."
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className={styles.searchButton} type="submit">🔍</button>
            </form>
          </li>
          <li className={styles.navItem}>
            {username ? (
              <div className={styles.dropdownContainer}>
                <button className={styles.dropbtn}>
                  Bienvenido, {username} <i className="fa fa-caret-down" />
                </button>
                <div className={styles.dropdownContent}>
                  <Link href="/user">Mi cuenta</Link>
                  <button onClick={handleLogout} className={styles.logoutButton}>Cerrar sesión</button>
                </div>
              </div>
            ) : (
              <div className={styles.dropdownContainer}>
                <button className={styles.dropbtn}>
                  Identifícate <i className="fa fa-caret-down" />
                </button>
                <div className={styles.dropdownContent}>
                  <Link href={"/login"}>Inicio de sesión</Link>
                  <Link href={"/register"}>Registro</Link>
                </div>
              </div>
            )}
          </li>
        </ul>
      </nav>
      <nav className={styles.navBottom}>
        <ul className={styles.navList}>
          <li>
            <ul className={styles.navList}>
              <li className={styles.navBottomItem}>
                <Link className={styles.navLink} href={"/auctions"}>Subastas</Link>
              </li>
              <li>
                <Link className={styles.navLink} href="">Mis pujas</Link>
              </li>
              <li>
                <Link className={styles.navLink} href={"/"}>Subastas guardadas</Link>
              </li>
              <li>
                <Link className={styles.navLink} href={"/"}>Subastas recientes</Link>
              </li>
              <li>
                <Link className={styles.navLink} href={"/"}>Historial de compras</Link>
              </li>
              <li>
                <Link className={styles.navLink} href={"/"}>Calendario subastas</Link>
              </li>
            </ul>
          </li>
          <li className={styles.navItem}>
            <Link className={styles.navLink} href={"/"}>🛒</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
