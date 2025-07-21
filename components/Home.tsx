"use client";
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  TrendingUp,
  Users,
  BarChart3,
  Globe,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

interface BNBStats {
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
}


export function Home() {
  const [bnbStats, setBnbStats] = useState<BNBStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastFetchTimeRef = useRef<number>(0);
  const mountTimeRef = useRef<number>(0);

  const formatCurrency = useMemo(() => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }, []);

  const formatCurrencyValue = useCallback(
    (num: number): string => {
      return formatCurrency.format(num);
    },
    [formatCurrency]
  );


  const fetchBNBData = useCallback(async (forceRefresh = false) => {
    const now = Date.now();
    const MIN_FETCH_INTERVAL = 25000;

    if (!forceRefresh && now - lastFetchTimeRef.current < MIN_FETCH_INTERVAL) {
      return;
    }

    try {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();
      const { signal } = abortControllerRef.current;

      setLoading(true);
      lastFetchTimeRef.current = now;

      const cacheParam = Math.floor(now / MIN_FETCH_INTERVAL);

      const priceResponse = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true&_=${cacheParam}`,
        { signal, headers: { Accept: "application/json" } }
      );

      if (!priceResponse.ok) {
        throw new Error(`HTTP error! status: ${priceResponse.status}`);
      }

      const priceData = await priceResponse.json();
      const bnbPrice = priceData.binancecoin;

      if (!bnbPrice) {
        throw new Error("Invalid response data");
      }

      setBnbStats({
        price: bnbPrice.usd,
        change24h: bnbPrice.usd_24h_change,
        marketCap: bnbPrice.usd_market_cap,
        volume24h: bnbPrice.usd_24h_vol,
      });

      setError(null);
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setError("Failed to fetch BNB data");
        console.error("Error fetching BNB data:", err);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    mountTimeRef.current = Date.now();
    lastFetchTimeRef.current = 0;
    fetchBNBData(true);
    intervalRef.current = setInterval(() => fetchBNBData(false), 60000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [fetchBNBData]);




  if (loading && !bnbStats) {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-20">
            <div
              className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
              style={{ borderColor: "var(--color-brand)" }}
            ></div>
            <p className="text-lg" style={{ color: "#8e8e93" }}>
              Loading BNB Chain data...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Home View
  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {bnbStats && (
          <div
            className="border rounded-2xl p-4 sm:p-6 mb-8 shadow-sm"
            style={{
              backgroundColor: "white",
              borderColor: "#e5e5e7",
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h2
                className="text-2xl font-bold"
                style={{ color: "var(--color-dark)" }}
              >
                BNB Price
              </h2>
              <div className="flex items-center gap-2">
                <Globe
                  className="w-5 h-5"
                  style={{ color: "var(--color-brand)" }}
                />
                <span className="text-sm" style={{ color: "#8e8e93" }}>
                  Live Data
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="text-center sm:text-left">
                <p className="text-sm mb-2" style={{ color: "#8e8e93" }}>
                  Current Price
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-3 justify-center sm:justify-start">
                  <span
                    className="text-2xl sm:text-3xl font-bold"
                    style={{ color: "var(--color-dark)" }}
                  >
                    {formatCurrencyValue(bnbStats.price)}
                  </span>
                  <div
                    className="flex items-center gap-1 px-3 py-1 rounded-lg"
                    style={{
                      backgroundColor:
                        bnbStats.change24h >= 0 ? "#e6f7e6" : "#ffe6e6",
                    }}
                  >
                    {bnbStats.change24h >= 0 ? (
                      <ArrowUpRight
                        className="w-4 h-4"
                        style={{ color: "#34C759" }}
                      />
                    ) : (
                      <ArrowDownRight
                        className="w-4 h-4"
                        style={{ color: "#d70015" }}
                      />
                    )}
                    <span
                      className="text-sm font-medium"
                      style={{
                        color: bnbStats.change24h >= 0 ? "#34C759" : "#d70015",
                      }}
                    >
                      {Math.abs(bnbStats.change24h).toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm mb-2" style={{ color: "#8e8e93" }}>
                  Market Cap
                </p>
                <span
                  className="text-xl sm:text-2xl font-bold break-all"
                  style={{ color: "var(--color-dark)" }}
                >
                  {formatCurrencyValue(bnbStats.marketCap)}
                </span>
              </div>

              <div className="text-center sm:text-right">
                <p className="text-sm mb-2" style={{ color: "#8e8e93" }}>
                  24h Volume
                </p>
                <span
                  className="text-xl sm:text-2xl font-bold break-all"
                  style={{ color: "var(--color-dark)" }}
                >
                  {formatCurrencyValue(bnbStats.volume24h)}
                </span>
              </div>
            </div>
          </div>
        )}

        <div
          className="border rounded-2xl p-4 sm:p-6 shadow-sm"
          style={{
            backgroundColor: "white",
            borderColor: "#e5e5e7",
          }}
        >
          <h3
            className="text-xl font-bold mb-6"
            style={{ color: "var(--color-dark)" }}
          >
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                href: "https://bscscan.com/tokens",
                icon: BarChart3,
                title: "View Tokens",
                desc: "Browse BEP-20 tokens",
              },
              {
                href: "https://bscscan.com/validators",
                icon: Users,
                title: "Validators",
                desc: "Network validators",
              },
              {
                href: "https://bscscan.com/charts",
                icon: TrendingUp,
                title: "Charts",
                desc: "Network analytics",
              },
            ].map((item, index) => (
              <a
                key={index}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 border rounded-xl transition-colors group"
                style={{ borderColor: "#e5e5e7" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--color-light)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl group-hover:bg-blue-600 flex items-center justify-center transition-colors"
                    style={{ backgroundColor: "#ebf3ff" }}
                  >
                    <item.icon
                      className="w-5 h-5 group-hover:text-white transition-colors"
                      style={{ color: "var(--color-brand)" }}
                    />
                  </div>
                  <div className="min-w-0">
                    <p
                      className="text-sm font-medium"
                      style={{ color: "var(--color-dark)" }}
                    >
                      {item.title}
                    </p>
                    <p className="text-xs" style={{ color: "#8e8e93" }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center text-sm" style={{ color: "#8e8e93" }}>
          <p>Data updates every 60 seconds</p>
        </div>
      </div>
    </div>
  );
}
