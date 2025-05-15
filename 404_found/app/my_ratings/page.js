"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './my_ratings.module.css';
import Image from "next/image";
import Link from "next/link";

export default function MyRatings() {
  const [user, setUser] = useState(null);
  const [myRatings, setMyRatings] = useState([]);
  const [editingRating, setEditingRating] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [editError, setEditError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (!token) {
      router.push('/login');
      return;
    }

    fetch("http://127.0.0.1:8000/api/users/profile/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => {
        console.error("Error al obtener el usuario:", err);
        router.push('/login');
      });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (!user || !token) return;

    fetch('http://127.0.0.1:8000/api/users/myRatings/', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        const ratings = data.results.map((rating) => ({
            id: rating.id,
            product: rating.auction_title,
            productId: rating.auction_id,
            value: rating.value,
            username: rating.user,
            price: rating.auction_price,
            state: rating.auction_state,
            category: rating.auction_category,
        }));
        setMyRatings(ratings);
      })
      .catch(error => console.error('Error al obtener las valoraciones:', error));
  }, [user]);

  const handleDelete = async (id, productId) => {
    const token = localStorage.getItem('access');
    try {
      await fetch(`http://127.0.0.1:8000/api/auctions/${productId}/ratings/${id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      setMyRatings(myRatings.filter(r => r.id !== id));
      alert('Valoración eliminada correctamente');
    } catch (error) {
      console.error('Error al eliminar la valoración:', error);
      alert('No se pudo eliminar la valoración.');
    }
  };

  const handleEdit = async (id, productId) => {
    const token = localStorage.getItem('access');
    setEditError('');
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/auctions/${productId}/ratings/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            value: parseFloat(editValue),
            auction: productId,
            user: user.username
        }),
      });

      if (response.ok) {
        setMyRatings(myRatings.map(r => r.id === id ? { ...r, value: parseFloat(editValue) } : r));
        setEditingRating(null);
        alert('Valoración actualizada correctamente');
      } else if (response.status === 400) {
        const errorData = await response.json();
        setEditError(errorData?.non_field_errors?.[0] || 'Error al editar');
        console.log(errorData);
      }
    } catch (error) {
      console.error('Error al editar la valoración:', error);
    }
  };

  return (
    <div className={styles.myRatingsContainer}>
      <div className={styles.header}>
        <h2 className={styles.title}>Mis Valoraciones</h2>
        <hr className={styles.line} />
      </div>
      {myRatings.length > 0 ? (
        <table className={styles.ratingTable}>
          <thead>
            <tr>
              <th>Subasta</th>
              <th>Precio</th>
              <th>Categoría</th>
              <th>Estado</th>
              <th>Puntuación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {myRatings.map((rating) => (
              <tr key={rating.id}>
                <td>
                  <Link href={`/details/${rating.productId}`}>
                  {rating.product}
                  </Link>
                </td>
                <td>{rating.price}</td>
                <td>{rating.category}</td>
                <td>{rating.state ? "abierta" : "cerrada"}</td>
                <td>
                  {editingRating === rating.id ? (
                    <>
                        <select value={editValue} onChange={(e) => setEditValue(e.target.value)} className={styles.selectRating}>
                        <option value="">Selecciona</option>
                        {[1, 2, 3, 4, 5].map(num => (
                            <option key={num} value={num}>{num}</option>
                        ))}
                        </select>
                        {editError && <div className={styles.error}>{editError}</div>}
                    </>
                  ) : (
                    rating.value
                  )}
                </td>
                <td>
                  {editingRating === rating.id ? (
                    <>
                      <button className={styles.saveButton} onClick={() => handleEdit(rating.id, rating.productId)}>Guardar</button>
                      <button
                        onClick={() => {
                          setEditingRating(null);
                          setEditValue('');
                          setEditError('');
                        }}
                        className={styles.cancelButton}
                      >
                        Descartar cambios
                      </button>
                    </>
                  ) : (
                    <button className={styles.editButton} onClick={() => {
                      setEditingRating(rating.id);
                      setEditValue(rating.value);
                    }}>
                      <Image
                        src="/images/pencil.webp"
                        alt="Editar"
                        width={20}
                        height={20}
                        priority
                      />
                    </button>
                  )}
                  <button className={styles.deleteButton} onClick={() => handleDelete(rating.id, rating.productId)}>
                    <Image
                      src="/images/basurita.png"
                      alt="Eliminar"
                      width={20}
                      height={20}
                      priority
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No has realizado ninguna valoración.</p>
      )}
    </div>
  );
}
