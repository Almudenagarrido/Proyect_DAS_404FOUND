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

  // Change the data when it is put into the input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle form submit
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
      }
      console.log(logInData);
      const response = await fetch("https://das-p2-backend.onrender.com/api/users/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(logInData)
      });

      const data = await response.json();
      console.log("data");
      console.log(data);

      if (response.ok) {
        console.log("Inicio de sesión!!", data);
        localStorage.setItem("access", data.access);  
        localStorage.setItem("username", data.username); 
        window.location.reload(); 
        router.push("/");
      } else {
        setValidationError(data.error || "Error al iniciar sesión.");
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
