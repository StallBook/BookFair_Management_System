// src/pages/Stalls.tsx
import React, { useEffect, useMemo, useState } from "react";
import type { JSX } from "react";
import bg from "../assets/bg1.png";
import { message } from "antd";
import { api } from "../lib/api"; 

export type Status = "available" | "reserved";

export interface ReservedBy {
  userId: string;
  name?: string;
  email?: string;
  phone?: string;
  organization?: string;
}

export interface Stall {
  id: string;
  name: string;
  status: Status;
  size?: string;
  pricePerDay?: number;
  reservedAt?: string; // ISO
  reservedBy?: ReservedBy | null;
  business?: [] | String;
  notes?: string;
}

export interface UserFromApi {
  _id?: string;
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  organization?: string;
}

/* ---------- UI pieces (unchanged) ---------- */

function StatusBadge({ status }: { status: Status }) {
  const color = status === "available" ? "bg-green-500" : "bg-red-500";
  const text = status === "available" ? "Available" : "Reserved";
  return (
    <span
      className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-semibold ${
        status === "available" ? "text-green-700 bg-green-50" : "text-red-700 bg-red-50"
      }`}
    >
      <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
      {text}
    </span>
  );
}

function StallCard({ stall, onOpen }: { stall: Stall; onOpen: (s: Stall) => void }) {
  const base = "bg-gray-300 ring-gray-200 hover:ring-gray-300";
  return (
    <button
      onClick={() => onOpen(stall)}
      className={`group relative w-full text-left rounded-2xl shadow-sm ring-1 p-4
                  focus:outline-none focus:ring-2 focus:ring-offset-2 transition ${base}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold tracking-tight">{stall.name}</h3>
          <p className="text-xs text-gray-600 mt-0.5">ID: {stall.id}</p>
        </div>
        <StatusBadge status={stall.status} />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-700">
        <div className="rounded-lg bg-white/80 backdrop-blur-sm p-2 ring-1 ring-black/5">
          <div className="text-xs text-gray-500">Size</div>
          <div className="font-medium">{stall.size || "—"}</div>
        </div>
        <div className="rounded-lg bg-white/80 backdrop-blur-sm p-2 ring-1 ring-black/5">
          <div className="text-xs text-gray-500">Price / day</div>
          <div className="font-medium">
            LKR {stall.pricePerDay?.toLocaleString?.() ?? "—"}
          </div>
        </div>
      </div>

      {stall.status === "reserved" && (
        <div className="mt-3 text-xs text-gray-700">
          <span className="font-medium">Reserved by:</span>{" "}
          {stall?.reservedBy?.name || stall?.reservedBy?.userId}
        </div>
      )}
      <div className="absolute inset-x-0 -bottom-px h-0.5 bg-gradient-to-r from-transparent via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition" />
    </button>
  );
}

/* ---------- Main component - wired to backend ---------- */

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

  const [allStalls, setAllStalls] = useState<Stall[]>([]);
  const [users, setUsers] = useState<ReservedBy[]>([]); // NEW: store fetched users
  const [query, setQuery] = useState<string>("");
  const [tab, setTab] = useState<"all" | Status>("all");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState<Stall | null>(null);

  // helper to normalize server stall to our interface
  function normalizeStall(raw: any): Stall {
    return {
      id: raw.id || raw._id?.toString?.() || String(raw._id || ""),
      name: raw.name || "—",
      status: raw.status === "reserved" ? "reserved" : "available",
      size: raw.size,
      pricePerDay: raw.pricePerDay,
      reservedAt: raw.reservedAt ? new Date(raw.reservedAt).toISOString() : undefined,
      reservedBy: raw.reservedBy || null,
      notes: raw.notes,
    };
  }

  // helper to normalize a user from the API into ReservedBy shape
  function normalizeUser(raw: UserFromApi): ReservedBy {
    const id = raw.id || raw._id?.toString?.() || "";
    return {
      userId: id,
      name: raw.name,
      email: raw.email,
      phone: raw.phone,
      organization: raw.organization,
    };
  }

  // fetch stalls from server
  async function fetchStalls() {
    setError(null);
    try {
      setLoading(true);
      const res = await api.get("/api/stalls");
      if (!Array.isArray(res.data)) {
        throw new Error("Unexpected response from server");
      }
      const normalized = res.data.map(normalizeStall);
      console.log("Fetched stalls:", normalized);
      setAllStalls(normalized);
    } catch (err: any) {
      console.error("Failed to load stalls", err);
      setError(err?.response?.data?.msg || err?.message || "Failed to load stalls");
      message.error(err?.response?.data?.msg || "Failed to load stalls");
    } finally {
      setLoading(false);
    }
  }

  // NEW: fetch users from server and store in state
  async function fetchUsers() {
    try {
      const res = await api.get("http://localhost:5000/auth/user"); // adjust endpoint to your backend
      if (!Array.isArray(res.data)) {
        throw new Error("Unexpected response while fetching users");
      }
      const normalized = res.data.map((u: UserFromApi) => normalizeUser(u));
      setUsers(normalized);
    } catch (err: any) {
      console.error("Failed to load users", err);
      message.error(err?.response?.data?.msg || "Failed to load users");
    }
  }

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!mounted) return;
      // load stalls and users in parallel
      await Promise.all([fetchStalls(), fetchUsers()]);
    })();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // load once on mount

  const filtered = useMemo(() => {
    let rows = allStalls;
    if (tab !== "all") rows = rows.filter((r) => r.status === tab);
    if (query.trim()) {
      const q = query.toLowerCase();
      rows = rows.filter((r) =>
        [r.name, r.id].some((v) => String(v || "").toLowerCase().includes(q))
      );
    }
    return rows;
  }, [allStalls, tab, query]);

  // toggle status with backend call
  function toggleStatus(stall: Stall) {
    return async () => {
      // Confirmation + collect reserver info when marking reserved
      const next: Status = stall.status === "available" ? "reserved" : "available";

      let payload: any = { status: next };

      if (next === "reserved") {
        // small prompt flow — replace with a modal later if you want nicer UI
        const name = window.prompt("Enter reserver's name (required)", "");
        if (!name) {
          message.info("Reservation cancelled — name is required");
          return;
        }
        const email = window.prompt("Enter reserver's email (optional)", "") || undefined;
        const userId = `U-${Math.random().toString(36).slice(2, 9).toUpperCase()}`;
        payload.reservedBy = { userId, name, email };
      }

      try {
        // optimistic UI: set loading state on button by marking global loading
        const res = await api.patch(`/api/stalls/${stall.id}/status`, payload);
        const updated = normalizeStall(res.data);
        setAllStalls((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
        setActive((cur) => (cur && cur.id === updated.id ? updated : cur));
        message.success(`Stall ${updated.id} updated`);
      } catch (err: any) {
        console.error("Failed to update stall", err);
        const apiMsg = err?.response?.data?.msg || err?.message || "Failed to update stall";
        message.error(apiMsg);
      }
    };
  }

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

      <div className="relative min-h-screen bg-gray-50 bg-cover bg-center " style={{ backgroundImage: `url(${bg})` }}>
        {/* Controls */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="flex items-center gap-1 bg-white rounded-xl p-1 ring-1 ring-black/5 w-fit">
              {[
                { key: "all", label: "All" },
                { key: "available", label: "Available" },
                { key: "reserved", label: "Reserved" },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key as "all" | Status)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    tab === t.key ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="relative md:ml-auto">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by stall name or ID…"
                className="w-full md:w-80 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
              {query && (
                <button onClick={() => setQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs">
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="mt-5">
            {loading ? (
              <div className="text-gray-600">Loading stalls…</div>
            ) : error ? (
              <div className="text-red-600">{error}</div>
            ) : filtered.length === 0 ? (
              <div className="text-gray-600">No stalls match your filters.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((stall) => (
                  <div key={stall.id} className="relative">
                    <StallCard stall={stall} onOpen={setActive} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Drawer / Slide-over */}
      {active && (
        <div className="fixed inset-0 z-40 ">
          <div className="absolute inset-0 bg-black/40" onClick={() => setActive(null)} />
          <aside className="absolute right-0 top-0 h-full w-full sm:w-[28rem] bg-blue-100 shadow-2xl p-6 overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold">{active.name}</h2>
                <p className="text-xs text-gray-500 mt-0.5">ID: {active.id}</p>
              </div>
              <StatusBadge status={active.status} />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-gray-50 p-3">
                <div className="text-xs text-gray-500">Size</div>
                <div className="font-medium">{active.size || "—"}</div>
              </div>
              <div className="rounded-lg bg-gray-50 p-3">
                <div className="text-xs text-gray-500">Price / day</div>
                <div className="font-medium">LKR {active.pricePerDay?.toLocaleString?.() || "—"}</div>
              </div>
            </div>

            {active.status === "reserved" ? (
              <div className="mt-6">
                <h3 className="text-sm font-semibold">Reserver Details</h3>
                <div className="mt-2 space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="text-gray-600">User ID</div>
                    <div className="font-mono">{active.reservedBy?.userId}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-gray-600">Name</div>
                    <div>{active.reservedBy?.name}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-gray-600">Email</div>
                    <a className="underline" href={`mailto:${active.reservedBy?.email}`}>{active.reservedBy?.email}</a>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-gray-600">Phone</div>
                    <a className="underline" href={`tel:${active.reservedBy?.phone}`}>{active.reservedBy?.phone}</a>
                  </div>
                  {active.reservedBy?.organization && (
                    <div className="flex items-center justify-between">
                      <div className="text-gray-600">Organization</div>
                      <div>{active.reservedBy.organization}</div>
                    </div>
                  )}
                  {active.reservedAt && (
                    <div className="flex items-center justify-between">
                      <div className="text-gray-600">Reserved At</div>
                      <div>{new Date(active.reservedAt).toLocaleString()}</div>
                    </div>
                  )}
                  {active.notes && (
                    <div className="pt-2">
                      <div className="text-xs text-gray-500">Notes</div>
                      <div className="text-sm">{active.notes}</div>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex gap-2">
                  <button onClick={() => copy(active.reservedBy?.userId)} className="px-3 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50">
                    Copy User ID
                  </button>
                  <a href={`mailto:${active.reservedBy?.email}?subject=Your%20Bookfair%20Stall%20Reservation%20(${active.name})`} className="px-3 py-2 text-sm rounded-lg bg-gray-900 text-white hover:bg-black">
                    Email User
                  </a>
                </div>
              </div>
            ) : (
              <div className="mt-6 text-sm text-gray-600">
                This stall is available. You can reserve it for a user from here later.
              </div>
            )}

            <div className="mt-8 flex items-center gap-2">
              <button
                onClick={toggleStatus(active)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold ${
                  active.status === "available"
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                {active.status === "available" ? "Mark as Reserved" : "Release Stall"}
              </button>
              <button onClick={() => setActive(null)} className="px-4 py-2 rounded-xl text-sm font-semibold border border-gray-300 hover:bg-gray-50">
                Close
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
