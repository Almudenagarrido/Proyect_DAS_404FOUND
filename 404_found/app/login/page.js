"use client";
import React from "react";
import { useRouter } from "next/navigation";
import styles from "./login.module.css"; // Assuming the CSS file is named login.module.css

export default function LogIn() {
  const router = useRouter();

  const handleReturn = () => {
    router.push("/");
  };

  return (
    <main>
      <h2>Introduce tu usuario y contraseña para acceder a tu cuenta</h2>
      <form action="">
        <fieldset>
          <legend>
            Por favor, rellena los siguientes datos para iniciar sesión en el
            sistema
          </legend>
          <br />
          <label htmlFor="user">Usuario: </label>
          <input
            id="user"
            type="text"
            className={`${styles.input}`}
          />
          <br />
          <br />
          <label htmlFor="password">Contraseña: </label>
          <input
            id="password"
            minLength="8"
            required
            type="password"
            className={`${styles.input}`}
          />
          <br />
          <br />
          <input type="submit" value="Enviar" />
          <input
            defaultValue="Inicio de Sesión"
            id="return"
            onClick={handleReturn}
            type="button"
            className={`${styles.input} ${styles.shake}`}
          />
        </fieldset>
      </form>
    </main>
  );
}
