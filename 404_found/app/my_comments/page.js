"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './my_comments.module.css';
import Image from "next/image";

export default function MyComments() {
  const [user, setUser] = useState(null);
  const [myComments, setMyComments] = useState([]);
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

    fetch('http://127.0.0.1:8000/api/users/myComments/', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        const comments = data.results.map((comment) => ({
          id: comment.id,
          title: comment.title,
          text: comment.text,
          createdAt: new Date(comment.created_at).toLocaleString(),
          auctionId: comment.auction_id,
          auctionTitle: comment.auction_title, 
          price: comment.auction_price,
          category: comment.auction_category,
          state: comment.auction_state,
        }));
        setMyComments(comments);
      })
      .catch(error => console.error('Error al obtener los comentarios:', error));
  }, [user]);

  const handleDelete = async (id, auctionId) => {
    const token = localStorage.getItem('access');
    try {
      await fetch(`http://127.0.0.1:8000/api/auctions/${auctionId}/comments/${id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      setMyComments(myComments.filter(c => c.id !== id));
      alert('Comentario eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar el comentario:', error);
      alert('No se pudo eliminar el comentario.');
    }
  };

  return (
    <div className={styles.myCommentsContainer}>
      <div className={styles.header}>
        <h2 className={styles.title}>Mis Comentarios</h2>
        <hr className={styles.line} />
      </div>
      {myComments.length > 0 ? (
        <table className={styles.commentTable}>
          <thead>
            <tr>
              <th>Título</th>
              <th>Texto</th>
              <th>Subasta</th>
              <th>Precio</th>
              <th>Categoría</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {myComments.map((comment) => (
              <tr key={comment.id}>
                <td>{comment.title}</td>
                <td>{comment.text}</td>
                <td
                  onClick={() => router.push(`/details/${comment.auctionId}`)}
                  className={styles.link}
                >
                  {comment.auctionTitle}
                </td>
                <td>{comment.price}</td>
                <td>{comment.category}</td>
                <td>{comment.state ? "abierta" : "cerrada"}</td>
                <td>{comment.createdAt}</td>
                <td>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDelete(comment.id, comment.auctionId)}
                  >
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
        <p>No has escrito ningún comentario.</p>
      )}
    </div>
  );
}
