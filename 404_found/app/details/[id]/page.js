
"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import styles from './details.module.css';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [username, setUsername] = useState('');
  const [bids, setBids] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [userRating, setUserRating] = useState(0);
  const [categoryName, setCategoryName] = useState('');
  const [newBid, setNewBid] = useState('');
  const router = useRouter();
  const [auctioneerName, setAuctioneerName] = useState('');
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, [router]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!id) return;
      const token = localStorage.getItem("access");

      try {
        const productResponse = await fetch(`http://127.0.0.1:8000/api/auctions/${id}/`);
        if (!productResponse.ok) throw new Error("Error al obtener el producto");
        const productData = await productResponse.json();
        setProduct(productData);

        if (token && productData.auctioneer) {
          const auctioneerResponse = await fetch(`http://127.0.0.1:8000/api/users/${productData.auctioneer}/`, {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          });
          if (!auctioneerResponse.ok) throw new Error("Error al obtener el subastador");
          const auctioneerData = await auctioneerResponse.json();
          setAuctioneerName(auctioneerData.username);
        } else {
          setAuctioneerName("Solo para usuarios");
        }

        if (productData.category) {
          const categoryResponse = await fetch(`http://127.0.0.1:8000/api/auctions/category/${productData.category}/`);
          if (!categoryResponse.ok) throw new Error("Error al obtener la categoría");
          const categoryData = await categoryResponse.json();
          setCategoryName(categoryData.name);
        }

        const bidsResponse = await fetch(`http://127.0.0.1:8000/api/auctions/${id}/bids/`);
        if (!bidsResponse.ok) throw new Error("Error al obtener las pujas");
        const bidsData = await bidsResponse.json();
        const sortedBids = bidsData.results.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        setBids(sortedBids);

        const ratingsResponse = await fetch(`http://127.0.0.1:8000/api/ratings/`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        if (!ratingsResponse.ok) throw new Error("Error al obtener las valoraciones");
        const ratingsDataResponse = await ratingsResponse.json();
        const filteredRatings = ratingsDataResponse.results.filter(rating => String(rating.auction) === String(id));
        setRatings(filteredRatings);

        const userVal = filteredRatings.find(r => r.rating_username === username);
        if (userVal) setUserRating(userVal.value);

        const commentsResponse = await fetch(`http://127.0.0.1:8000/api/auctions/${id}/comments/`);
        if (!commentsResponse.ok) throw new Error("Error al obtener los comentarios");
        const commentsData = await commentsResponse.json();
        setComments(commentsData.results);

      } catch (error) {
        console.error("Error al cargar detalles:", error);
      }
    };

    fetchProductDetails();
  }, [id]);

  async function handleBidSubmit() {
    if (newBid) {
      const bidData = {
        bidder: username,
        price: parseFloat(newBid),
        auction: id
      };

      try {
        const token = localStorage.getItem('access');
        const response = await fetch(`http://127.0.0.1:8000/api/auctions/${id}/bids/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(bidData),
        });

        if (response.ok) {
          const result = await response.json();
          alert(`Puja de ${newBid} realizada correctamente por ${username}`);
          setBids((prevBids) => [result, ...prevBids]);
          setNewBid('');
        } else {
          const error = await response.json();
          const message = Array.isArray(error.detail) ? error.detail[0] : error.detail || 'Error desconocido';
          alert(`Error al realizar la puja: ${message}`);
        }
      } catch (error) {
        console.error('Error al enviar la puja:', error);
        alert('Hubo un problema al enviar la puja.');
      }
    } else {
      alert('Por favor, ingrese una cantidad para pujar.');
    }
  }

  async function handleRatingSubmit() {
    if (userRating < 1 || userRating > 5) {
      alert('Selecciona una puntuación válida entre 1 y 5.');
      return;
    }

    const token = localStorage.getItem('access');
    try {
      const existingRating = ratings.find(r => r.rating_username === username);
      const ratingData = {
        value: userRating,
        auction: id,
        user: username,
      };

      const method = existingRating ? 'PUT' : 'POST';
      const url = existingRating
        ? `http://127.0.0.1:8000/api/ratings/${existingRating.id}/`
        : `http://127.0.0.1:8000/api/ratings/`;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(ratingData),
      });

      if (response.ok) {
        const refreshed = await fetch(`http://127.0.0.1:8000/api/ratings/`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        const newData = await refreshed.json();
        setRatings(newData.results);
        alert("Valoración guardada correctamente.");
      } else {
        const error = await response.json();
        alert(`Error al valorar: ${JSON.stringify(error)}`);
      }
    } catch (err) {
      console.error('Error al enviar la valoración:', err);
      alert('Hubo un problema al enviar la valoración.');
    }
  }

  async function handleRatingDelete() {
    const token = localStorage.getItem('access');
    const existingRating = ratings.find(r => r.rating_username === username);
    if (!existingRating) return alert("No tienes valoración para eliminar.");

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/ratings/${existingRating.id}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        alert("Valoración eliminada.");
        const refreshed = await fetch(`http://127.0.0.1:8000/api/ratings/`, {
          headers: { "Authorization": `Bearer ${token}` },
        });
        const newData = await refreshed.json();
        setRatings(newData.results);
        setUserRating(0);
      } else {
        alert("Error al eliminar valoración.");
      }
    } catch (err) {
      console.error("Error al eliminar valoración:", err);
      alert("Error inesperado.");
    }
  }

  async function handleCommentSubmit() {
    if (newComment.trim() === '' || newTitle.trim() === '') {
      alert('Por favor, completa el título y el comentario antes de enviarlo.');
      return;
    }

    const token = localStorage.getItem('access');
    const commentData = {
      auction: id,
      title: newTitle,
      text: newComment,
    };

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/auctions/${id}/comments/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(commentData),
      });

      if (response.ok) {
        const newCommentData = await response.json();
        setComments([newCommentData, ...comments]);
        setNewComment('');
        setNewTitle('');
        alert('Comentario enviado exitosamente');
      } else {
        const errorData = await response.json();
        console.error('Error en la respuesta:', errorData);
        alert('Error al enviar el comentario');
      }
    } catch (error) {
      console.error('Error al enviar el comentario:', error);
      alert('Hubo un problema al enviar el comentario.');
    }
  }

  async function handleCommentDelete(commentId) {
    const token = localStorage.getItem('access');

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/auctions/${id}/comments/${commentId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setComments(comments.filter(comment => comment.id !== commentId));
        alert('Comentario eliminado.');
      } else {
        alert('Error al eliminar el comentario');
      }
    } catch (error) {
      console.error('Error al eliminar el comentario:', error);
      alert('Hubo un problema al eliminar el comentario.');
    }
  }

  return (
    <div className={styles.detailsContainer}>
            <div className={styles.row1}>
        <div className={styles.titleCol}>{product?.title}</div>
        <div className={styles.returnCol}>
          <button className={styles.button} onClick={() => router.push('/auctions')}>Volver</button>
        </div>
      </div>

      <div className={styles.row2}>
        <div className={styles.imageCol}>
          <img src={product?.image} alt={product?.title} className={styles.productImage} />
        </div>
        <div className={styles.descriptionCol}>
          <h3>{product?.description}</h3>
          <p><strong>Precio:</strong> ${product?.price}</p>
          <p><strong>Valoración media:</strong> {product?.rating?.toFixed(2)}</p>
          <p><strong>Stock:</strong> {product?.stock}</p>
          <p><strong>Marca:</strong> {product?.brand}</p>
          <p><strong>Categoría:</strong> {categoryName || 'Cargando...'}</p>
          <p><strong>Subastador:</strong> {auctioneerName}</p>
          <p><strong>Fecha de cierre:</strong> {product?.closing_date}</p>
        </div>

        <div className={styles.bidCol}>
          <h3>Pujas</h3>
          <table className={styles.bidTable}>
            <thead>
              <tr>
                <th>Cantidad</th>
                <th>Usuario</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {bids.map((bid) => (
                <tr key={bid.id}>
                  <td>{bid.price}</td>
                  <td>{bid.bidder_username}</td>
                  <td>{new Date(bid.creation_date).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {product?.isOpen && username ? (
            <div className={styles.bidForm}>
              <div className={styles.bidInputContainer}>
                <input
                  type="number"
                  placeholder="Ingrese su puja"
                  className={styles.bidInput}
                  value={newBid}
                  onChange={(e) => setNewBid(e.target.value)}
                />
                <span className={styles.usernameLabel}>{username}</span>
              </div>
              <button className={styles.button} onClick={handleBidSubmit}>Pujar</button>
            </div>
          ) : !username ? (
            <div className={styles.noSession}>
              <button className={styles.loginButton} onClick={() => router.push("/login")}>
                ¿Quieres pujar? ¡Inicia sesión!
              </button>
            </div>
          ) : (
            <p className={styles.auctionClosed}>Esta subasta está cerrada.</p>
          )}
        </div>
      </div>
      <div className={styles.row3}>
        <div className={styles.ratingSection}>
          <h3>Valoraciones</h3>
          <table className={styles.bidTable}>
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Puntuación</th>
              </tr>
            </thead>
            <tbody>
              {ratings.map((rating) => (
                <tr key={rating.id}>
                  <td>{rating.rating_username}</td>
                  <td>{rating.value}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {username ? (
            <div className={styles.bidForm}>
              <label htmlFor="ratingSelect">Tu valoración (1 a 5):</label>
              <div className={styles.ratingSelect}>
                <select
                  id="ratingSelect"
                  className={styles.bidInput}
                  value={userRating}
                  onChange={(e) => setUserRating(parseInt(e.target.value))}
                >
                  <option value={0}>Selecciona...</option>
                  {[1, 2, 3, 4, 5].map(val => (
                    <option key={val} value={val}>{val}</option>
                  ))}
                </select>
                {ratings.some(r => r.rating_username === username) ? (
                  <>
                    <button className={styles.button} onClick={handleRatingSubmit}>Editar</button>
                    <button className={styles.deleteButton} onClick={handleRatingDelete}>Eliminar</button>
                  </>
                ) : (
                  <button className={styles.button} onClick={handleRatingSubmit}>Valorar</button>
                )}
              </div>
            </div>
          ) : (
            <div className={styles.noSession}>
              <p>¿Quieres valorar? ¡Regístrate o inicia sesión!</p>
              <div className={styles.sesion}>
                <button className={styles.loginButton} onClick={() => router.push("/login")}>
                  Iniciar sesión
                </button>
                <button className={styles.loginButton} onClick={() => router.push("/register")}>
                  Registrarse
                </button>
              </div>
            </div>
          )}
        </div>
        <div className={styles.commentsSection}>
          <h3>Comentarios</h3>

          {comments.length === 0 ? (
            <p>No hay comentarios aún. ¡Sé el primero en comentar!</p>
          ) : (
            <ul className={styles.commentList}>
              {comments.map((comment) => (
                <li key={comment.id} className={styles.comment}>
                  <h4 className={styles.commentTitle}>{comment.title}</h4>
                  <p className={styles.commentText}>{comment.text}</p>
                  <span className={styles.commentUser}>Por: {comment.username}</span>

                  {comment.username === username && (
                    <button
                      className={styles.deleteFormButton}
                      onClick={() => handleCommentDelete(comment.id)}
                    >
                      Eliminar
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}

          <div className={styles.commentForm}>
            <p>¡Cuéntanos tu opinión!</p>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Título del comentario"
              className={styles.input}
            />
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escribe tu comentario aquí..."
              rows="4"
              className={styles.textarea}
            ></textarea>
            <button className={styles.submitButton} onClick={handleCommentSubmit}>
              Enviar Comentario
            </button>
          </div>
        </div>
        </div>
      </div>
  );
}
