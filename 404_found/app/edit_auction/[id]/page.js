"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "./edit_auction.module.css";

export default function EditAuction() {
  const { id } = useParams();
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
  const [validationErrors, setValidationErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");

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

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/auctions/categories/")
      .then((response) => response.json())
      .then((data) => {
        setCategories(data.results);
      })
      .catch((error) => {
        console.error("Error al cargar las categorías:", error);
      });
  }, []);

  useEffect(() => {
    if (id) {
      const token = localStorage.getItem("access");

      fetch(`http://127.0.0.1:8000/api/auctions/${id}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      })
        .then((response) => {
          if (!response.ok) throw new Error("No autorizado o error en la solicitud.");
          return response.json();
        })
        .then((data) => {
          setFormData({
            name: data.title,
            description: data.description,
            price: data.price,
            rating: data.rating,
            stock: data.stock,
            brand: data.brand,
            photo_link: data.thumbnail,
            category: data.category,
            closing_date: data.closing_date,
          });
        })
        .catch((error) => {
          console.error("Error al cargar los datos de la subasta:", error);
        });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setValidationErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateFields = () => {
    const errors = {};

    Object.keys(formData).forEach((field) => {
      const value = formData[field];

      if (typeof value === "string" && !value.trim()) {
        errors[field] = "Este campo es obligatorio";
      } else if (field === "price" && isNaN(Number(value))) {
        errors.price = "El precio debe ser un número válido";
      } else if (field === "rating" && (value < 0 || value > 5)) {
        errors.rating = "La puntuación debe estar entre 0 y 5";
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateFields()) return;

    try {
      const token = localStorage.getItem("access");

      const response = await fetch(`http://127.0.0.1:8000/api/auctions/${id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          title: formData.name,
          price: parseFloat(formData.price),
          description: formData.description,
          rating: parseFloat(formData.rating),
          stock: parseInt(formData.stock),
          brand: formData.brand,
          category: formData.category,
          thumbnail: formData.photo_link,
          closing_date: formData.closing_date,
          auctioneer: userData.id
        })
      });

      if (!response.ok) {
        if (response.status === 400) {
          const errorData = await response.json();
          setValidationErrors(errorData);
        } else {
          throw new Error("Error al editar la subasta");
        }
        return;
      }

      router.push(`/details/${id}`);
    } catch (err) {
      console.error("Error al actualizar:", err);
      setError("Hubo un error al intentar actualizar la subasta.");
    }
  };

  const discardChanges = () => {
    router.push("/my_auctions");
  };

  return (
    <main className={styles.mainContainer}>
      <section className={styles.container}>
        <h2 className={styles.h2}>Editar Subasta</h2>
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <fieldset className={styles.fieldset}>
            <label className={styles.label} htmlFor="name">Nombre del artículo *</label>
            <input
              id="name"
              name="name"
              className={styles.input}
              value={formData.name}
              onChange={handleChange}
              type="text"
            />
            {validationErrors.title && <span className={styles.error}>{validationErrors.title}</span>}

            <label className={styles.label} htmlFor="description">Descripción *</label>
            <textarea
              id="description"
              name="description"
              className={styles.textarea}
              value={formData.description}
              onChange={handleChange}
            ></textarea>
            {validationErrors.description && <span className={styles.error}>{validationErrors.description}</span>}

            <label className={styles.label} htmlFor="price">Precio *</label>
            <input
              id="price"
              name="price"
              className={styles.input}
              value={formData.price}
              onChange={handleChange}
              type="text"
            />
            {validationErrors.price && <span className={styles.error}>{validationErrors.price}</span>}

            <label className={styles.label} htmlFor="rating">Puntuación *</label>
            <div className={styles.ratingContainer}>
              <span>0</span>
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
              <span>5</span>
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
            />
            {validationErrors.stock && <span className={styles.error}>{validationErrors.stock}</span>}

            <label className={styles.label} htmlFor="brand">Marca *</label>
            <input
              id="brand"
              name="brand"
              className={styles.input}
              value={formData.brand}
              onChange={handleChange}
            />
            {validationErrors.brand && <span className={styles.error}>{validationErrors.brand}</span>}

            <label className={styles.label} htmlFor="photo_link">Link foto *</label>
            <input
              id="photo_link"
              name="photo_link"
              className={styles.input}
              value={formData.photo_link}
              onChange={handleChange}
            />
            {validationErrors.thumbnail && <span className={styles.error}>{validationErrors.thumbnail}</span>}

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
            />
            {validationErrors.closing_date && <span className={styles.error}>{validationErrors.closing_date}</span>}

            <div className={styles.buttonContainer}>
              <button className={styles.button} type="submit">Guardar Cambios</button>
              <button className={styles.button} type="button" onClick={discardChanges}>Descartar cambios</button>
            </div>
          </fieldset>
        </form>
      </section>
    </main>
  );
}
