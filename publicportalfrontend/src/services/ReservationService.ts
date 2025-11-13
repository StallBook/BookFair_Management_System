const API_URL = process.env.REACT_APP_API_URL; 

export async function createReservationService(
  stallIds: string[],
  token: string
): Promise<any> {
  try {
    const response = await fetch(`${API_URL}/reservations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ stallIds }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to create reservation");
    }

    return { message: "success", ...data };
  } catch (error: any) {
    console.error("Reservation creation error:", error);
    return { message: "error", error: error.message };
  }
}
