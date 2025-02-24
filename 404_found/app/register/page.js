"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "./register.module.css";

export default function Register() {
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

  const handleReturn = () => {
    router.push("/login");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateFields = () => {
    const errors = {};
    const requiredFields = ["name", "surname", "dni", "mail", "psw", "confirmationpsw"];

    requiredFields.forEach((field) => {
      if (!formData[field].trim()) {
        errors[field] = "This field is required";
      }
    });

    if (formData.psw && formData.psw.length < 8) {
      errors.psw = "Password must be at least 8 characters";
    }

    if (formData.psw !== formData.confirmationpsw) {
      errors.confirmationpsw = "Passwords do not match";
    }

    // Add more custom validations here

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    const handleSubmit = (event) => {
      event.preventDefault();

      if (validateFields()) {
        console.log("Form data:", formData);
        // Proceed with form submission
      }
    };

    form.addEventListener("submit", handleSubmit);

    return () => {
      form.removeEventListener("submit", handleSubmit);
    };
  }, [formData]);

  return (
    <main>
      <h2>Introduce tus datos para registrarte en el sistema</h2>
      <form ref={formRef}>
        <fieldset>
          <legend>Por favor, rellena los siguientes datos para registrarte en el sistema</legend>
          <br />
          <label htmlFor="name">Nombre *</label>
          <br />
          <input
            id="name"
            name="name"
            className={styles.input}
            value={formData.name}
            onChange={handleChange}
            placeholder="Pepito"
            type="text"
          />
          <br />
          {validationErrors.name && <span className={styles.hide_span}>{validationErrors.name}</span>}
          <br />

          <label htmlFor="surname">Apellido *</label>
          <br />
          <input
            id="surname"
            name="surname"
            className={styles.input}
            value={formData.surname}
            onChange={handleChange}
            placeholder="Pérez"
            type="text"
          />
          <br />
          {validationErrors.surname && <span className={styles.hide_span}>{validationErrors.surname}</span>}
          <br />

          <label htmlFor="dni">DNI *</label>
          <br />
          <input
            id="dni"
            name="dni"
            className={styles.input}
            value={formData.dni}
            onChange={handleChange}
            placeholder="54327401B"
            type="text"
          />
          <br />
          {validationErrors.dni && <span className={styles.hide_span}>{validationErrors.dni}</span>}
          <br />

          <label htmlFor="mail">Correo electrónico *</label>
          <br />
          <input
            id="mail"
            name="mail"
            className={styles.input}
            value={formData.mail}
            onChange={handleChange}
            placeholder="usuario@comillas.edu"
            type="email"
          />
          <br />
          {validationErrors.mail && <span className={styles.hide_span}>{validationErrors.mail}</span>}
          <br />

          <label htmlFor="telephone">Número de teléfono</label>
          <br />
          <input
            id="telephone"
            name="telephone"
            className={styles.input}
            value={formData.telephone}
            onChange={handleChange}
            placeholder="607 54 23 67"
            type="tel"
          />
          <br />
          <br />

          <label htmlFor="user">Usuario</label>
          <br />
          <input
            id="user"
            name="user"
            className={styles.input}
            value={formData.user}
            onChange={handleChange}
            placeholder="PepitoP"
            type="text"
          />
          <br />
          <br />

          <label htmlFor="birthday">Fecha de nacimiento</label>
          <br />
          <input
            id="birthday"
            name="birthday"
            className={styles.input}
            value={formData.birthday}
            onChange={handleChange}
            type="date"
          />
          <br />
          {validationErrors.birthday && <span className={styles.hide_span}>{validationErrors.birthday}</span>}
          <br />

          <label htmlFor="psw">Contraseña</label>
          <br />
          <input
            id="psw"
            name="psw"
            className={styles.input}
            value={formData.psw}
            onChange={handleChange}
            placeholder="Contraseña"
            type="password"
          />
          <br />
          {validationErrors.psw && <span className={styles.hide_span}>{validationErrors.psw}</span>}
          <br />

          <label htmlFor="confirmationpsw">Confirma la contraseña</label>
          <br />
          <input
            id="confirmationpsw"
            name="confirmationpsw"
            className={styles.input}
            value={formData.confirmationpsw}
            onChange={handleChange}
            placeholder="Confirmar contraseña"
            type="password"
          />
          <br />
          {validationErrors.confirmationpsw && <span className={styles.hide_span}>{validationErrors.confirmationpsw}</span>}
          <br />

          <label htmlFor="upimg">Carga una foto de tú DNI: </label>
          <input
            id="upimg"
            name="upimg"
            className={styles.input}
            type="file"
            onChange={handleChange}
          />
          <br />
          <br />

          <input type="submit" value="Registrar" />
          <input type="reset" value="Limpiar" />
          <input type="button" value="Inicio de Sesión" onClick={handleReturn} />
        </fieldset>
      </form>
    </main>
  );
}
