import React, { useEffect, useState } from "react";
import { api } from "../lib/api";

// ------------------ Types ------------------
interface Stall {
  _id: string;
  name: string;
  size: string;
  status?: string;
  reservationInfo?: ReservationStallWithUser | null;
}

interface ReservationStallWithUser {
  stallId: string;
  name: string;
  size: string;
  _id: string;
  userId: string;
  userEmail: string;
  reservationId: string;
  status: string;
}

interface Reservation {
  _id: string;
  userId: string;
  userEmail: string;
  stalls: ReservationStall[];
  status: string;
  qrToken: string;
  createdAt: string;
  reservationId: string;
}

interface ReservationStall {
  stallId: string;
  name: string;
  size: string;
  _id: string;
}

const StallDashboard: React.FC = () => {
  const [mergedStalls, setMergedStalls] = useState<Stall[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = async () => {
    try {
      const [stallsRes, reservationsRes] = await Promise.all([
        api.get<{ message: string; data: Stall[] }>(
          "http://localhost:5000/stalls/stalls/all-stalls"
        ),
        api.get<{ message: string; reservations: Reservation[] }>(
          "http://localhost:5000/reservations/reservations/getAllReservations"
        ),
      ]);

      const stalls = stallsRes.data.data;
      const reservations = reservationsRes.data.reservations;

      // Map of stall name -> reservation details including user
      const reservedStallsMap: Record<string, ReservationStallWithUser> = {};
      reservations.forEach((reservation) => {
        reservation.stalls.forEach((stall) => {
          reservedStallsMap[stall.name] = {
            ...stall,
            userId: reservation.userId,
            userEmail: reservation.userEmail,
            reservationId: reservation.reservationId,
            status: reservation.status,
          };
        });
      });

      const merged = stalls.map((stall) => ({
        ...stall,
        reservationInfo: reservedStallsMap[stall.name] || null,
        status: reservedStallsMap[stall.name] ? "reserved" : "available",
      }));

      setMergedStalls(merged);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setMergedStalls([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <p>Loading stalls...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Stall Dashboard</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "15px",
        }}
      >
        {mergedStalls.map((stall) => (
          <div
            key={stall._id}
            style={{
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              backgroundColor:
                stall.status === "reserved" ? "#ffcccc" : "#ccffcc",
            }}
          >
            <h3>{stall.name}</h3>
            <p>Size: {stall.size}</p>
            <p>Status: {stall.status}</p>
            {stall.reservationInfo && (
              <>
                <p>User ID: {stall.reservationInfo.userId}</p>
                <p>User Email: {stall.reservationInfo.userEmail}</p>
                <p>Reservation ID: {stall.reservationInfo.reservationId}</p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StallDashboard;
