"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './my_bids.module.css';
import Image from "next/image";

export default function MyBids() {
  const [user, setUser] = useState(null);
  const [myBids, setMyBids] = useState([]);
  const [editingBid, setEditingBid] = useState(null);
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
      .then(data => {
        setUser(data);
      })
      .catch(err => {
        console.error("Error al obtener el usuario:", err);
        router.push('/login');
      });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (!user || !token) return;
  
    fetch('http://127.0.0.1:8000/api/users/myBids/', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        const bids = data.results.map((bid) => ({
          id: bid.id,
          product: bid.auction_title,
          auctionId: bid.auction_id,
          price: bid.price,
          date: new Date(bid.creation_date).toLocaleString(),
        }));
        setMyBids(bids);
      })
      .catch((error) => console.error('Error al obtener las pujas del usuario:', error));
  }, [user]);
  

  // useEffect(() => {
  //   const token = localStorage.getItem('access');
  //   if (!user || !token) return;

  //   fetch('http://127.0.0.1:8000/api/auctions/', {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //       "Authorization": `Bearer ${token}`
  //     }
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       const fetchBids = data.results.map((auction) =>
  //         fetch(`http://127.0.0.1:8000/api/auctions/${auction.id}/bids/`, {
  //           method: "GET",
  //           headers: {
  //             "Content-Type": "application/json",
  //             "Authorization": `Bearer ${token}`
  //           }
  //         })
  //           .then((response) => response.json())
  //           .then((bidsData) => {
  //             const userBids = bidsData.results.filter((bid) => bid.bidder_username === user.username);
  //             return userBids.map((bid) => ({
  //               id: bid.id,
  //               product: auction.title,
  //               auctionId: auction.id,
  //               price: bid.price,
  //               date: new Date(bid.creation_date).toLocaleString(),
  //             }));
  //           })
  //       );

  //       Promise.all(fetchBids)
  //         .then((results) => {
  //           const flattenedResults = results.flat();
  //           setMyBids(flattenedResults);
  //         })
  //         .catch((error) => console.error('Error al obtener las pujas del usuario:', error));
  //     })
  //     .catch((error) => console.error('Error al cargar subastas:', error));
  // }, [user]);

  const handleDelete = async (id, auctionId) => {
    const token = localStorage.getItem('access');
    try {
      await fetch(`http://127.0.0.1:8000/api/auctions/${auctionId}/bids/${id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      setMyBids(myBids.filter((bid) => bid.id !== id));
      alert('Puja eliminada correctamente');
    } catch (error) {
      console.error('Error al eliminar la puja:', error);
      alert('No se pudo eliminar la puja.');
    }
  };

  const handleEdit = async (id, auctionId) => {
    const token = localStorage.getItem('access');
    setEditError('');
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/auctions/${auctionId}/bids/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          price: parseFloat(editValue),
          auction: auctionId,
          bidder: user.username
        }),
      });

      if (response.ok) {
        setMyBids(myBids.map((bid) => (bid.id === id ? { ...bid, price: parseFloat(editValue) } : bid)));
        setEditingBid(null);
        setEditError('');
        alert('Puja actualizada correctamente');
      } else if (response.status === 400) {
        const errorData = await response.json();
        const priceError = errorData?.non_field_errors;
        setEditError(Array.isArray(priceError) ? priceError[0] : priceError);
      } 
    } catch (error) {
      console.error('Error al editar la puja:', error);
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
                    <>
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                      />
                      {editError && <div className={styles.error}>{editError}</div>}
                    </>
                  ) : (
                    bid.price
                  )}
                </td>
                <td>{bid.date}</td>
                <td>
                  {editingBid === bid.id ? (
                    <>
                      <button className={styles.saveButton} onClick={() => handleEdit(bid.id, bid.auctionId)}>Guardar</button>
                      <button
                        onClick={() => {
                          setEditingBid(null);
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
                      setEditingBid(bid.id);
                      setEditValue(bid.price);
                      setEditError('');
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
