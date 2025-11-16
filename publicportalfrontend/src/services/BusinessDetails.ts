const API_URL = process.env.REACT_APP_API_URL;

interface DetailPayload {
  userID: number;
  business: {
    businessName: string;
    ownerName: string;
    phoneNumber: string;
  };
}

export async function addBusinessDetailsService(
  detailsData: DetailPayload
): Promise<any> {
  try {
    const response = await fetch(`${API_URL}/auth/business/business-details`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(detailsData),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        message: "error",
        error: data.error || "Adding details failed",
      };
    }

    return { message: "success", ...data };
  } catch (error: any) {
    console.error("Fetch error in addBusinessDetailsService:", error);
    return {
      message: "error",
      error: "Network error. Please try again later.",
    };
  }
}

export async function viewBusinessDetailsService(userID: number): Promise<any> {
  try {
    const response = await fetch(
      `${API_URL}/auth/business/get-business-details`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userID }),
      }
    );
    const data = await response.json();
    if (!response.ok) {
      return {
        message: "error",
        error: data.error || "Fetching business details failed",
      };
    }
    return { message: "success", ...data };
  } catch (error: any) {
    console.error("Fetch error in viewBusinessDetailsService:", error);
    return {
      message: "error",
      error: "Network error. Please try again later.",
    };
  }
}
