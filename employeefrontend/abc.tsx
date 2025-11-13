import React, { useEffect, useMemo, useState } from "react";
import type { JSX } from "react";


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
  reservedBy?: ReservedBy;
  notes?: string;
}

/**
 * Stall Availability Dashboard (Admin)
 * - Grid of bookstalls with live status badges (green/red)
 * - Click a stall to view details
 * - If reserved: show reserver details (userId, name, email, phone, org)
 * - Search + filter by status
 * - Reserve/Release actions are mocked; wire to your API later
 *
 * NOTE: This component avoids react-router hooks so it can run even when not
 * wrapped in a <Router>. Navigation uses window.history / location fallbacks.
 * If you prefer SPA navigation, wrap your app in a Router and replace the
 * goBack/goSettings handlers with react-router's useNavigate.
 */

const mockStalls: Stall[] = [
  {
    id: "S-001",
    name: "Stall A1",
    status: "available",
    size: "2m x 2m",
    pricePerDay: 4000,
  },
  {
    id: "S-002",
    name: "Stall A2",
    status: "reserved",
    size: "2m x 2m",
    pricePerDay: 4000,
    reservedAt: "2025-11-10T09:15:00Z",
    reservedBy: {
      userId: "U-78345",
      name: "Nirmal Perera",
      email: "nirmal@example.com",
      phone: "+94 71 123 4567",
      organization: "Perera Publishers",
    },
    notes: "Requires corner power outlet.",
  },
  {
    id: "S-003",
    name: "Stall A3",
    status: "reserved",
    size: "3m x 2m",
    pricePerDay: 5000,
    reservedAt: "2025-11-11T14:30:00Z",
    reservedBy: {
      userId: "U-99120",
      name: "S. Fernando",
      email: "sfernando@example.com",
      phone: "+94 77 555 6138",
      organization: "Metro Books",
    },
  },
  {
    id: "S-004",
    name: "Stall B1",
    status: "available",
    size: "2m x 2m",
    pricePerDay: 3800,
  },
  {
    id: "S-005",
    name: "Stall B2",
    status: "available",
    size: "2m x 2m",
    pricePerDay: 3800,
  },
];

// Mock API layer (replace with your backend)
const api = {
  listStalls: async (): Promise<Stall[]> => {
    await new Promise((r) => setTimeout(r, 200));
    return JSON.parse(JSON.stringify(mockStalls));
  },
  updateStatus: async (id: string, nextStatus: Status): Promise<Stall> => {
    await new Promise((r) => setTimeout(r, 150));
    const idx = mockStalls.findIndex((s) => s.id === id);
    if (idx >= 0) {
      mockStalls[idx].status = nextStatus;
      if (nextStatus === "available") {
        delete mockStalls[idx].reservedBy;
        delete mockStalls[idx].reservedAt;
      } else if (nextStatus === "reserved" && !mockStalls[idx].reservedBy) {
        // attach a dummy reserver so the drawer can render; replace in real flow
        mockStalls[idx].reservedBy = {
          userId: "U-NEW",
          name: "Pending User",
          email: "pending@example.com",
        };
        mockStalls[idx].reservedAt = new Date().toISOString();
      }
    }
    return JSON.parse(JSON.stringify(mockStalls[idx]));
  },
};

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
  return (
    <button
      onClick={() => onOpen(stall)}
      className="group relative w-full text-left bg-white rounded-2xl shadow-sm ring-1 ring-black/5 p-4 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold tracking-tight">{stall.name}</h3>
          <p className="text-xs text-gray-500 mt-0.5">ID: {stall.id}</p>
        </div>
        <StatusBadge status={stall.status} />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-700">
        <div className="rounded-lg bg-gray-50 p-2">
          <div className="text-xs text-gray-500">Size</div>
          <div className="font-medium">{stall.size || "—"}</div>
        </div>
        <div className="rounded-lg bg-gray-50 p-2">
          <div className="text-xs text-gray-500">Price / day</div>
          <div className="font-medium">
            LKR {stall.pricePerDay?.toLocaleString?.() ?? "—"}
          </div>
        </div>
      </div>
      {stall.status === "reserved" && (
        <div className="mt-3 text-xs text-gray-600">
          <span className="font-medium">Reserved by:</span> {stall?.reservedBy?.name || stall?.reservedBy?.userId}
        </div>
      )}
      <div className="absolute inset-x-0 -bottom-px h-0.5 bg-gradient-to-r from-transparent via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition" />
    </button>
  );
}

export default function Stalls(): JSX.Element {
  // Safe navigation fallbacks so this component works without a Router
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
  const [query, setQuery] = useState<string>("");
  const [tab, setTab] = useState<"all" | Status>("all");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState<Stall | null>(null); // selected stall for drawer

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await api.listStalls();
        if (mounted) setAllStalls(data);
      } catch (e) {
        setError("Failed to load stalls");
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    let rows = allStalls;
    if (tab !== "all") rows = rows.filter((r) => r.status === tab);
    if (query.trim()) {
      const q = query.toLowerCase();
      rows = rows.filter((r) => [r.name, r.id].some((v) => String(v).toLowerCase().includes(q)));
    }
    return rows;
  }, [allStalls, tab, query]);

  function toggleStatus(stall: Stall) {
    return async () => {
      const next: Status = stall.status === "available" ? "reserved" : "available";
      const updated = await api.updateStatus(stall.id, next);
      setAllStalls((prev) => prev.map((s) => (s.id === updated.id ? { ...s, ...updated } : s)));
      setActive((cur) => (cur && cur.id === updated.id ? { ...cur, ...updated } : cur));
    };
  }

  function copy(text?: string) {
    if (!text) return;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3">
          <div className="font-bold tracking-tight text-xl">StallBook • Admin</div>
          <div className="ml-auto flex items-center gap-2">
            <button
              className="text-sm text-gray-600 hover:text-black px-3 py-1.5 rounded-lg hover:bg-gray-100"
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
              <button
                onClick={() => setQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs"
              >
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
                <StallCard key={stall.id} stall={stall} onOpen={setActive} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Drawer / Slide-over */}
      {active && (
        <div className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/40" onClick={() => setActive(null)} />
          <aside className="absolute right-0 top-0 h-full w-full sm:w-[28rem] bg-white shadow-2xl p-6 overflow-y-auto">
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
                  <button
                    onClick={() => copy(active.reservedBy?.userId)}
                    className="px-3 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50"
                  >
                    Copy User ID
                  </button>
                  <a
                    href={`mailto:${active.reservedBy?.email}?subject=Your%20Bookfair%20Stall%20Reservation%20(${active.name})`}
                    className="px-3 py-2 text-sm rounded-lg bg-gray-900 text-white hover:bg-black"
                  >
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
              <button
                onClick={() => setActive(null)}
                className="px-4 py-2 rounded-xl text-sm font-semibold border border-gray-300 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

/*
=====================================
TESTS (Vitest + React Testing Library)
=====================================

Create a file: src/pages/Stalls.test.tsx

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Stalls from './Stalls';

// Minimal mock for clipboard
Object.assign(navigator, { clipboard: { writeText: vi.fn() } });

// Helper to render component (no Router required)
const setup = () => render(<Stalls />);

describe('Stalls Dashboard', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('renders loading then stalls grid', async () => {
    setup();
    expect(screen.getByText(/Loading stalls…/i)).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText('Stall A1')).toBeInTheDocument());
  });

  it('filters by Available tab', async () => {
    setup();
    await waitFor(() => screen.getByText('Stall A1'));
    fireEvent.click(screen.getByRole('button', { name: 'Available' }));
    // A reserved stall should not be visible when "Available" is active
    expect(screen.queryByText('Stall A3')).not.toBeInTheDocument();
  });

  it('searches by ID', async () => {
    setup();
    await waitFor(() => screen.getByText('Stall A1'));
    fireEvent.change(screen.getByPlaceholderText(/Search by stall name or ID/i), { target: { value: 'S-003' } });
    expect(screen.getByText('Stall A3')).toBeInTheDocument();
  });

  it('opens drawer and shows reserver details for reserved stall', async () => {
    setup();
    await waitFor(() => screen.getByText('Stall A3'));
    fireEvent.click(screen.getByText('Stall A3'));
    expect(await screen.findByText(/Reserver Details/i)).toBeInTheDocument();
    expect(screen.getByText('U-99120')).toBeInTheDocument();
  });

  it('toggles status from available → reserved', async () => {
    setup();
    await waitFor(() => screen.getByText('Stall A1'));
    fireEvent.click(screen.getByText('Stall A1'));
    const btn = await screen.findByRole('button', { name: 'Mark as Reserved' });
    fireEvent.click(btn);
    // Button text should flip after toggle
    await screen.findByRole('button', { name: 'Release Stall' });
  });

  it('navigation fallbacks do not throw without Router', async () => {
    // Ensure Back and Settings buttons exist and can be clicked without throwing
    setup();
    await waitFor(() => screen.getByText('Stall A1'));
    fireEvent.click(screen.getByRole('button', { name: '← Back' }));
    fireEvent.click(screen.getByRole('button', { name: 'Settings' }));
    expect(true).toBe(true);
  });
});

*/
