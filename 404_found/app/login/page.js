import React from "react";
import styles from "@/page.module.css";

export default function LogIn() {
  return (
    <>
    <html key="1" lang="es">
    <body>
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
            <input id="user" type="text" />
            <br />
            <br />
            <label htmlFor="password">Contraseña: </label>
            <input id="password" minLength="8" required type="password" />
            <br />
            <br />
            <input type="submit" value="Enviar" />
            <input
                defaultValue="Inicio de Sesión"
                id="return"
                onclick="window.location.href='index.html';"
                type="button"
            />
            </fieldset>
        </form>
        </main>
    </body>
    </html>;
    </>
  );
}