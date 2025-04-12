"use client";
import React, { useState, useEffect } from "react";
import styles from "./user.module.css";  
import { useRouter } from "next/navigation";

export default function UserProfile() {
  const [userData, setUserData] = useState(null);  
  const [error, setError] = useState("");  
  const [isEditing, setIsEditing] = useState(false); 
  const [editedData, setEditedData] = useState({}); 
  const [isPasswordChange, setIsPasswordChange] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("access");  

      if (!token) {
        router.push("/login");  
        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:8000/api/users/profile/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data); 
          setEditedData(data);  
        } else {
          setError("No se pudo obtener la información del perfil.");
        }
      } catch (error) {
        setError("Hubo un problema al intentar conectar con el servidor.");
        console.error("Error de conexión:", error);
      }
    };

    fetchUserData();
  }, [router]);

  const handleChange = (e) => {
    setEditedData({ ...editedData, [e.target.name]: e.target.value });
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    const token = localStorage.getItem("access");  

    if (!token) {
      router.push("/login");
      return;
    }

    if (editedData.password && editedData.password !== editedData.password_confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/users/${userData.id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(editedData)
      });

      if (response.ok) {
        const updatedData = await response.json();
        setUserData(updatedData);
        setIsEditing(false);
        setIsPasswordChange(false);
      } else {
        setError("No se pudo actualizar el perfil: " + error); 
      }
    } catch (error) {
      setError("Hubo un problema al intentar conectar con el servidor.");
      console.error("Error de conexión:", error);
    }
  };

  if (error) {
    return <div>{error}</div>;  
  }

  if (!userData) {
    return <div>Cargando...</div>; 
  }

  return (
    <main className={styles.mainContainer}>
        <section className={styles.container}>
        <h2 className={styles.h2}>Mi Perfil</h2>
        <section className={styles.profileContainer}>
          <section className={styles.profileItem}>
            <p className={styles.p}>Usuario:</p> 
            {isEditing ? (
              <input
                type="text"
                name="username"
                value={editedData.username}
                onChange={handleChange}
                className={styles.input}
              />
            ) : (
              <span>{userData.username}</span>
            )}
          </section>

          <section className={styles.profileItem}>
            <p className={styles.p}>Email:</p>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={editedData.email}
                onChange={handleChange}
                className={styles.input}
              />
            ) : (
              <span>{userData.email}</span>
            )}
          </section>

          <section className={styles.profileItem}>
            <p className={styles.p}>Nombre:</p>
            {isEditing ? (
              <input
                type="text"
                name="first_name"
                value={editedData.first_name}
                onChange={handleChange}
                className={styles.input}
              />
            ) : (
              <span>{userData.first_name}</span>
            )}
          </section>

          <section className={styles.profileItem}>
            <p className={styles.p}>Apellido:</p>
            {isEditing ? (
              <input
                type="text"
                name="last_name"
                value={editedData.last_name}
                onChange={handleChange}
                className={styles.input}
              />
            ) : (
              <span>{userData.last_name}</span>
            )}
          </section>

          <section className={styles.profileItem}>
            <p className={styles.p}>Fecha nacimiento:</p>
            {isEditing ? (
              <input
                type="date"
                name="birth_date"
                value={editedData.birth_date}
                onChange={handleChange}
                className={styles.input}
              />
            ) : (
              <span>{new Date(userData.birth_date).toLocaleDateString()}</span>
            )}
          </section>

          <section className={styles.profileItem}>
            <p className={styles.p}>Localidad:</p>
            {isEditing ? (
              <input
                type="text"
                name="locality"
                value={editedData.locality}
                onChange={handleChange}
                className={styles.input}
              />
            ) : (
              <span>{userData.locality}</span>
            )}
          </section>

          <section className={styles.profileItem}>
            <p className={styles.p}>Municipio:</p> 
            {isEditing ? (
              <input
                type="text"
                name="municipality"
                value={editedData.municipality}
                onChange={handleChange}
                className={styles.input}
              />
            ) : (
              <span>{userData.municipality}</span>
            )}
          </section>
          {isPasswordChange && isEditing && (
            <>
              <section className={styles.profileItem}>
                <p className={styles.p}>Nueva Contraseña:</p>
                <input
                  type="password"
                  name="password"
                  value={editedData.password || ""}
                  onChange={handleChange}
                  className={styles.input}
                />
              </section>

              <section className={styles.profileItem}>
                <p className={styles.p}>Confirmar Contraseña:</p>
                <input
                  type="password"
                  name="password_confirm"
                  value={editedData.password_confirm || ""}
                  onChange={handleChange}
                  className={styles.input}
                />
              </section>
            </>
          )}

          {isEditing && !isPasswordChange && (
            <button
              onClick={() => setIsPasswordChange(true)}
              className={styles.button}
            >
              Cambiar Contraseña
            </button>
          )}
          {!isEditing && (
            <button onClick={handleEditClick} className={styles.button}>
              Modificar
            </button>
          )}

          {isEditing && (
            <button onClick={handleSave} className={styles.button}>
              Guardar
            </button>
          )}
        </section>
      </section>
    </main>
  );
}
