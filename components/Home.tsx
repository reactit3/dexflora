"use client";
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  Search,
  TrendingUp,
  Activity,
  Users,
  BarChart3,
  Globe,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Copy,
  ExternalLink,
  ArrowLeft,
} from "lucide-react";

interface BNBStats {
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
}

interface SearchResult {
  type: "address" | "transaction" | "block";
  value: string;
  isValid: boolean;
}

interface AddressInfo {
  address: string;
  balance: string;
  balanceUSD: number;
  transactionCount?: number;
  isContract?: boolean;
}

export function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [bnbStats, setBnbStats] = useState<BNBStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<AddressInfo | null>(
    null
  );
  const [addressLoading, setAddressLoading] = useState(false);
  const [view, setView] = useState<"home" | "address">("home");

  // Refs for managing intervals and preventing memory leaks
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastFetchTimeRef = useRef<number>(0);
  const mountTimeRef = useRef<number>(0);

  // Memoized currency formatter to avoid recreating on each render
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

  const formatBNBValue = useCallback((wei: string): string => {
    const bnbValue = parseFloat(wei) / Math.pow(10, 18);
    return bnbValue.toFixed(6);
  }, []);

  // Copy to clipboard function
  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, []);

  // Fetch address information
  const fetchAddressInfo = useCallback(
    async (address: string) => {
      setAddressLoading(true);
      try {
        // Note: You'll need to set NEXT_PUBLIC_BSC_API_KEY in your environment variables
        const apiKey = process.env.NEXT_PUBLIC_BSC_API_KEY;

        const balanceResponse = await fetch(
          `https://api.bscscan.com/api?module=account&action=balance&address=${address}&tag=latest&apikey=${apiKey}`
        );

        const balanceData = await balanceResponse.json();

        if (balanceData.status === "1") {
          const balanceInBNB = formatBNBValue(balanceData.result);
          const balanceUSD = bnbStats
            ? parseFloat(balanceInBNB) * bnbStats.price
            : 0;

          // Fetch transaction count
          const txCountResponse = await fetch(
            `https://api.bscscan.com/api?module=proxy&action=eth_getTransactionCount&address=${address}&tag=latest&apikey=${apiKey}`
          );
          const txCountData = await txCountResponse.json();
          const transactionCount = txCountData.result
            ? parseInt(txCountData.result, 16)
            : 0;

          setSelectedAddress({
            address,
            balance: balanceInBNB,
            balanceUSD,
            transactionCount,
            isContract: false, // You can add contract detection logic here
          });

          setView("address");
        } else {
          setError("Failed to fetch address information");
        }
      } catch (err) {
        console.error("Error fetching address info:", err);
        setError("Failed to fetch address information");
      } finally {
        setAddressLoading(false);
      }
    },
    [bnbStats, formatBNBValue]
  );

  // Memoized validation function to avoid recreating on each render
  const validateSearch = useCallback((query: string): SearchResult[] => {
    const results: SearchResult[] = [];
    const cleanQuery = query.trim();

    if (!cleanQuery) return results;

    // Check if it's an address (42 characters starting with 0x)
    if (/^0x[a-fA-F0-9]{40}$/.test(cleanQuery)) {
      results.push({
        type: "address",
        value: cleanQuery,
        isValid: true,
      });
    }

    // Check if it's a transaction hash (66 characters starting with 0x)
    if (/^0x[a-fA-F0-9]{64}$/.test(cleanQuery)) {
      results.push({
        type: "transaction",
        value: cleanQuery,
        isValid: true,
      });
    }

    // Check if it's a block number or hash
    if (/^\d+$/.test(cleanQuery) || /^0x[a-fA-F0-9]{64}$/.test(cleanQuery)) {
      results.push({
        type: "block",
        value: cleanQuery,
        isValid: true,
      });
    }

    return results;
  }, []);

  // Optimized fetch function with caching and rate limiting
  const fetchBNBData = useCallback(async (forceRefresh = false) => {
    const now = Date.now();
    const MIN_FETCH_INTERVAL = 25000; // 25 seconds minimum between requests

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
        {
          signal,
          headers: {
            Accept: "application/json",
          },
        }
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

  // Effect for initial data fetch and setting up interval
  useEffect(() => {
    mountTimeRef.current = Date.now();
    lastFetchTimeRef.current = 0;

    fetchBNBData(true);

    intervalRef.current = setInterval(() => fetchBNBData(false), 60000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchBNBData]);

  // Optimized search handler with debouncing-like behavior
  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchQuery(value);

      if (value.trim()) {
        const results = validateSearch(value);
        setSearchResults(results);
        setShowResults(true);
      } else {
        setShowResults(false);
        setSearchResults([]);
      }
    },
    [validateSearch]
  );

  const handleSearchSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (searchResults.length > 0 && searchResults[0].isValid) {
        const result = searchResults[0];

        if (result.type === "address") {
          fetchAddressInfo(result.value);
          setShowResults(false);
        } else {
          // For transactions and blocks, still redirect to BSCScan
          let url = "";
          switch (result.type) {
            case "transaction":
              url = `https://bscscan.com/tx/${result.value}`;
              break;
            case "block":
              url = `https://bscscan.com/block/${result.value}`;
              break;
          }
          if (url) {
            window.open(url, "_blank");
          }
        }
      }
    },
    [searchResults, fetchAddressInfo]
  );

  const getSearchIcon = useCallback((type: string) => {
    switch (type) {
      case "address":
        return <Users className="w-4 h-4" />;
      case "transaction":
        return <Activity className="w-4 h-4" />;
      case "block":
        return <BarChart3 className="w-4 h-4" />;
      default:
        return <Search className="w-4 h-4" />;
    }
  }, []);

  // Memoized search result click handler
  const handleSearchResultClick = useCallback(
    (result: SearchResult) => {
      if (result.type === "address") {
        fetchAddressInfo(result.value);
        setShowResults(false);
      } else {
        let url = "";
        switch (result.type) {
          case "transaction":
            url = `https://bscscan.com/tx/${result.value}`;
            break;
          case "block":
            url = `https://bscscan.com/block/${result.value}`;
            break;
        }
        if (url) window.open(url, "_blank");
      }
    },
    [fetchAddressInfo]
  );

  const handleBackToHome = useCallback(() => {
    setView("home");
    setSelectedAddress(null);
    setSearchQuery("");
    setError(null);
  }, []);

  if (loading && !bnbStats) {
    return (
      <div className="min-h-screen p-4 pt-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg" style={{ color: "#8e8e93" }}>
              Loading BNB Chain data...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Address View
  if (view === "address" && selectedAddress) {
    return (
      <div className="min-h-screen p-4 pt-20">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <button
            onClick={handleBackToHome}
            className="flex items-center gap-2 mb-6 text-[16px] hover:opacity-70 transition-opacity"
            style={{ color: "var(--color-brand)" }}
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Explorer
          </button>

          {/* Address Header */}
          <div
            className="border rounded-2xl p-6 mb-6 shadow-sm"
            style={{ backgroundColor: "white", borderColor: "#e5e5e7" }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#ebf3ff] flex items-center justify-center">
                <Wallet
                  className="w-6 h-6"
                  style={{ color: "var(--color-brand)" }}
                />
              </div>
              <div>
                <h1
                  className="text-[24px] font-bold"
                  style={{ color: "var(--color-dark)" }}
                >
                  Address Details
                </h1>
                <p className="text-[14px]" style={{ color: "#8e8e93" }}>
                  BSC Address Information
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-50">
              <span
                className="text-[14px] font-mono flex-1 break-all"
                style={{ color: "var(--color-dark)" }}
              >
                {selectedAddress.address}
              </span>
              <button
                onClick={() => copyToClipboard(selectedAddress.address)}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                title="Copy address"
              >
                <Copy className="w-4 h-4" style={{ color: "#8e8e93" }} />
              </button>
              <a
                href={`https://bscscan.com/address/${selectedAddress.address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                title="View on BSCScan"
              >
                <ExternalLink
                  className="w-4 h-4"
                  style={{ color: "#8e8e93" }}
                />
              </a>
            </div>
          </div>

          {/* Balance Information */}
          <div
            className="border rounded-2xl p-6 mb-6 shadow-sm"
            style={{ backgroundColor: "white", borderColor: "#e5e5e7" }}
          >
            <h2
              className="text-[20px] font-bold mb-6"
              style={{ color: "var(--color-dark)" }}
            >
              Balance
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-[14px] mb-2" style={{ color: "#8e8e93" }}>
                  BNB Balance
                </p>
                <div className="flex items-center gap-2">
                  <span
                    className="text-[28px] font-bold"
                    style={{ color: "var(--color-dark)" }}
                  >
                    {selectedAddress.balance}
                  </span>
                  <span
                    className="text-[16px] font-medium"
                    style={{ color: "var(--color-brand)" }}
                  >
                    BNB
                  </span>
                </div>
              </div>

              <div>
                <p className="text-[14px] mb-2" style={{ color: "#8e8e93" }}>
                  USD Value
                </p>
                <span
                  className="text-[28px] font-bold"
                  style={{ color: "var(--color-dark)" }}
                >
                  {formatCurrencyValue(selectedAddress.balanceUSD)}
                </span>
              </div>
            </div>
          </div>

          {/* Account Statistics */}
          <div
            className="border rounded-2xl p-6 shadow-sm"
            style={{ backgroundColor: "white", borderColor: "#e5e5e7" }}
          >
            <h2
              className="text-[20px] font-bold mb-6"
              style={{ color: "var(--color-dark)" }}
            >
              Account Statistics
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 rounded-xl bg-gray-50">
                <p className="text-[14px] mb-2" style={{ color: "#8e8e93" }}>
                  Total Transactions
                </p>
                <span
                  className="text-[24px] font-bold"
                  style={{ color: "var(--color-dark)" }}
                >
                  {selectedAddress.transactionCount?.toLocaleString() || "0"}
                </span>
              </div>

              <div className="text-center p-4 rounded-xl bg-gray-50">
                <p className="text-[14px] mb-2" style={{ color: "#8e8e93" }}>
                  Account Type
                </p>
                <span
                  className="text-[18px] font-medium"
                  style={{ color: "var(--color-dark)" }}
                >
                  {selectedAddress.isContract ? "Contract" : "Wallet"}
                </span>
              </div>

              <div className="text-center p-4 rounded-xl bg-gray-50">
                <p className="text-[14px] mb-2" style={{ color: "#8e8e93" }}>
                  Chain
                </p>
                <span
                  className="text-[18px] font-medium"
                  style={{ color: "var(--color-brand)" }}
                >
                  BSC
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Home View
  return (
    <div className="min-h-screen p-4 pt-20">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1
            className="text-[28px] sm:text-[32px] font-bold mb-4"
            style={{ color: "var(--color-dark)" }}
          >
            BNB Smart Chain Explorer
          </h1>
          <p className="text-[18px] mb-8" style={{ color: "#8e8e93" }}>
            Search addresses, transactions, and blocks on the BNB Smart Chain
          </p>

          {/* Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="relative max-w-2xl mx-auto mb-8"
          >
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search by Address / Txn Hash / Block"
                className="w-full p-4 pl-12 pr-4 text-[16px] border rounded-2xl outline-none transition-all duration-150"
                style={{
                  borderColor: "#e5e5e7",
                  color: "var(--color-dark)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--color-brand)";
                  e.target.style.boxShadow =
                    "0 0 0 2px rgba(39, 114, 245, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e5e5e7";
                  e.target.style.boxShadow = "none";
                  setTimeout(() => setShowResults(false), 200);
                }}
              />
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5"
                style={{ color: "#8e8e93" }}
              />
              {addressLoading && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-5 h-5 border-2 border-brand border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>

            {/* Search Results Dropdown */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-lg border border-gray-100 z-50">
                {searchResults.map((result, index) => (
                  <button
                    key={index}
                    className="w-full p-4 flex items-center gap-3 hover:bg-light transition-all duration-150 first:rounded-t-2xl last:rounded-b-2xl"
                    onClick={() => handleSearchResultClick(result)}
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#ebf3ff] flex items-center justify-center text-brand">
                      {getSearchIcon(result.type)}
                    </div>
                    <div className="flex-1 text-left">
                      <p
                        className="text-[14px] font-medium capitalize"
                        style={{ color: "var(--color-dark)" }}
                      >
                        {result.type}
                      </p>
                      <p
                        className="text-[12px] font-mono"
                        style={{ color: "#8e8e93" }}
                      >
                        {result.value}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </form>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 p-4 border border-red-200 rounded-xl bg-red-50 text-center">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* BNB Stats */}
        {bnbStats && (
          <>
            {/* Price Section */}
            <div
              className="border rounded-2xl p-6 mb-8 shadow-sm"
              style={{ backgroundColor: "white", borderColor: "#e5e5e7" }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2
                  className="text-[24px] font-bold"
                  style={{ color: "var(--color-dark)" }}
                >
                  BNB Price
                </h2>
                <div className="flex items-center gap-2">
                  <Globe
                    className="w-5 h-5"
                    style={{ color: "var(--color-brand)" }}
                  />
                  <span className="text-[14px]" style={{ color: "#8e8e93" }}>
                    Live Data
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center md:text-left">
                  <p className="text-[14px] mb-2" style={{ color: "#8e8e93" }}>
                    Current Price
                  </p>
                  <div className="flex items-center gap-3 justify-center md:justify-start">
                    <span
                      className="text-[32px] font-bold"
                      style={{ color: "var(--color-dark)" }}
                    >
                      {formatCurrencyValue(bnbStats.price)}
                    </span>
                    <div
                      className={`flex items-center gap-1 px-3 py-1 rounded-lg ${
                        bnbStats.change24h >= 0 ? "bg-green-100" : "bg-red-100"
                      }`}
                    >
                      {bnbStats.change24h >= 0 ? (
                        <ArrowUpRight className="w-4 h-4 text-green-600" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-600" />
                      )}
                      <span
                        className={`text-[14px] font-medium ${
                          bnbStats.change24h >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {Math.abs(bnbStats.change24h).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-[14px] mb-2" style={{ color: "#8e8e93" }}>
                    Market Cap
                  </p>
                  <span
                    className="text-[24px] font-bold"
                    style={{ color: "var(--color-dark)" }}
                  >
                    {formatCurrencyValue(bnbStats.marketCap)}
                  </span>
                </div>

                <div className="text-center md:text-right">
                  <p className="text-[14px] mb-2" style={{ color: "#8e8e93" }}>
                    24h Volume
                  </p>
                  <span
                    className="text-[24px] font-bold"
                    style={{ color: "var(--color-dark)" }}
                  >
                    {formatCurrencyValue(bnbStats.volume24h)}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Quick Actions */}
        <div
          className="border rounded-2xl p-6 shadow-sm"
          style={{ backgroundColor: "white", borderColor: "#e5e5e7" }}
        >
          <h3
            className="text-[20px] font-bold mb-6"
            style={{ color: "var(--color-dark)" }}
          >
            Quick Actions
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="https://bscscan.com/tokens"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 border rounded-xl transition-all duration-150 hover:bg-light group"
              style={{ borderColor: "#e5e5e7" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#ebf3ff] group-hover:bg-brand group-hover:text-white flex items-center justify-center transition-all duration-150">
                  <BarChart3 className="w-5 h-5 text-brand group-hover:text-white" />
                </div>
                <div>
                  <p
                    className="text-[14px] font-medium"
                    style={{ color: "var(--color-dark)" }}
                  >
                    View Tokens
                  </p>
                  <p className="text-[12px]" style={{ color: "#8e8e93" }}>
                    Browse BEP-20 tokens
                  </p>
                </div>
              </div>
            </a>

            <a
              href="https://bscscan.com/validators"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 border rounded-xl transition-all duration-150 hover:bg-light group"
              style={{ borderColor: "#e5e5e7" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#ebf3ff] group-hover:bg-brand group-hover:text-white flex items-center justify-center transition-all duration-150">
                  <Users className="w-5 h-5 text-brand group-hover:text-white" />
                </div>
                <div>
                  <p
                    className="text-[14px] font-medium"
                    style={{ color: "var(--color-dark)" }}
                  >
                    Validators
                  </p>
                  <p className="text-[12px]" style={{ color: "#8e8e93" }}>
                    Network validators
                  </p>
                </div>
              </div>
            </a>

            <a
              href="https://bscscan.com/charts"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 border rounded-xl transition-all duration-150 hover:bg-light group"
              style={{ borderColor: "#e5e5e7" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#ebf3ff] group-hover:bg-brand group-hover:text-white flex items-center justify-center transition-all duration-150">
                  <TrendingUp className="w-5 h-5 text-brand group-hover:text-white" />
                </div>
                <div>
                  <p
                    className="text-[14px] font-medium"
                    style={{ color: "var(--color-dark)" }}
                  >
                    Charts
                  </p>
                  <p className="text-[12px]" style={{ color: "#8e8e93" }}>
                    Network analytics
                  </p>
                </div>
              </div>
            </a>
          </div>
        </div>

        {/* Footer Info */}
        <div
          className="mt-8 text-center text-[14px]"
          style={{ color: "#8e8e93" }}
        >
          <p>Data updates every 60 seconds</p>
        </div>
      </div>
    </div>
  );
}
