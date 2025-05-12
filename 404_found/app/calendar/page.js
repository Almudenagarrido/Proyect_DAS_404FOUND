"use client";

import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useRouter } from "next/navigation";
import styles from './calendar.module.css';

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      const response = await fetch("http://127.0.0.1:8000/api/auctions/calendar/");
      const data = await response.json();
      setEvents(data);
    };

    fetchEvents();
  }, []);

  return (
    <main className={styles.auctionPage}>
    <h2 className={styles.title}>Calendario de subastas</h2>
    <hr className={styles.line} />
    <div className={styles['calendar-container']}>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events.map(({ end, title, id }) => ({
          start: end,
          title,
          id,
          backgroundColor: "red",
        }))}
        locale="es"
        eventContent={(eventInfo) => {
          return (
            <div className={styles['event-content']}>
              <span className={styles['event-dot']}></span>
              <span>{eventInfo.event.title}</span>
            </div>
          );
        }}
        eventClick={(eventInfo) => {
          router.push(`/details/${eventInfo.event.id}`);
        }}
      />
    </div>
  </main>
  );
}
