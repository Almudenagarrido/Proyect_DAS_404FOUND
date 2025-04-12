"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";

export default function LogIn() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  const [validationError, setValidationError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      setValidationError("Por favor, complete ambos campos.");
      return;
    }

    try {
      const logInData = {
        username: formData.username,
        password: formData.password          
      };
      
      const response = await fetch("http://127.0.0.1:8000/api/users/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(logInData)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("access", data.access);  
        localStorage.setItem("username", data.username);
        window.location.reload(); 
        router.push("/");
      } else if (response.status === 400) {
        const detailError = data?.non_field_errors?.[0] || data?.error || "Credenciales inválidas.";
        setValidationError(detailError);
      } else {
        setValidationError("Error al iniciar sesión.");
      }
    } catch (error) {
      setValidationError("Hubo un problema al intentar conectar con el servidor.");
      console.error("Error de conexión:", error);
    }
  };

  return (
    <main className={`${styles.mainContainer}`}>
      <section className={`${styles.container}`}>
        <h2 className={`${styles.h2}`}>Iniciar sesión</h2>
        <form onSubmit={handleSubmit}>
          <fieldset className={`${styles.fieldset}`}>
            <p className={`${styles.legend}`}>
              Por favor, rellena los siguientes datos para iniciar sesión en el sistema
            </p>

            <label htmlFor="username" className={`${styles.label}`}>Usuario: </label>
            <input
              id="username"
              name="username"
              type="text"
              className={`${styles.input}`}
              value={formData.username}
              onChange={handleChange}
            />

            <label htmlFor="password" className={`${styles.label}`}>Contraseña: </label>
            <input
              id="password"
              name="password"
              type="password"
              className={`${styles.input}`}
              value={formData.password}
              onChange={handleChange}
            />

            {validationError && <div className={styles.hide_span}>{validationError}</div>}

            <div className={styles.buttonsContainer}>
              <button type="submit" className={`${styles.button}`}>Iniciar sesión</button>
            </div>
          </fieldset>
        </form>
      </section>
    </main>
  );
}
