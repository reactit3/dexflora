"use client";
import React, { useState } from "react";
import { Copy, Zap, AlertCircle } from "lucide-react";
import { opX as h8 } from "@/app/actions/mod6";

interface a0 {
  id: string;
  name: string;
  url: string;
}

interface b0 {
  id: string;
  url: string;
  provider: a0;
  deployedAt: string;
  hexData: string;
}

export function LowLevel() {
  const [a1, b1] = useState<string>("");
  const [c1, d1] = useState<string>("surge");
  const [e1, f1] = useState<boolean>(false);
  const [g1, h1] = useState<b0 | null>(null);
  const [i1, j1] = useState<boolean>(false);
  const [k1, l1] = useState<string | null>(null);

  const m1: a0[] = [
    {
      id: "surge",
      name: "Surge",
      url: "surge.sh",
    },
  ];

  const n1 = (o1: string): boolean => {
    const p1 = o1.replace(/^0x/, "");
    return /^[0-9a-fA-F]+$/.test(p1) && p1.length > 0;
  };

  const q1 = async (): Promise<void> => {
    if (!a1.trim()) {
      alert("Input missing");
      return;
    }

    if (!n1(a1)) {
      alert("Invalid hex");
      return;
    }

    f1(true);
    l1(null);
    h1(null);

    try {
      const r1 = await h8(a1);

      if (r1.error || !r1.data) {
        l1(r1.error || "Fail");
        f1(false);
        return;
      }

      const s1 = r1.data;
      const t1 = m1.find((u1) => u1.id === c1);

      if (!t1) {
        l1("Provider?");
        f1(false);
        return;
      }

      const v1: b0 = {
        id: s1.name,
        url: s1.url,
        provider: t1,
        deployedAt: new Date().toISOString(),
        hexData: a1,
      };

      h1(v1);
    } catch (w1) {
      l1("Error");
      console.error("ERR:", w1);
    } finally {
      f1(false);
    }
  };

  const x1 = async (y1: string): Promise<void> => {
    await navigator.clipboard.writeText(y1);
    j1(true);
    setTimeout(() => j1(false), 2000);
  };

  return (
    <div className="p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h1
              className="text-[28px] sm:text-[32px] font-bold"
              style={{ color: "var(--color-dark)" }}
            >
              Low Level Interactions
            </h1>
          </div>
          <p className="text-[16px]" style={{ color: "#8e8e93" }}>
            Query dApps for running low-level call interactions on
            EVM-compatible blockchains
          </p>
        </div>

        {k1 && (
          <div className="mb-6 p-4 border border-red-200 rounded-xl bg-red-50">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700 font-medium">{k1}</span>
            </div>
          </div>
        )}

        <div
          className="border rounded-2xl p-6 shadow-sm"
          style={{ backgroundColor: "white", borderColor: "#e5e5e7" }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            <div className="space-y-4 h-full flex flex-col">
              <label
                className="block text-[16px] font-medium"
                style={{ color: "var(--color-dark)" }}
              >
                Call-data
              </label>
              <textarea
                value={a1}
                onChange={(e) => b1(e.target.value)}
                placeholder="Paste call-data in hex format"
                className="w-full flex-1 p-4 text-sm border rounded-xl outline-none transition-all duration-150 font-mono resize-none"
                style={{ borderColor: "#e5e5e7", color: "var(--color-dark)" }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--color-brand)";
                  e.target.style.boxShadow =
                    "0 0 0 2px rgba(39, 114, 245, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e5e5e7";
                  e.target.style.boxShadow = "none";
                }}
              />

              {a1 && (
                <div className="flex items-center gap-2">
                  {n1(a1) ? (
                    <div className="w-4 h-4 rounded-full bg-[#34C759]"></div>
                  ) : (
                    <AlertCircle className="w-4 h-4 text-[#FF3B30]" />
                  )}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <label
                  className="block text-[16px] font-medium"
                  style={{ color: "var(--color-dark)" }}
                >
                  Provider
                </label>
                <select
                  value={c1}
                  onChange={(e) => d1(e.target.value)}
                  className="w-full p-4 text-sm border rounded-xl outline-none transition-all duration-150"
                  style={{ borderColor: "#e5e5e7", color: "var(--color-dark)" }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "var(--color-brand)";
                    e.target.style.boxShadow =
                      "0 0 0 2px rgba(39, 114, 245, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e5e5e7";
                    e.target.style.boxShadow = "none";
                  }}
                >
                  {m1.map((z1) => (
                    <option key={z1.id} value={z1.id}>
                      {z1.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={q1}
                disabled={e1 || !a1.trim() || !n1(a1)}
                className="w-full p-4 bg-brand hover:bg-[#2062E5] disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer active:scale-95 text-[16px] font-medium"
              >
                {e1 ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating dApp...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    <span>Query</span>
                  </>
                )}
              </button>

              {g1 && (
                <div
                  className="border rounded-2xl p-6 shadow-sm"
                  style={{ backgroundColor: "white", borderColor: "#e5e5e7" }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <p
                      className="text-lg font-semibold"
                      style={{ color: "var(--color-dark)" }}
                    >
                      Hosted via {g1.provider.name}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: "var(--color-dark)" }}
                      >
                        Endpoint
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={g1.url}
                          readOnly
                          className="flex-1 p-3 border rounded-xl font-mono text-sm"
                          style={{
                            backgroundColor: "var(--color-light)",
                            borderColor: "#e5e5e7",
                            color: "var(--color-dark)",
                          }}
                        />
                      </div>
                    </div>

                    <div
                      className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl"
                      style={{ backgroundColor: "var(--color-light)" }}
                    >
                      <div>
                        <p
                          className="text-sm font-medium"
                          style={{ color: "var(--color-dark)" }}
                        >
                          UID
                        </p>
                        <p
                          className="text-sm font-mono"
                          style={{ color: "#8e8e93" }}
                        >
                          {g1.id}
                        </p>
                      </div>
                      <div>
                        <p
                          className="text-sm font-medium"
                          style={{ color: "var(--color-dark)" }}
                        >
                          Queried At
                        </p>
                        <p className="text-sm" style={{ color: "#8e8e93" }}>
                          {new Date(g1.deployedAt).toLocaleString()}
                        </p>
                        <p className="text-xs" style={{ color: "#8e8e93" }}>
                          All endpoints expire within 24 hours.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => x1(g1.url)}
                      className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors"
                      style={{
                        backgroundColor: "#ebf3ff",
                        color: "#0b57d0",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#D6E6FF";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#ebf3ff";
                      }}
                    >
                      <Copy className="w-4 h-4" />
                      Copy
                    </button>

                    {i1 && (
                      <p
                        className="text-sm font-medium"
                        style={{ color: "#34C759" }}
                      >
                        Copied to clipboard!
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm" style={{ color: "#8e8e93" }}>
          <p>Low-level calls</p>
        </div>
      </div>
    </div>
  );
}
