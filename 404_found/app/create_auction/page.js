"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./create_auction.module.css";

export default function CreateAuction() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    description: ""
  });
  const [validationErrors, setValidationErrors] = useState({});

  const categories = ["beauty", "fragrances", "groceries", "home", "toys", "sports", "automotive", "books", "health", "food"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const validateField = (fieldName, fieldValue) => {
    const errors = { ...validationErrors };

    if (!fieldValue.trim()) {
      errors[fieldName] = "Este campo es obligatorio";
    } else {
      delete errors[fieldName];
    }

    if (fieldName === "price" && isNaN(Number(fieldValue))) {
      errors.price = "El precio debe ser un número válido";
    }

    setValidationErrors(errors);
  };

  const validateFields = () => {
    const errors = {};
    categories.forEach((field) => {
      if (!formData[field].trim()) {
        errors[field] = "Este campo es obligatorio";
      }
    });

    if (isNaN(Number(formData.price))) {
      errors.price = "El precio debe ser un número válido";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateFields()) {
      console.log("Auction Data:", formData);
      // Aquí iría la lógica para enviar los datos al backend
    }
  };

  return (
    <main className={styles.mainContainer}>
      <section className={styles.container}>
        <h2 className={styles.h2}>Crear Subasta</h2>
        <form onSubmit={handleSubmit}>
          <fieldset className={styles.fieldset}>
            <label className={styles.label} htmlFor="name">Nombre del artículo *</label>
            <input
              id="name"
              name="name"
              className={styles.input}
              value={formData.name}
              onChange={handleChange}
              placeholder="Vintage Loewe Purse"
              type="text"
            />
            {validationErrors.name && <span className={styles.error}>{validationErrors.name}</span>}

            <label className={styles.label} htmlFor="price">Precio *</label>
            <input
              id="price"
              name="price"
              className={styles.input}
              value={formData.price}
              onChange={handleChange}
              placeholder="4500"
              type="text"
            />
            {validationErrors.price && <span className={styles.error}>{validationErrors.price}</span>}

            <label className={styles.label} htmlFor="category">Categoría *</label>
            <select
              id="category"
              name="category"
              className={styles.input}
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Selecciona una opción</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </select>
            {validationErrors.category && <span className={styles.error}>{validationErrors.category}</span>}

            <label className={styles.label} htmlFor="description">Descripción *</label>
            <textarea
              id="description"
              name="description"
              className={styles.textarea}
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe el artículo"
            ></textarea>
            {validationErrors.description && <span className={styles.error}>{validationErrors.description}</span>}

            <button className={styles.button} type="submit">Crear Subasta</button>
          </fieldset>
        </form>
      </section>
    </main>
  );
}