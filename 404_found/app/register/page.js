"use client";
import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "./register.module.css";

export default function Register() {
  // Define states
  const router = useRouter();
  const formRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    dni: "",
    mail: "",
    telephone: "",
    user: "",
    birthday: "",
    direction: "",
    comunity: "",
    city: "",
    payment: "",
    psw: "",
    confirmationpsw: "",
    upimg: null
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [citiesOptions, setCitiesOptions] = useState([]);

  // Comunities and Cities
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

  // Go to LogIn page
  const handleReturnLogin = () => {
    router.push("/login");
  };

  // Change the data when it is put into the input
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevState) => {
      if (name === "comunity") {
        const selectedCityOptions = comunitiesCities[value] || [];
        setCitiesOptions(selectedCityOptions);  
        return { ...prevState, [name]: value, city: "" };  
      }
      return { ...prevState, [name]: value };  
    });

    // Validar el campo al cambiarlo
    validateField(name, value);
  };

  // Reset fields
  const handleReset = () => {
    setFormData({
      name: "",
      surname: "",
      dni: "",
      mail: "",
      telephone: "",
      user: "",
      birthday: "",
      direction: "",
      comunity: "",
      city: "",
      payment: "",
      psw: "",
      confirmationpsw: "",
      upimg: null
    });
    setValidationErrors({});
  };

  // Validate a single field
  const validateField = (fieldName, fieldValue) => {
    const errors = { ...validationErrors };

    const requiredFields = ["name", "surname", "dni", "mail", "psw", "confirmationpsw"];
    if (requiredFields.includes(fieldName)) {
      if (!fieldValue.trim()) {
        errors[fieldName] = "Este campo es obligatorio";
      } else {
        delete errors[fieldName]; 
      }
    }

    // Name
    if (fieldName === "name" || fieldName === "surname") {
      const namePattern = /^[a-zA-Z]+$/;
      if (fieldValue && !namePattern.test(fieldValue.trim())) {
        errors[fieldName] = `${fieldName === 'name' ? 'El nombre' : 'El apellido'} solo puede contener letras`;
      } else {
        delete errors[fieldName];
      }
    }

    // DNI
    if (fieldName === "dni") {
      const dniPattern = /^([0-9]{8})([A-Z]{1})$/;
      if (fieldValue && !dniPattern.test(fieldValue.trim())) {
        errors.dni = "El DNI no es válido";
      } else {
        delete errors.dni;
      }
    }

    // Mail
    if (fieldName === "mail") {
      const mailPattern = /^[a-zA-Z0-9._%+-]+@comillas.edu$/;
      if (fieldValue && !mailPattern.test(fieldValue.trim())) {
        errors.mail = "El correo electrónico debe ser de la forma 'usuario@comillas.edu'";
      } else {
        delete errors.mail;
      }
    }

    // Pwd
    if (fieldName === "psw") {
      if (fieldValue && fieldValue.length < 8) {
        errors.psw = "La contraseña debe tener al menos 8 caracteres";
      } else {
        delete errors.psw;
      }
    }

    // Confimation psw
    if (fieldName === "confirmationpsw") {
      if (fieldValue && fieldValue !== formData.psw) {
        errors.confirmationpsw = "Las contraseñas no coinciden";
      } else {
        delete errors.confirmationpsw;
      }
    }

    // Update state
    setValidationErrors(errors);
  };

  // Validate all fields on submit
  const validateFields = () => {
    const errors = {};
    const requiredFields = ["name", "surname", "dni", "mail", "psw", "confirmationpsw"];

    requiredFields.forEach((field) => {
      if (!formData[field].trim()) {
        errors[field] = "Este campo es obligatorio";
      }
    });

    // Validate name and surname
    const namePattern = /^[a-zA-Z]+$/;
    if (formData.name && !namePattern.test(formData.name.trim())) {
      errors.name = "El nombre solo puede contener letras";
    }
    if (formData.surname && !namePattern.test(formData.surname.trim())) {
      errors.surname = "El apellido solo puede contener letras";
    }

    // Validate DNI
    const dniPattern = /^([0-9]{8})([A-Z]{1})$/;
    if (formData.dni && !dniPattern.test(formData.dni.trim())) {
      errors.dni = "El DNI no es válido";
    }

    // Validate email
    const mailPattern = /^[a-zA-Z0-9._%+-]+@comillas.edu$/;
    if (formData.mail && !mailPattern.test(formData.mail.trim())) {
      errors.mail = "El correo electrónico debe ser de la forma 'usuario@comillas.edu'";
    }

    // Validate password
    if (formData.psw && formData.psw.length < 8) {
      errors.psw = "La contraseña debe tener al menos 8 caracteres";
    }

    // Validate confirmation password
    if (formData.psw !== formData.confirmationpsw) {
      errors.confirmationpsw = "Las contraseñas no coinciden";
    }

    // Validate birthday
    if (formData.birthday) {
      const date = new Date(formData.birthday);
      const today = new Date();
      const age = today.getFullYear() - date.getFullYear();
      const monthDifference = today.getMonth() - date.getMonth();
      const dayDifference = today.getDate() - date.getDate();
      if (age < 18 || (age === 18 && (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)))) {
        errors.birthday = "Debes ser mayor de 18 años";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Register with POST
  const register = async (formData) => {
    try {
      const postData = {
        username: formData.user,
        email: formData.mail,
        password: formData.psw,
        first_name: formData.name,
        last_name: formData.surname,
        birth_date: formData.birthday,
        locality: formData.comunity,
        municipality: formData.city
      };
  
      const response = await fetch("http://127.0.0.1:8000/api/users/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(postData)
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log("Usuario registrado:", data);
        router.push("/login");
      } else {
        const backendErrors = { ...validationErrors };

        for (const key in data) {
          const field = key === "username" ? "user" :
                        key === "first_name" ? "name" :
                        key === "last_name" ? "surname" :
                        key === "email" ? "mail" :
                        key; // para otros campos que coincidan

          if (Array.isArray(data[key])) {
            backendErrors[field] = data[key][0];
          } else {
            backendErrors[field] = data[key];
          }
        }

        setValidationErrors(backendErrors);
      }      
    } catch (error) {
      console.log("Error de conexión:", error);
      setValidationErrors({ apiError: "Hubo un problema al intentar conectar con el servidor." });
    }
  };
  

  // Submit form
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateFields()) {
      console.log("Form data:", formData);
      await register(formData);
    }
  };

  return (
    <main className={`${styles.mainContainer}`}>
      <section className={`${styles.container}`}>
        <h2 className={`${styles.h2}`}>Registro</h2>
        <form ref={formRef} onSubmit={handleSubmit}>
          <fieldset className={`${styles.fieldset}`}>
            <p className={`${styles.legend}`}>
              Por favor, rellena los siguientes datos para registrarte en el sistema
            </p>

            <label className={`${styles.label}`} htmlFor="name">Nombre *</label>
            {validationErrors.name && <span className={styles.hide_span}>{validationErrors.name}</span>}
            {validationErrors.name && <span className={styles.hide_span}>{validationErrors.name}</span>}
            <input
              id="name"
              name="name"
              className={styles.input}
              value={formData.name}
              onChange={handleChange}
              placeholder="Pepito"
              type="text"
            />

            <label className={`${styles.label}`} htmlFor="surname">Apellido *</label>
            {validationErrors.surname && <span className={styles.hide_span}>{validationErrors.surname}</span>}

            <input
              id="surname"
              name="surname"
              className={styles.input}
              value={formData.surname}
              onChange={handleChange}
              placeholder="Pérez"
              type="text"
            />

            <label className={`${styles.label}`} htmlFor="dni">DNI *</label>
            {validationErrors.dni && <span className={styles.hide_span}>{validationErrors.dni}</span>}
            <input
              id="dni"
              name="dni"
              className={styles.input}
              value={formData.dni}
              onChange={handleChange}
              placeholder="12345678A"
              type="text"
            />

            <label className={`${styles.label}`} htmlFor="mail">Correo electrónico (Comillas) *</label>
            {validationErrors.mail && <span className={styles.hide_span}>{validationErrors.mail}</span>}
            <input
              id="mail"
              name="mail"
              className={styles.input}
              value={formData.mail}
              onChange={handleChange}
              placeholder="pepito@comillas.edu"
              type="email"
            />

            <label className={`${styles.label}`} htmlFor="telephone">Teléfono</label>
            <input
              id="telephone"
              name="telephone"
              className={styles.input}
              value={formData.telephone}
              onChange={handleChange}
              placeholder="617861234"
              type="text"
            />

            <label className={`${styles.label}`} htmlFor="user">Nombre de usuario *</label>
            {validationErrors.user && <span className={styles.hide_span}>{validationErrors.user}</span>}
            <input
              id="user"
              name="user"
              className={styles.input}
              value={formData.user}
              onChange={handleChange}
              placeholder="pepito123"
              type="text"
            />

            <label className={`${styles.label}`} htmlFor="birthday">Fecha de nacimiento *</label>
            {validationErrors.birthday && <span className={styles.hide_span}>{validationErrors.birthday}</span>}
            <input
              id="birthday"
              name="birthday"
              className={styles.input}
              value={formData.birthday}
              onChange={handleChange}
              placeholder="dd/mm/yyyy"
              type="date"
            />

            <label className={`${styles.label}`} htmlFor="comunity">Comunidad Autónoma *</label>
            <select
              id="comunity"
              name="comunity"
              className={styles.input}
              value={formData.comunity}
              onChange={handleChange}
            >
              <option value="">Selecciona una opción</option>
              {Object.keys(comunitiesCities).map((comunity, index) => (
                <option key={index} value={comunity}>{comunity}</option>
              ))}
            </select>

            <label className={`${styles.label}`} htmlFor="city">Ciudad *</label>
            <select
              id="city"
              name="city"
              className={styles.input}
              value={formData.city}
              onChange={handleChange}
              disabled={!formData.comunity}
            >
              <option value="">Selecciona una opción</option>
              {citiesOptions.map((city, index) => (
                <option key={index} value={city}>{city}</option>
              ))}
            </select>

            <label className={`${styles.label}`} htmlFor="payment">Método de pago</label>
            <select
              id="payment"
              name="payment"
              className={styles.input}
              value={formData.payment}
              onChange={handleChange}
            >
              <option value="">Selecciona una opción</option>
              <option value="tarjeta">Tarjeta</option>
              <option value="paypal">PayPal</option>
            </select>

            <label className={`${styles.label}`} htmlFor="psw">Contraseña *</label>
            {validationErrors.psw && <span className={styles.hide_span}>{validationErrors.psw}</span>}
            <input
              id="psw"
              name="psw"
              className={styles.input}
              value={formData.psw}
              onChange={handleChange}
              placeholder="Contraseña"
              type="password"
            />

            <label className={`${styles.label}`} htmlFor="confirmationpsw">Confirmar contraseña *</label>
            {validationErrors.confirmationpsw && <span className={styles.hide_span}>{validationErrors.confirmationpsw}</span>}
            <input
              id="confirmationpsw"
              name="confirmationpsw"
              className={styles.input}
              value={formData.confirmationpsw}
              onChange={handleChange}
              placeholder="Confirmar contraseña"
              type="password"
            />

            <label className={`${styles.label}`} htmlFor="upimg">Carga una foto de tu DNI: </label>
            <input
              id="upimg"
              name="upimg"
              className={styles.input}
              type="file"
              onChange={handleChange}
            />
            {validationErrors.apiError && <div className={styles.hide_span}>{validationErrors.apiError}</div>}

            <div className={styles.buttonsContainer}>
              <button className={styles.button} type="submit">Registrarse</button>
              <button className={styles.button} type="button" onClick={handleReset}>Limpiar</button>
              <button className={styles.button} type="button" onClick={handleReturnLogin}>Ir a Inicio Sesión</button>
            </div>
          </fieldset>
        </form>
      </section>
    </main>
  );
}
