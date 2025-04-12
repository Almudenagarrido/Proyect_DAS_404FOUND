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
  const [categoryName, setCategoryName] = useState('');
  const [newBid, setNewBid] = useState('');
  const router = useRouter();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetch(`http://127.0.0.1:8000/api/auctions/${id}/`)
        .then((response) => response.json())
        .then((data) => {
          setProduct(data);

          fetch(`http://127.0.0.1:8000/api/auctions/${id}/bids/`)
            .then((response) => response.json())
            .then((bidsData) => {
              const sortedBids = bidsData.results.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
              setBids(sortedBids);
            })
            .catch((error) => console.error('Error al obtener las pujas:', error));

          fetch(`http://127.0.0.1:8000/api/auctions/category/${data.category}/`)
            .then((response) => response.json())
            .then((categoryData) => setCategoryName(categoryData.name))
            .catch((error) => console.error('Error al obtener la categoría:', error));
        })
        .catch((error) => {
          console.error('Error al cargar detalles:', error);
        });
    }
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
          alert(`Error al realizar la puja: ${error.detail || 'Un error desconocido ocurrió'}. Inténtelo de nuevo.`);
        }
      } catch (error) {
        console.error('Error al enviar la puja:', error);
        alert('Hubo un problema al enviar la puja.');
      }
    } else {
      alert('Por favor, ingrese una cantidad para pujar.');
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
          <img src={product?.thumbnail} alt={product?.title} className={styles.productImage} />
        </div>
        <div className={styles.descriptionCol}>
          <h3>{product?.description}</h3>
          <p><strong>Precio:</strong> ${product?.price}</p>
          <p><strong>Descuento:</strong> {product?.discountPercentage}%</p>
          <p><strong>Valoración:</strong> {product?.rating}</p>
          <p><strong>Stock:</strong> {product?.stock}</p>
          <p><strong>Marca:</strong> {product?.brand}</p>
          <p><strong>Categoría:</strong> {categoryName || 'Cargando...'}</p>
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
                  <td>{bid.bidder}</td>
                  <td>{new Date(bid.creation_date).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {username ? (
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
          ) : (
            <div className={styles.noSession}>
              <button
                className={styles.loginButton}
                onClick={() => router.push("/login")}
              >
                ¿Quieres pujar? ¡Inicia sesión!
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
