export interface ValidationErrors {
  username?: string;
  email?: string;
  password?: string;
}

export const validateField = (name: string, value: string): string => {
  let error = "";

  if (name === "username") {
    if (!value.trim()) {
      error = "Username is required";
    } else if (value.length < 3) {
      error = "Username must be at least 3 characters long";
    }
  }

  if (name === "email") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value.trim()) {
      error = "Email is required";
    } else if (!emailRegex.test(value)) {
      error = "Invalid email format";
    }
  }

  if (name === "password") {
    if (!value.trim()) {
      error = "Password is required";
    } else if (value.length < 6) {
      error = "Password must be at least 6 characters long";
    }
  }

  return error;
};

export const validateSimpleField = (name: string, value: string) => {
  if (!value.trim()) {
    return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
  }
  return "";
};
