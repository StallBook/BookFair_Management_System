const API_URL = process.env.REACT_APP_API_URL;

interface SignUpPayload {
  name: string;
  email: string;
  password: string;
}

export async function userSignUpService(userData: SignUpPayload): Promise<any> {
  try {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        message: "error",
        error: data.message || "Signup failed",
      };
    }

    return { message: "success", ...data };
  } catch (error: any) {
    console.error("Fetch error in userSignUpService:", error);
    return { message: "error", error: "Network error. Please try again later." };
  }
}

interface SignInPayload {
  email: string;
  password: string;
}

export async function userSignInService(userData: SignInPayload): Promise<any> {
  try {
    const response = await fetch(`${API_URL}/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        message: "error",
        error: data.message || "Signin failed",
      };
    }

    return { message: "success", ...data };
  } catch (error: any) {
    console.error("Fetch error in userSignInService:", error);
    return { message: "error", error: "Network error. Please try again later." };
  }
}
