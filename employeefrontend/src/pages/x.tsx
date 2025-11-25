// src/pages/Stalls.tsx
import React, { useEffect, useMemo, useState } from "react";
import type { JSX } from "react";
import bg from "../assets/bg1.png";
import { message } from "antd";
import { api } from "../lib/api"; 

interface User {
  id: string;
  name: string;
  email: string;
 
}

interface ServerPayload {
  message: string;
  data: User[];
}






export default function Stalls(): JSX.Element {
  const canUseWindow = typeof window !== "undefined";
  const goBack = () => {
    if (!canUseWindow) return;
    if (window.history.length > 1) window.history.back();
    else window.location.assign("/");
  };
  const goSettings = () => {
    if (!canUseWindow) return;
    window.location.assign("/settings");
  };

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);


 
 useEffect(() => {
    fetchUsers();
  
  }, []);

interface User {
  id: string;
  name: string;
  email: string;
  // add other user fields here
}

interface ServerPayload {
  message: string;
  data: User[];
}

const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await api.get<ServerPayload>("http://localhost:5001/user/allUsers");

    // response.data is typed as ServerPayload
    if (response.data.message === "success") {
      const users = response.data.data;
      console.log("Fetched users:", users);
      setUsers(users); // assuming setUsers is in scope (React state setter)
      return users;
    } else {
      // handle non-success message from server
      console.warn("Server responded with:", response.data.message);
      setUsers([]); // optional: clear state on non-success
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch users:", error);
    setUsers([]); // optional: set empty on error
    return [];
  }
};

  function copy(text?: string) {
    if (!text) return;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      message.success("Copied to clipboard");
    }
  }

  return (
    <div className="min-h-screen bg-black bg-opacity-200">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-gray-600 border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3">
          <div className="font-bold text-black tracking-tight text-xl">StallBook Dashboard</div>
          <div className="ml-auto flex items-center gap-2">
            <button
              className="text-sm text-gray-800 fontweight-medium font-semibold hover:text-black px-3 py-1.5 rounded-lg hover:bg-gray-100"
              onClick={goBack}
            >
              ← Back
            </button>
            <button
              className="text-sm text-white bg-black hover:bg-gray-800 rounded-lg px-3 py-1.5"
              onClick={goSettings}
            >
              Settings
            </button>
          </div>
        </div>
      </header>

  

      
    </div>
  );
}
