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
    auctioneer: "",
  });
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [categories, setCategories] = useState([]);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setValidationErrors((prev) => ({ ...prev, [name]: "" }));
  };  
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("access");
  
    const form = new FormData();
    form.append("title", formData.name);
    form.append("price", formData.price);
    form.append("description", formData.description);
    form.append("rating", 1);  
    form.append("stock", formData.stock);
    form.append("brand", formData.brand);
    form.append("category", formData.category);
    form.append("image", formData.photo_link);  
    form.append("closing_date", formData.closing_date);
    form.append("auctioneer", userData.id);
  
    try {
      const response = await fetch("http://127.0.0.1:8000/api/auctions/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: form,
      });

      if (!response.ok) {
        if (response.status === 400) {
          const errorData = await response.json();
          setValidationErrors(errorData);
          console.log("error");
          console.log(errorData);
        } else {
          throw new Error("Error al crear la subasta");
        }
        return;
      }

      router.push("/my_auctions");
    } catch (error) {
      console.error("Error al crear subasta:", error);
      setError("Hubo un problema al enviar la subasta.");
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
    setValidationErrors({});
    window.scrollTo(0, 0);
  };

  function returnButton() {
    router.push("/my_auctions");
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      photo_link: file, 
    }));
  };
  

  return (
    <main className={styles.mainContainer}>
      <section className={styles.container}>
        <h2 className={styles.h2}>Crear Subasta</h2>
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
              placeholder="Vintage Loewe Purse"
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

            <label className={styles.label} htmlFor="photo_link">Seleccionar foto *</label>
            <input
              id="photo_link"
              name="photo_link"
              className={styles.input}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
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
              placeholder="Selecciona una fecha"
            ></input>
            {validationErrors.closing_date && <span className={styles.error}>{validationErrors.closing_date}</span>}

            <div className={styles.buttonContainer}>
              <button className={styles.button} type="submit">Crear Subasta</button>
              <button className={styles.button} type="button" onClick={handleReset}>Limpiar campos</button>
              <button className={styles.button} type="button" onClick={returnButton}>Volver</button>
            </div>
          </fieldset>
        </form>
      </section>
    </main>
  );
}
