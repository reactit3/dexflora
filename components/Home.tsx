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
  ChevronDown,
  ChevronUp,
  Clock,
  Send,
  Download,
  Coins,
} from "lucide-react";

// ... (keep existing interfaces)

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

interface Transaction {
  hash: string;
  blockNumber: string;
  timeStamp: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  isError: string;
  txreceipt_status: string;
  input: string;
  methodId: string;
  functionName: string;
  tokenSymbol?: string;
  tokenName?: string;
  type?: "normal" | "internal" | "token";
}

interface AddressInfo {
  address: string;
  balance: string;
  balanceUSD: number;
  transactionCount?: number;
  isContract?: boolean;
  transactions?: Transaction[];
  transactionsLoading?: boolean;
  hasMoreTransactions?: boolean;
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
  const [showTransactions, setShowTransactions] = useState(false);
  const [transactionPage, setTransactionPage] = useState(1);
  const [transactionType, setTransactionType] = useState<
    "all" | "normal" | "internal" | "token"
  >("all");

  // ... (keep existing refs and formatters)
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

  const formatBNBValue = useCallback((wei: string): string => {
    const bnbValue = parseFloat(wei) / Math.pow(10, 18);
    return bnbValue.toFixed(6);
  }, []);

  const formatTimestamp = useCallback((timestamp: string): string => {
    const date = new Date(parseInt(timestamp) * 1000);
    return date.toLocaleString();
  }, []);

  const shortenAddress = useCallback((address: string): string => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, []);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, []);

  // Enhanced fetch transactions function
  const fetchTransactions = useCallback(
    async (address: string, page: number = 1, type: string = "all") => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_BSC_API_KEY; // Replace with actual API key
        const offset = 10;

        setSelectedAddress((prev) =>
          prev ? { ...prev, transactionsLoading: true } : null
        );

        let allTransactions: Transaction[] = [];

        // Fetch different types of transactions based on selection
        if (type === "all" || type === "normal") {
          try {
            const normalResponse = await fetch(
              `https://api.bscscan.com/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=${page}&offset=${offset}&sort=desc&apikey=${apiKey}`
            );
            const normalData = await normalResponse.json();
            if (normalData.status === "1" && normalData.result) {
              const normalTxs = normalData.result.map((tx: Transaction) => ({
                ...tx,
                type: "normal",
              }));
              allTransactions = [...allTransactions, ...normalTxs];
            }
          } catch (err) {
            console.error("Error fetching normal transactions:", err);
          }
        }

        if (type === "all" || type === "internal") {
          try {
            const internalResponse = await fetch(
              `https://api.bscscan.com/api?module=account&action=txlistinternal&address=${address}&startblock=0&endblock=99999999&page=${page}&offset=${offset}&sort=desc&apikey=${apiKey}`
            );
            const internalData = await internalResponse.json();
            if (internalData.status === "1" && internalData.result) {
              const internalTxs = internalData.result.map(
                (tx: Transaction) => ({ ...tx, type: "internal" })
              );
              allTransactions = [...allTransactions, ...internalTxs];
            }
          } catch (err) {
            console.error("Error fetching internal transactions:", err);
          }
        }

        if (type === "all" || type === "token") {
          try {
            const tokenResponse = await fetch(
              `https://api.bscscan.com/api?module=account&action=tokentx&address=${address}&startblock=0&endblock=99999999&page=${page}&offset=${offset}&sort=desc&apikey=${apiKey}`
            );
            const tokenData = await tokenResponse.json();
            if (tokenData.status === "1" && tokenData.result) {
              const tokenTxs = tokenData.result.map((tx: Transaction) => ({
                ...tx,
                type: "token",
              }));
              allTransactions = [...allTransactions, ...tokenTxs];
            }
          } catch (err) {
            console.error("Error fetching token transactions:", err);
          }
        }

        // Sort all transactions by timestamp
        allTransactions.sort(
          (a, b) => parseInt(b.timeStamp) - parseInt(a.timeStamp)
        );

        // Take only the requested number of transactions
        const limitedTransactions = allTransactions.slice(0, offset);

        setSelectedAddress((prev) => {
          if (!prev) return null;

          const newTransactions =
            page === 1
              ? limitedTransactions
              : [...(prev.transactions || []), ...limitedTransactions];

          return {
            ...prev,
            transactions: newTransactions,
            transactionsLoading: false,
            hasMoreTransactions: limitedTransactions.length === offset,
          };
        });
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setSelectedAddress((prev) =>
          prev
            ? {
                ...prev,
                transactionsLoading: false,
                hasMoreTransactions: false,
              }
            : null
        );
      }
    },
    []
  );

  // ... (keep existing fetchAddressInfo function but update the transaction fetching part)
  const fetchAddressInfo = useCallback(
    async (address: string) => {
      setAddressLoading(true);
      try {
        const apiKey = process.env.NEXT_PUBLIC_BSC_API_KEY; // Replace with actual API key

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
            isContract: false,
            transactions: [],
            transactionsLoading: false,
            hasMoreTransactions: true,
          });

          setView("address");

          // Auto-fetch first page of transactions
          fetchTransactions(address, 1, "all");
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
    [bnbStats, formatBNBValue, fetchTransactions]
  );

  // ... (keep all other existing functions)

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

  // ... (keep existing validation and search functions)

  const validateSearch = useCallback((query: string): SearchResult[] => {
    const results: SearchResult[] = [];
    const cleanQuery = query.trim();

    if (!cleanQuery) return results;

    if (/^0x[a-fA-F0-9]{40}$/.test(cleanQuery)) {
      results.push({ type: "address", value: cleanQuery, isValid: true });
    }

    if (/^0x[a-fA-F0-9]{64}$/.test(cleanQuery)) {
      results.push({ type: "transaction", value: cleanQuery, isValid: true });
    }

    if (/^\d+$/.test(cleanQuery) || /^0x[a-fA-F0-9]{64}$/.test(cleanQuery)) {
      results.push({ type: "block", value: cleanQuery, isValid: true });
    }

    return results;
  }, []);

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
    setShowTransactions(false);
    setTransactionPage(1);
  }, []);

  const handleLoadMoreTransactions = useCallback(() => {
    if (
      selectedAddress &&
      !selectedAddress.transactionsLoading &&
      selectedAddress.hasMoreTransactions
    ) {
      const nextPage = transactionPage + 1;
      setTransactionPage(nextPage);
      fetchTransactions(selectedAddress.address, nextPage, transactionType);
    }
  }, [selectedAddress, transactionPage, transactionType, fetchTransactions]);

  const toggleTransactions = useCallback(() => {
    setShowTransactions((prev) => !prev);
  }, []);

  const handleTransactionTypeChange = useCallback(
    (newType: "all" | "normal" | "internal" | "token") => {
      setTransactionType(newType);
      setTransactionPage(1);
      if (selectedAddress) {
        fetchTransactions(selectedAddress.address, 1, newType);
      }
    },
    [selectedAddress, fetchTransactions]
  );

  const getTransactionIcon = useCallback(
    (tx: Transaction) => {
      if (tx.type === "token") {
        return (
          <Coins className="w-5 h-5" style={{ color: "var(--color-brand)" }} />
        );
      }

      if (
        selectedAddress &&
        tx.from.toLowerCase() === selectedAddress.address.toLowerCase()
      ) {
        return (
          <Send className="w-5 h-5" style={{ color: "var(--color-brand)" }} />
        );
      } else {
        return (
          <Download
            className="w-5 h-5"
            style={{ color: "var(--color-brand)" }}
          />
        );
      }
    },
    [selectedAddress]
  );

  if (loading && !bnbStats) {
    return (
      <div className="min-h-screen p-4 pt-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Loading BNB Chain data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Address View
  if (view === "address" && selectedAddress) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 pt-20">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={handleBackToHome}
            className="flex items-center gap-2 mb-6 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Explorer
          </button>

          {/* Address Header */}
          <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Address Details
                </h1>
                <p className="text-sm text-gray-600">BSC Address Information</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-50">
              <span className="text-sm font-mono flex-1 break-all text-gray-900">
                {selectedAddress.address}
              </span>
              <button
                onClick={() => copyToClipboard(selectedAddress.address)}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                title="Copy address"
              >
                <Copy className="w-4 h-4 text-gray-600" />
              </button>
              <a
                href={`https://bscscan.com/address/${selectedAddress.address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                title="View on BSCScan"
              >
                <ExternalLink className="w-4 h-4 text-gray-600" />
              </a>
            </div>
          </div>

          {/* Balance Information */}
          <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border">
            <h2 className="text-xl font-bold mb-6 text-gray-900">Balance</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm mb-2 text-gray-600">BNB Balance</p>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-gray-900">
                    {selectedAddress.balance}
                  </span>
                  <span className="text-lg font-medium text-blue-600">BNB</span>
                </div>
              </div>
              <div>
                <p className="text-sm mb-2 text-gray-600">USD Value</p>
                <span className="text-3xl font-bold text-gray-900">
                  {formatCurrencyValue(selectedAddress.balanceUSD)}
                </span>
              </div>
            </div>
          </div>

          {/* Account Statistics */}
          <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border">
            <h2 className="text-xl font-bold mb-6 text-gray-900">
              Account Statistics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 rounded-xl bg-gray-50">
                <p className="text-sm mb-2 text-gray-600">Total Transactions</p>
                <span className="text-2xl font-bold text-gray-900">
                  {selectedAddress.transactionCount?.toLocaleString() || "0"}
                </span>
              </div>
              <div className="text-center p-4 rounded-xl bg-gray-50">
                <p className="text-sm mb-2 text-gray-600">Account Type</p>
                <span className="text-lg font-medium text-gray-900">
                  {selectedAddress.isContract ? "Contract" : "Wallet"}
                </span>
              </div>
              <div className="text-center p-4 rounded-xl bg-gray-50">
                <p className="text-sm mb-2 text-gray-600">Chain</p>
                <span className="text-lg font-medium text-blue-600">BSC</span>
              </div>
            </div>
          </div>

          {/* Transactions Section */}
          {selectedAddress.transactionCount &&
            selectedAddress.transactionCount > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Transaction History
                  </h2>
                  <button
                    onClick={toggleTransactions}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    <Activity className="w-5 h-5" />
                    <span className="text-sm font-medium">
                      {showTransactions ? "Hide" : "Show"} Transactions
                    </span>
                    {showTransactions ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {showTransactions && (
                  <div className="space-y-4">
                    {/* Transaction Type Filter */}
                    <div className="flex gap-2 mb-4">
                      {[
                        { key: "all", label: "All" },
                        { key: "normal", label: "Normal" },
                        { key: "internal", label: "Internal" },
                        { key: "token", label: "Token" },
                      ].map((type) => (
                        <button
                          key={type.key}
                          onClick={() =>
                            handleTransactionTypeChange(type.key as any)
                          }
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                            transactionType === type.key
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>

                    {selectedAddress.transactions &&
                    selectedAddress.transactions.length > 0 ? (
                      <>
                        {selectedAddress.transactions.map((tx, index) => (
                          <div
                            key={tx.hash}
                            className="border rounded-xl p-4 hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                                  {getTransactionIcon(tx)}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-900">
                                      {tx.type === "token"
                                        ? `Token ${
                                            tx.tokenSymbol || "Transfer"
                                          }`
                                        : tx.type === "internal"
                                        ? "Internal Transaction"
                                        : selectedAddress &&
                                          tx.from.toLowerCase() ===
                                            selectedAddress.address.toLowerCase()
                                        ? "Sent"
                                        : "Received"}
                                    </span>
                                    <span
                                      className={`px-2 py-1 rounded-lg text-xs font-medium ${
                                        tx.txreceipt_status === "1"
                                          ? "bg-green-100 text-green-700"
                                          : "bg-red-100 text-red-700"
                                      }`}
                                    >
                                      {tx.txreceipt_status === "1"
                                        ? "Success"
                                        : "Failed"}
                                    </span>
                                    <span className="px-2 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-700 capitalize">
                                      {tx.type}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1 mt-1">
                                    <Clock className="w-3 h-3 text-gray-500" />
                                    <span className="text-xs text-gray-500">
                                      {formatTimestamp(tx.timeStamp)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold text-gray-900">
                                  {tx.type === "token"
                                    ? `${(
                                        parseFloat(tx.value) / Math.pow(10, 18)
                                      ).toFixed(6)} ${
                                        tx.tokenSymbol || "Tokens"
                                      }`
                                    : `${formatBNBValue(tx.value)} BNB`}
                                </p>
                                {bnbStats && tx.type !== "token" && (
                                  <p className="text-xs text-gray-500">
                                    {formatCurrencyValue(
                                      parseFloat(formatBNBValue(tx.value)) *
                                        bnbStats.price
                                    )}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                              <div>
                                <p className="mb-1 text-gray-500">From:</p>
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-gray-900">
                                    {shortenAddress(tx.from)}
                                  </span>
                                  <button
                                    onClick={() => copyToClipboard(tx.from)}
                                    className="hover:bg-gray-200 p-1 rounded"
                                  >
                                    <Copy className="w-3 h-3 text-gray-500" />
                                  </button>
                                </div>
                              </div>
                              <div>
                                <p className="mb-1 text-gray-500">To:</p>
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-gray-900">
                                    {shortenAddress(tx.to)}
                                  </span>
                                  <button
                                    onClick={() => copyToClipboard(tx.to)}
                                    className="hover:bg-gray-200 p-1 rounded"
                                  >
                                    <Copy className="w-3 h-3 text-gray-500" />
                                  </button>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between mt-3 pt-3 border-t">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-mono text-gray-500">
                                  {shortenAddress(tx.hash)}
                                </span>
                                <button
                                  onClick={() => copyToClipboard(tx.hash)}
                                  className="hover:bg-gray-200 p-1 rounded"
                                >
                                  <Copy className="w-3 h-3 text-gray-500" />
                                </button>
                              </div>
                              <a
                                href={`https://bscscan.com/tx/${tx.hash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
                              >
                                View Details
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </div>
                        ))}

                        {selectedAddress.hasMoreTransactions && (
                          <div className="text-center pt-4">
                            <button
                              onClick={handleLoadMoreTransactions}
                              disabled={selectedAddress.transactionsLoading}
                              className="px-6 py-3 rounded-xl border border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-50"
                            >
                              {selectedAddress.transactionsLoading ? (
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                  Loading...
                                </div>
                              ) : (
                                "Load More Transactions"
                              )}
                            </button>
                          </div>
                        )}
                      </>
                    ) : selectedAddress.transactionsLoading ? (
                      <div className="text-center py-8">
                        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-sm text-gray-500">
                          Loading transactions...
                        </p>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-sm text-gray-500">
                          No{" "}
                          {transactionType === "all"
                            ? ""
                            : transactionType + " "}
                          transactions found for this address.
                        </p>
                        {transactionType !== "all" && (
                          <button
                            onClick={() => handleTransactionTypeChange("all")}
                            className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                          >
                            Try viewing all transaction types
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
        </div>
      </div>
    );
  }

  // Home View (simplified version)
  return (
    <div className="min-h-screen bg-gray-50 p-4 pt-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4 text-gray-900">
            BNB Smart Chain Explorer
          </h1>
          <p className="text-lg mb-8 text-gray-600">
            Search addresses, transactions, and blocks on the BNB Smart Chain
          </p>

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
                className="w-full p-4 pl-12 pr-4 text-base border rounded-2xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              {addressLoading && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>

            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-lg border z-50">
                {searchResults.map((result, index) => (
                  <button
                    key={index}
                    className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors first:rounded-t-2xl last:rounded-b-2xl"
                    onClick={() => handleSearchResultClick(result)}
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                      {getSearchIcon(result.type)}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium capitalize text-gray-900">
                        {result.type}
                      </p>
                      <p className="text-xs font-mono text-gray-500">
                        {result.value}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </form>
        </div>

        {error && (
          <div className="mb-8 p-4 border border-red-200 rounded-xl bg-red-50 text-center">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {bnbStats && (
          <div className="bg-white rounded-xl p-6 mb-8 shadow-sm border">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">BNB Price</h2>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-600">Live Data</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center md:text-left">
                <p className="text-sm mb-2 text-gray-600">Current Price</p>
                <div className="flex items-center gap-3 justify-center md:justify-start">
                  <span className="text-3xl font-bold text-gray-900">
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
                      className={`text-sm font-medium ${
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
                <p className="text-sm mb-2 text-gray-600">Market Cap</p>
                <span className="text-2xl font-bold text-gray-900">
                  {formatCurrencyValue(bnbStats.marketCap)}
                </span>
              </div>

              <div className="text-center md:text-right">
                <p className="text-sm mb-2 text-gray-600">24h Volume</p>
                <span className="text-2xl font-bold text-gray-900">
                  {formatCurrencyValue(bnbStats.volume24h)}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="text-xl font-bold mb-6 text-gray-900">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                className="p-4 border rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 group-hover:bg-blue-600 flex items-center justify-center transition-colors">
                    <item.icon className="w-5 h-5 text-blue-600 group-hover:text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-600">{item.desc}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Data updates every 60 seconds</p>
        </div>
      </div>
    </div>
  );
}
