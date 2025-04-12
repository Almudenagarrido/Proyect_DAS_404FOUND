"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./create_auction.module.css";

export default function CreateAuction() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    rating: "",
    stock: "",
    brand: "",
    photo_link: "",
    category: "",
    closing_date: "",
  });
  const [validationErrors, setValidationErrors] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
      fetch("http://127.0.0.1:8000/api/auctions/categories/")  
        .then((response) => {
          return response.json(); 
        })
        .then((data) => {
          setCategories(data.results);
        })
        .catch((error) => {
          console.error("Error al cargar las categorías:", error); 
        });
    }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const validateField = (fieldName, fieldValue) => {
    const errors = { ...validationErrors };

    if (!fieldValue.trim() && fieldName !== "rating") {
      errors[fieldName] = "Este campo es obligatorio";
    } else {
      delete errors[fieldName];
    }

    if (fieldName === "price" && isNaN(Number(fieldValue))) {
      errors.price = "El precio debe ser un número válido";
    }

    if (fieldName === "rating" && isNaN(fieldValue)) {
      errors.rating = "La puntuación debe estar entre 0 y 5";
    }

    setValidationErrors(errors);
  };

  const validateFields = () => {
    const errors = {};

    Object.keys(formData).forEach((field) => {
        const fieldValue = formData[field];

        if (typeof fieldValue === "string" && !fieldValue.trim()) {
            errors[field] = "Este campo es obligatorio";
        }
        else if (field === "price" && isNaN(Number(fieldValue))) {
            errors.price = "El precio debe ser un número válido";
        }
        else if (field === "rating" && (fieldValue < 0 || fieldValue > 5)) {
            errors.rating = "La puntuación debe estar entre 0 y 5";
        }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateFields()) {
      console.log("Auction Data:", formData);
  
      const response = await fetch("http://127.0.0.1:8000/api/auctions/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: formData.name,
          price: parseFloat(formData.price),
          description: formData.description,
          rating: formData.rating,
          stock: formData.stock,
          brand: formData.brand,
          category: formData.category,
          thumbnail: formData.photo_link,
          closing_date: formData.closing_date,
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Error al crear la subasta");
      }
  
      console.log("Subasta creada con éxito");
      router.push("/my_auctions");
    }
  };
  

  const handleReset = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      rating: "",
      stock: "",
      brand: "",
      photo_link: "",
      category: "",
      closing_date: "",
    });
    setValidationErrors([]);
    window.scrollTo(0, 0);
  };

  function returnButton () {
    router.push("/my_auctions"); 
  }

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

            <label className={styles.label} htmlFor="rating">Puntuación *</label>
            <div className={styles.ratingContainer}>
              <span>0 </span>
              <input
                id="rating"
                name="rating"
                className={styles.ratingInput}
                type="range"
                min="0"
                max="5"
                step="1"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
              />
              <span> 5</span>
            </div>
            <span className={styles.ratingValue}>Valor: {formData.rating}</span>
            {validationErrors.rating && <span className={styles.error}>{validationErrors.rating}</span>}

            <label className={styles.label} htmlFor="stock">Cantidad *</label>
            <input
              id="stock"
              name="stock"
              className={styles.input}
              value={formData.stock}
              onChange={handleChange}
              placeholder="Número de unidades a subastar"
            ></input>
            {validationErrors.stock && <span className={styles.error}>{validationErrors.stock}</span>}

            <label className={styles.label} htmlFor="brand">Marca *</label>
            <input
              id="brand"
              name="brand"
              className={styles.input}
              value={formData.brand}
              onChange={handleChange}
              placeholder="Marca del artículo"
            ></input>
            {validationErrors.brand && <span className={styles.error}>{validationErrors.brand}</span>}

            <label className={styles.label} htmlFor="photo_link">Link foto *</label>
            <input
              id="photo_link"
              name="photo_link"
              className={styles.input}
              value={formData.photo_link}
              onChange={handleChange}
              placeholder=""
            ></input>
            {validationErrors.photo_link && <span className={styles.error}>{validationErrors.photo_link}</span>}

            <label className={styles.label} htmlFor="category">Categoría *</label>
            <select
              id="category"
              name="category"
              className={styles.input}
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })} 
            >
              <option value="">Selecciona una opción</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            {validationErrors.category && <span className={styles.error}>{validationErrors.category}</span>}

            <label className={styles.label} htmlFor="closing_date">Fecha de cierre *</label>
            <input
              id="closing_date"
              name="closing_date"
              className={styles.input}
              type="date" 
              value={formData.closing_date}
              onChange={handleChange}
              placeholder="Selecciona una fecha"
            ></input>
            {validationErrors.closing_date && <span className={styles.error}>{validationErrors.closing_date}</span>}

            <div className={styles.buttonContainer}>
              <button className={styles.button} type="submit">Crear Subasta</button>
              <button className={styles.button} type="button" onClick={() => handleReset()}>Limpiar campos</button>
              <button className={styles.button} type="button" onClick={() => returnButton()}>Volver</button>
            </div>

          </fieldset>
        </form>
      </section>
    </main>
  );
}