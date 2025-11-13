const API_URL = process.env.REACT_APP_API_URL; 

export async function createReservationService(
  stallIds: string[],
  token: string
): Promise<any> {
  try {
    const response = await fetch(`${API_URL}/reservations/reservations/createReservation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ stallIds }),
    });

   let data;
        try {
        data = await response.json();
        } catch {
        const text = await response.text();
        console.error("Server sent non-JSON response:", text);
        throw new Error("Invalid response from server");
        }
    return { message: "success", ...data };
  } catch (error: any) {
    console.error("Reservation creation error:", error);
    return { message: "error", error: error.message };
  }
}
