"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './my_bids.module.css';
import Image from "next/image";

export default function MyBids() {
  const [username, setUsername] = useState('');
  const [myBids, setMyBids] = useState([]);
  const [editingBid, setEditingBid] = useState(null);
  const [editValue, setEditValue] = useState('');
  const router = useRouter();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      router.push('/login');
    }
  }, []);

  useEffect(() => {
    if (username) {
      fetch('http://127.0.0.1:8000/api/auctions/')
        .then((response) => response.json())
        .then((data) => {
          const fetchBids = data.results.map((auction) =>
            fetch(`http://127.0.0.1:8000/api/auctions/${auction.id}/bids/`)
              .then((response) => response.json())
              .then((bidsData) => {
                const userBids = bidsData.results.filter((bid) => bid.bidder === username);
                return userBids.map((bid) => ({
                  id: bid.id,
                  product: auction.title,
                  auctionId: auction.id,
                  price: bid.price,
                  date: new Date(bid.creation_date).toLocaleString(),
                }));
              })
          );

          Promise.all(fetchBids)
            .then((results) => {
              const flattenedResults = results.flat();
              setMyBids(flattenedResults);
            })
            .catch((error) => console.error('Error al obtener las pujas del usuario:', error));
        })
        .catch((error) => console.error('Error al cargar subastas:', error));
    }
  }, [username]);

  const handleDelete = async (id, auctionId) => {
    try {
      await fetch(`http://127.0.0.1:8000/api/auctions/${auctionId}/bids/${id}/`, {
        method: 'DELETE',
      });
      setMyBids(myBids.filter((bid) => bid.id !== id));
      alert('Puja eliminada correctamente');
    } catch (error) {
      console.error('Error al eliminar la puja:', error);
      alert('No se pudo eliminar la puja.');
    }
  };

  const handleEdit = async (id, auctionId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/auctions/${auctionId}/bids/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          price: parseFloat(editValue),
          auction: auctionId, 
          bidder: username,
        }),
      });
  
      if (response.ok) {
        setMyBids(myBids.map((bid) => (bid.id === id ? { ...bid, price: parseFloat(editValue) } : bid)));
        setEditingBid(null);
        alert('Puja actualizada correctamente');
      } else {
        const errorData = await response.json();
        alert(`Error al actualizar la puja: ${errorData.detail || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error('Error al editar la puja:', error);
      alert('No se pudo actualizar la puja.');
    }
  };  

  return (
    <div className={styles.myBidsContainer}>
      <div className={styles.header}>
        <h2 className={styles.title}>Mis Pujas</h2>
        <hr className={styles.line} />
      </div>
      {myBids.length > 0 ? (
        <table className={styles.bidTable}>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {myBids.map((bid) => (
              <tr key={bid.id}>
                <td onClick={() => router.push(`/details/${bid.auctionId}`)} className={styles.link}>
                  {bid.product}
                </td>
                <td>
                  {editingBid === bid.id ? (
                    <input
                      type="number"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                    />
                  ) : (
                    bid.price
                  )}
                </td>
                <td>{bid.date}</td>
                <td>
                  {editingBid === bid.id ? (
                    <button onClick={() => handleEdit(bid.id, bid.auctionId)}>Guardar</button>
                  ) : (
                    <button className={styles.editButton} onClick={() => {
                      setEditingBid(bid.id);
                      setEditValue(bid.price);
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
                  <button className={styles.deleteButton} onClick={() => handleDelete(bid.id, bid.auctionId)}>
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
        <p>No has realizado ninguna puja.</p>
      )}
    </div>
  );
}
