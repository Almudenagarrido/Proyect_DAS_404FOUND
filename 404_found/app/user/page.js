"use client";
import React, { useState, useEffect } from "react";
import styles from "./user.module.css";
import { useRouter } from "next/navigation";

export default function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [isPasswordChange, setIsPasswordChange] = useState(false);
  const [availableCities, setAvailableCities] = useState([]);

  const router = useRouter();

  const comunitiesCities = {
    "Andalucia": ["Sevilla", "Málaga", "Granada", "Córdoba", "Jaén", "Huelva", "Almería", "Linares", "Cádiz"],
    "Aragon": ["Zaragoza", "Huesca", "Teruel"],
    "Cataluña": ["Barcelona", "Girona", "Lleida", "Tarragona"],
    "Madrid": ["Madrid"],
    "Valencia": ["Alicante", "Valencia", "Castellón"],
    "Galicia": ["Vigo", "Santiago de Compostela", "A Coruña", "Ourense"],
    "CastillaLaMancha": [],
    "CastillaYLeon": ["Ávila", "Segovia", "Salamanca", "Valladolid", "León", "Palencia", "Burgos"],
    "Extremadura": ["Badajoz", "Cáceres"],
    "Murcia": ["Murcia", "Cartagena"],
    "Navarra": ["Pamplona"],
    "PaisVasco": ["Bilbao", "Vitoria-Gasteiz", "San Sebastián"],
    "Cantabria": [],
    "La Rioja": ["Logroño"],
    "Islas Canarias": ["Las Palmas de Gran Canaria", "Santa Cruz de Tenerife"],
    "Islas Baleares": ["Palma de Mallorca"],
    "Ceuta": ["Ceuta"],
    "Melilla": ["Melilla"]
  };

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
          if (data.locality) {
            setAvailableCities(comunitiesCities[data.locality] || []);
          }
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
    const { name, value } = e.target;
    setValidationErrors({ ...validationErrors, [name]: "" });

    if (name === "locality") {
      setAvailableCities(comunitiesCities[value] || []);
      setEditedData({ ...editedData, locality: value, municipality: "" });
    } else {
      setEditedData({ ...editedData, [name]: value });
    }
  };

  const validateFields = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!editedData.username?.trim()) {
      errors.username = "El nombre de usuario es obligatorio.";
    }

    if (!editedData.email || !emailRegex.test(editedData.email)) {
      errors.email = "El correo electrónico no es válido.";
    }

    if (isPasswordChange) {
      if (!editedData.password || editedData.password.length < 8) {
        errors.password = "La contraseña debe tener al menos 8 caracteres.";
      }
      if (editedData.password !== editedData.password_confirm) {
        errors.password_confirm = "Las contraseñas no coinciden.";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setValidationErrors({});
    setError("");
  };  

  const handleSave = async () => {
    if (!validateFields()) return;

    const token = localStorage.getItem("access");

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/users/${userData.id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(editedData)
      });

      const data = await response.json();

      if (response.ok) {
        setUserData(data);
        setIsEditing(false);
        setIsPasswordChange(false);
        setValidationErrors({});
      } else {
        const backendErrors = {};
        for (const key in data) {
          if (Array.isArray(data[key])) {
            backendErrors[key] = data[key][0];
          } else {
            backendErrors[key] = data[key];
          }
        }
        setValidationErrors((prev) => ({ ...prev, ...backendErrors }));
      }
    } catch (error) {
      setError("Hubo un problema al intentar conectar con el servidor.");
      console.error("Error de conexión:", error);
    }
  };

  if (error) return <div>{error}</div>;
  if (!userData) return <div>Cargando...</div>;

  return (
    <main className={styles.mainContainer}>
      <section className={styles.container}>
        <h2 className={styles.h2}>Mi Perfil</h2>
        <section className={styles.profileContainer}>
          {[
            { label: "Usuario", name: "username", type: "text" },
            { label: "Email", name: "email", type: "email" },
            { label: "Nombre", name: "first_name", type: "text" },
            { label: "Apellido", name: "last_name", type: "text" },
            { label: "Fecha nacimiento", name: "birth_date", type: "date" }
          ].map(({ label, name, type }) => (
            <section key={name} className={styles.profileItem}>
              <p className={styles.p}>{label}:</p>
              {isEditing ? (
                <>
                  <input
                    type={type}
                    name={name}
                    value={editedData[name] || ""}
                    onChange={handleChange}
                    className={styles.input}
                  />
                  {validationErrors[name] && <span className={styles.error}>{validationErrors[name]}</span>}
                </>
              ) : (
                <span>{name === "birth_date" ? new Date(userData[name]).toLocaleDateString() : userData[name]}</span>
              )}
            </section>
          ))}

          <section className={styles.profileItem}>
            <p className={styles.p}>Comunidad:</p>
            {isEditing ? (
              <select name="locality" value={editedData.locality || ""} onChange={handleChange} className={styles.input}>
                <option value="">Selecciona una comunidad</option>
                {Object.keys(comunitiesCities).map((comunidad) => (
                  <option key={comunidad} value={comunidad}>{comunidad}</option>
                ))}
              </select>
            ) : (
              <span>{userData.locality}</span>
            )}
          </section>

          <section className={styles.profileItem}>
            <p className={styles.p}>Municipio:</p>
            {isEditing ? (
              <select name="municipality" value={editedData.municipality || ""} onChange={handleChange} className={styles.input}>
                <option value="">Selecciona un municipio</option>
                {availableCities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            ) : (
              <span>{userData.municipality}</span>
            )}
          </section>

          {isPasswordChange && isEditing && (
            <>
              <section className={styles.profileItem}>
                <p className={styles.p}>Nueva Contraseña:</p>
                <input type="password" name="password" value={editedData.password || ""} onChange={handleChange} className={styles.input} />
                {validationErrors.password && <span className={styles.error}>{validationErrors.password}</span>}
              </section>

              <section className={styles.profileItem}>
                <p className={styles.p}>Confirmar Contraseña:</p>
                <input type="password" name="password_confirm" value={editedData.password_confirm || ""} onChange={handleChange} className={styles.input} />
                {validationErrors.password_confirm && <span className={styles.error}>{validationErrors.password_confirm}</span>}
              </section>
            </>
          )}

          {isEditing && !isPasswordChange && (
            <button onClick={() => setIsPasswordChange(true)} className={styles.button}>Cambiar Contraseña</button>
          )}
          {!isEditing && (
            <button onClick={handleEditClick} className={styles.button}>Modificar</button>
          )}
          {isEditing && (
            <button onClick={handleSave} className={styles.button}>Guardar</button>
          )}
        </section>
      </section>
    </main>
  );
}
