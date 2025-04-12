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
  const [auctioneerName, setAuctioneerName] = useState('');

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
        // 1. Product details
        const productResponse = await fetch(`http://127.0.0.1:8000/api/auctions/${id}/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
  
        if (!productResponse.ok) throw new Error("Error al obtener el producto");
        const productData = await productResponse.json();
        setProduct(productData);
  
        // 2. Auctioneer
        if (productData.auctioneer) {
          const auctioneerResponse = await fetch(`http://127.0.0.1:8000/api/users/${productData.auctioneer}/`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          });
  
          if (!auctioneerResponse.ok) throw new Error("Error al obtener el subastador");
          const auctioneerData = await auctioneerResponse.json();
          setAuctioneerName(auctioneerData.username); // o `${auctioneerData.first_name} ${auctioneerData.last_name}`
        }
  
        // 3. Category
        if (productData.category) {
          const categoryResponse = await fetch(`http://127.0.0.1:8000/api/auctions/category/${productData.category}/`);
          if (!categoryResponse.ok) throw new Error("Error al obtener la categoría");
          const categoryData = await categoryResponse.json();
          setCategoryName(categoryData.name);
        }
  
        // 4. Bids
        const bidsResponse = await fetch(`http://127.0.0.1:8000/api/auctions/${id}/bids/`);
        if (!bidsResponse.ok) throw new Error("Error al obtener las pujas");
        const bidsData = await bidsResponse.json();
  
        const sortedBids = bidsData.results.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        setBids(sortedBids);
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
        } else if (response.status === 400) {
          const error = await response.json();
  
          const bidError = error?.price || error?.non_field_errors || error?.detail || 'Error desconocido';
          const message = Array.isArray(bidError) ? bidError[0] : bidError;
          alert(`Error al realizar la puja: ${message}`);
        } else {
          alert('Error inesperado al realizar la puja. Inténtalo de nuevo.');
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
          {product?.isOpen ? (
            username ? (
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
            )
          ) : (
            <p className={styles.auctionClosed}>Esta subasta está cerrada.</p>
          )}
        </div>
      </div>
    </div>
  );
}
