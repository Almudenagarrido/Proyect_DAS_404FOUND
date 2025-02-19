import React from "react";
import styles from "./header.module.css";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className={styles.headerContainer}>
      <nav className={styles.navContainer}>
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <a href="index.html">
              <img alt="Logo" className={styles.logo} src="/fotos/imagen_capibara.webp" />
            </a>
          </li>
          <li className={styles.searchBar}>
            <form className={styles.searchForm} action="" method="get">
              <input className={styles.searchInput} name="search" placeholder="Buscar productos.." type="text" />
              <button className={styles.searchButton} type="submit">🔍</button>
            </form>
          </li>
          <li className={styles.navItem}>
            <div className={styles.dropdownContainer}>
              <button className={styles.dropbtn}>
                Identifícate <i className="fa fa-caret-down" />
              </button>
              <div className={styles.dropdownContent}>
                <Link href={"/login/"}>Inicio de sesión</Link>
                <Link href={"/registro/"}>Registro</Link>
              </div>
            </div>
          </li>
        </ul>
      </nav>
      <nav className={styles.navBottom}>
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <a className={styles.navLink} href="">Barra de navegación</a>
          </li>
          <li>
            <ul className={styles.navList}>
              <li className={styles.navBottomItem}>
                <a className={styles.navLink} href="Subastas_General.html">Subastas</a>
              </li>
              <li><a className={styles.navLink} href="">Mis pujas</a></li>
              <li><a className={styles.navLink} href="">Subastas guardadas</a></li>
              <li><a className={styles.navLink} href="">Subastas recientes</a></li>
              <li><a className={styles.navLink} href="">Historial de compras</a></li>
              <li><a className={styles.navLink} href="">Calendario subastas</a></li>
            </ul>
          </li>
          <li className={styles.navItem}>
            <a className={styles.navLink} href="">🛒</a>
          </li>
        </ul>
      </nav>
    </header>
  );
};
