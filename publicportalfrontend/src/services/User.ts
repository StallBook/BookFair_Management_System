const API_URL = process.env.REACT_APP_API_URL;

interface SignUpPayload {
  name: string;
  email: string;
  password: string;
}
export async function userSignUpService(userData: SignUpPayload): Promise<any> {
  try {
    const response = await fetch(`${API_URL}/auth/user/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        message: data.message || "Signup failed",
      };
    }
    return data;
  } catch (error: any) {
    console.error("Fetch error in userSignUpService:", error);
  }
}

