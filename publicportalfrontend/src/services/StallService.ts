import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5005";

export async function getAllStalls() {
  try {
    const res = await axios.get(`${API_URL}/stalls/stalls/all-stalls`);
    return { message: "success", data: res.data.data };
  } catch (error: any) {
    console.error("Error fetching all stalls:", error);
    return {
      message: "error",
      error: error.response?.data?.message || "Failed to fetch stalls",
    };
  }
}