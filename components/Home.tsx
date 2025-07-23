"use client";
import React, { useState } from "react";
import { Send, Copy, Link, ChevronDown, ChevronUp } from "lucide-react";

interface QuickExample {
  label: string;
  method: string;
  params: string;
}

interface RpcPayload {
  jsonrpc: string;
  method: string;
  params: unknown[];
  id: number;
}

export function Home() {
  const [rpcMethod, setRpcMethod] = useState<string>("");
  const [rpcParams, setRpcParams] = useState<string>("");
  const [rpcResponse, setRpcResponse] = useState<string>("{}");
  const [copied, setCopied] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [showFullResponse, setShowFullResponse] = useState<boolean>(false);

  const rpcUrl = "https://bsc-dataseed.binance.org/";
  const MAX_PREVIEW_LENGTH = 500;

  const sendRpcRequest = async (): Promise<void> => {
    if (!rpcMethod.trim()) {
      setRpcResponse(
        JSON.stringify({ error: "RPC Method is required" }, null, 2)
      );
      return;
    }

    setLoading(true);
    let params: unknown[];

    try {
      params = rpcParams.trim() ? JSON.parse(rpcParams) : [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setRpcResponse(
        JSON.stringify(
          { error: `Invalid JSON in parameters: ${errorMessage}` },
          null,
          2
        )
      );
      setLoading(false);
      return;
    }

    const payload: RpcPayload = {
      jsonrpc: "2.0",
      method: rpcMethod,
      params: params,
      id: Date.now(),
    };

    try {
      const response = await fetch(rpcUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      setRpcResponse(JSON.stringify(data, null, 2));
      setShowFullResponse(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setRpcResponse(JSON.stringify({ error: errorMessage }, null, 2));
    }

    setLoading(false);
  };

  const handleCopy = async (): Promise<void> => {
    if (!rpcResponse || rpcResponse === "{}") return;

    try {
      await navigator.clipboard.writeText(rpcResponse);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      const textArea = document.createElement("textarea");
      textArea.value = rpcResponse;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy text: ", err);
      }

      document.body.removeChild(textArea);
    }
  };

  const quickExamples: QuickExample[] = [
    {
      label: "Latest Block",
      method: "eth_getBlockByNumber",
      params: '["latest", true]',
    },
    {
      label: "Chain ID",
      method: "eth_chainId",
      params: "[]",
    },
    {
      label: "Gas Price",
      method: "eth_gasPrice",
      params: "[]",
    },
    {
      label: "Block Number",
      method: "eth_blockNumber",
      params: "[]",
    },
  ];

  const handleQuickExample = (example: QuickExample): void => {
    setRpcMethod(example.method);
    setRpcParams(example.params);
    setRpcResponse("{}");
    setShowFullResponse(false);
  };

  const isResponseLong = rpcResponse.length > MAX_PREVIEW_LENGTH;
  const displayResponse =
    showFullResponse || !isResponseLong
      ? rpcResponse
      : rpcResponse.substring(0, MAX_PREVIEW_LENGTH) + "...";

  const handleKeyPress = (e: React.KeyboardEvent): void => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      sendRpcRequest();
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h1
              className="text-[28px] sm:text-[32px] font-bold"
              style={{ color: "var(--color-dark)" }}
            >
              BNB Smart Chain RPC Explorer
            </h1>
          </div>
          <p className="text-[16px]" style={{ color: "#8e8e93" }}>
            Send RPC requests to the BNB Smart Chain network and explore
            blockchain data
          </p>
        </div>

        {/* RPC Request Section */}
        <div
          className="border rounded-2xl p-6 mb-8 shadow-sm"
          style={{
            backgroundColor: "white",
            borderColor: "#e5e5e7",
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Send className="w-5 h-5" style={{ color: "var(--color-brand)" }} />
            <h3
              className="text-lg font-semibold"
              style={{ color: "var(--color-dark)" }}
            >
              Send RPC Request
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label
                className="block text-[16px] font-medium mb-2"
                style={{ color: "var(--color-dark)" }}
              >
                RPC Method
              </label>
              <input
                type="text"
                value={rpcMethod}
                onChange={(e) => setRpcMethod(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="e.g., eth_getBlockByNumber"
                className="w-full p-4 border rounded-xl outline-none transition-all duration-150"
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
                }}
              />
            </div>

            <div>
              <label
                className="block text-[16px] font-medium mb-2"
                style={{ color: "var(--color-dark)" }}
              >
                Parameters (JSON array)
              </label>
              <textarea
                value={rpcParams}
                onChange={(e) => setRpcParams(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder='e.g., ["latest", true]'
                className="w-full h-24 p-4 border rounded-xl outline-none resize-none transition-all duration-150"
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
                }}
              />
              <p className="text-xs mt-1" style={{ color: "#8e8e93" }}>
                Press Cmd/Ctrl + Enter to send request
              </p>
            </div>

            <button
              onClick={sendRpcRequest}
              disabled={loading || !rpcMethod.trim()}
              className="w-full sm:w-auto px-6 py-3 text-white rounded-xl font-medium transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor:
                  rpcMethod.trim() && !loading
                    ? "var(--color-brand)"
                    : "#d1d1d6",
              }}
              onMouseEnter={(e) => {
                if (rpcMethod.trim() && !loading) {
                  e.currentTarget.style.backgroundColor = "#2062E5";
                }
              }}
              onMouseLeave={(e) => {
                if (rpcMethod.trim() && !loading) {
                  e.currentTarget.style.backgroundColor = "var(--color-brand)";
                }
              }}
            >
              {loading ? "Sending..." : "Send Request"}
            </button>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  className="block text-[16px] font-medium"
                  style={{ color: "var(--color-dark)" }}
                >
                  Response:
                </label>
                <div className="flex items-center gap-2">
                  {isResponseLong && (
                    <button
                      onClick={() => setShowFullResponse(!showFullResponse)}
                      className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg transition-colors"
                      style={{
                        backgroundColor: "#f5f5f7",
                        color: "var(--color-dark)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#e5e5e7";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#f5f5f7";
                      }}
                    >
                      {showFullResponse ? (
                        <>
                          <ChevronUp className="w-4 h-4" />
                          Show Less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4" />
                          View All
                        </>
                      )}
                    </button>
                  )}
                  <button
                    onClick={handleCopy}
                    disabled={!rpcResponse || rpcResponse === "{}"}
                    className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: "#ebf3ff",
                      color: "#0b57d0",
                    }}
                    onMouseEnter={(e) => {
                      if (rpcResponse && rpcResponse !== "{}") {
                        e.currentTarget.style.backgroundColor = "#D6E6FF";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (rpcResponse && rpcResponse !== "{}") {
                        e.currentTarget.style.backgroundColor = "#ebf3ff";
                      }
                    }}
                  >
                    <Copy className="w-4 h-4" />
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>
              <div className="relative">
                <pre
                  className="w-full p-4 border rounded-xl text-sm font-mono overflow-x-auto whitespace-pre-wrap break-all"
                  style={{
                    backgroundColor: "#1e1e1e",
                    borderColor: "#e5e5e7",
                    color: "#00ff88",
                    minHeight: "120px",
                    maxHeight: showFullResponse ? "none" : "400px",
                  }}
                >
                  {displayResponse}
                </pre>
              </div>
              {copied && (
                <div
                  className="flex items-center gap-2 p-3 rounded-lg"
                  style={{ backgroundColor: "#e8f5e8", color: "#34C759" }}
                >
                  <Copy className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    Response copied to clipboard!
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Examples */}
        <div
          className="border rounded-2xl p-6 mb-8 shadow-sm"
          style={{
            backgroundColor: "white",
            borderColor: "#e5e5e7",
          }}
        >
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: "var(--color-dark)" }}
          >
            Quick Examples
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quickExamples.map((example, index) => (
              <button
                key={index}
                onClick={() => handleQuickExample(example)}
                className="p-3 text-left border rounded-xl transition-all duration-150 active:scale-95"
                style={{
                  backgroundColor: "#ebf3ff",
                  borderColor: "#D6E6FF",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#D6E6FF";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#ebf3ff";
                }}
              >
                <div
                  className="text-sm font-medium"
                  style={{ color: "#0b57d0" }}
                >
                  {example.label}
                </div>
                <div
                  className="text-xs mt-1 font-mono"
                  style={{ color: "var(--color-brand)" }}
                >
                  {example.method}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Usage Guide */}
        <div
          className="border rounded-2xl p-6 shadow-sm text-justify"
          style={{
            backgroundColor: "white",
            borderColor: "#e5e5e7",
          }}
        >
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: "var(--color-dark)" }}
          >
            Usage Guide
          </h3>
          <div className="space-y-4 text-sm" style={{ color: "#8e8e93" }}>
            <div>
              <h4
                className="font-medium mb-2"
                style={{ color: "var(--color-dark)" }}
              >
                RPC Methods:
              </h4>
              <p>
                Enter any valid BNB Smart Chain RPC method like
                eth_getBlockByNumber, eth_getBalance, or eth_call.
              </p>
            </div>
            <div>
              <h4
                className="font-medium mb-2"
                style={{ color: "var(--color-dark)" }}
              >
                Parameters:
              </h4>
              <p>
                Provide parameters as a JSON array. For methods without
                parameters, use an empty array []. Use Cmd/Ctrl + Enter for
                quick submission.
              </p>
            </div>
            <div>
              <h4
                className="font-medium mb-2"
                style={{ color: "var(--color-dark)" }}
              >
                Network:
              </h4>
              <p>
                Connected to the official BNB Smart Chain mainnet RPC endpoint
                for real-time blockchain data.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm" style={{ color: "#8e8e93" }}>
          <p>Explore BNB Smart Chain blockchain data with direct RPC access</p>
        </div>
      </div>
    </div>
  );
}
