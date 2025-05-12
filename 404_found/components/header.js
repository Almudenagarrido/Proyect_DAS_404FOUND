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
  const [isDropdownOpen, setDropdownOpen] = useState(false);

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

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className={styles.headerContainer}>
      <nav className={styles.navContainer}>
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <Link href={"/"}>
              <Image
                src="/images/perry_the_platapus.png"
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
                <button onClick={toggleDropdown} className={styles.dropbtn}>
                  Bienvenido, {username} <i className="fa fa-caret-down" />
                </button>
                {isDropdownOpen && (
                  <div className={styles.dropdownContent}>
                    <Link href="/user">Mi cuenta</Link>
                    <button onClick={handleLogout} className={styles.logoutButton}>Cerrar sesión</button>
                  </div>
                )}
              </div>
            ) : (
              <div className={styles.dropdownContainer}>
                <button onClick={toggleDropdown} className={styles.dropbtn}>
                  Identifícate <i className="fa fa-caret-down" />
                </button>
                {isDropdownOpen && (
                  <div className={styles.dropdownContent}>
                    <Link href={"/login"}>Inicio de sesión</Link>
                    <Link href={"/register"}>Registro</Link>
                  </div>
                )}
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
                {username && (
                  <div className={styles.dropdownContainer}>
                    <button onClick={toggleDropdown} className={styles.dropbtn}>
                      Mis <i className="fa fa-caret-down" />
                    </button>
                    {isDropdownOpen && (
                      <div className={styles.dropdownContent}>
                        <Link className={styles.navLink} href="/my_bids">Pujas</Link>
                        <Link className={styles.navLink} href="/my_auctions">Subastas</Link>
                        <Link className={styles.navLink} href="/my_ratings">Valoraciones</Link>
                        <Link className={styles.navLink} href="/my_comments">Comentarios</Link>
                      </div>
                    )}
                  </div>
                )}
              </li>
              <li>
                <Link className={styles.navLink} href={"/"}>Subastas guardadas</Link>
              </li>
              <li>
                <Link className={styles.navLink} href={"/"}>Historial de compras</Link>
              </li>
              <li>
                <Link className={styles.navLink} href={"/calendar"}>Calendario subastas</Link>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </header>
  );
}
