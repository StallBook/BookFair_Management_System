const API_URL = process.env.REACT_APP_API_URL;

interface GenrePayload {
  userID: number;
  genres: { name: string; description: string }[];
}

export async function genreAddService(genreData: GenrePayload): Promise<any> {
  try {
    const response = await fetch(`${API_URL}/auth/genres/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(genreData),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        message: "error",
        error: data.error || "Adding genre failed",
      };
    }

    return { message: "success", ...data };
  } catch (error: any) {
    console.error("Fetch error in genreAddService:", error);
    return {
      message: "error",
      error: "Network error. Please try again later.",
    };
  }
}

export async function getGenreListService(): Promise<any> {
  try {
    const response = await fetch(`${API_URL}/auth/genres/types`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        message: "error",
        error: data.error || "Fetching genre list failed",
      };
    }

    return { message: "success", ...data };
  } catch (error: any) {
    console.error("Fetch error in getGenreListService:", error);
    return {
      message: "error",
      error: "Network error. Please try again later.",
    };
  }
}
