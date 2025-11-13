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

    const data = await response.json().catch(() => null);

    if (response.ok) {
      return { message: "success", ...data };
    }
    return {
      message: "error",
      error:
        data?.message ||
        data?.error ||
        `Request failed with status ${response.status}`,
    };
  } catch (error: any) {
    console.error("Reservation creation error:", error);
    return { message: "error", error: error.message };
  }
}
