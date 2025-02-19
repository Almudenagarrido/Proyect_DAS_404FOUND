import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <header>
        <nav className="nav-top">
          <ul>
            <li>
              <a href="/">
                <Image src="/fotos/imagen_capibara.webp" alt="Capibara" width={50} height={50} />
              </a>
            </li>
            <li className="search-bar">
              <form action="" method="get">
                <input name="search" placeholder="Buscar productos.." type="text" />
                <button type="submit">🔍</button>
              </form>
            </li>
            <li>
              <div className="dropdown">
                <button className="dropbtn">
                  Identifícate <i className="fa fa-caret-down" />
                </button>
                <div className="dropdown-content">
                  <a href="/Formulario_Login">Inicio de sesión</a>
                  <a href="/Formulario_Registro">Registro</a>
                </div>
              </div>
            </li>
          </ul>
        </nav>

        <nav className="nav-bottom">
          <ul>
            <li><a href="">Barra navegación</a></li>
            <li>
              <ul>
                <li id="cargar_subastas"><a href="/Subastas_General">Subastas</a></li>
                <li><a href="">Mis pujas</a></li>
                <li><a href="">Subastas guardadas</a></li>
                <li><a href="">Subastas recientes</a></li>
                <li><a href="">Historial de compras</a></li>
                <li><a href="">Calendario subastas</a></li>
              </ul>
            </li>
            <li><a className="cart-icon" href="">🛒</a></li>
          </ul>
        </nav>
      </header>

      <main className="index">
        <h1>El mejor precio lo decides tú</h1>
      </main>

      <footer>
        <p>Creado por <b>Lucía Gámir & Almudena Garrido</b> <i>- 2025</i></p>
      </footer>
    </>
  );
}
