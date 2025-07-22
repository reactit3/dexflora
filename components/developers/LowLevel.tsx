"use client";
import React, { useState } from "react";
import { Copy, ExternalLink, Zap, AlertCircle } from "lucide-react";
import { getFirstLinkAndDelete } from "@/app/actions/links";

interface Provider {
  id: string;
  name: string;
  url: string;
}

interface CreatedApp {
  id: string;
  url: string;
  provider: Provider;
  deployedAt: string;
  hexData: string;
}

export function LowLevel() {
  const [hexInput, setHexInput] = useState<string>("");
  const [selectedProvider, setSelectedProvider] = useState<string>("surge");
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [createdApp, setCreatedApp] = useState<CreatedApp | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const providers: Provider[] = [
    {
      id: "surge",
      name: "Surge",
      url: "surge.sh",
    },
  ];

  const validateHex = (input: string): boolean => {
    const cleanInput = input.replace(/^0x/, "");
    return /^[0-9a-fA-F]+$/.test(cleanInput) && cleanInput.length > 0;
  };

  const handleCreateDapp = async (): Promise<void> => {
    if (!hexInput.trim()) {
      alert("Please enter hex input");
      return;
    }

    if (!validateHex(hexInput)) {
      alert("Please enter valid hexadecimal input");
      return;
    }

    setIsCreating(true);
    setError(null);
    setCreatedApp(null);

    try {
      // Call the server action
      const result = await getFirstLinkAndDelete(hexInput);

      if (result.error || !result.data) {
        setError(result.error || "Failed to get link");
        setIsCreating(false);
        return;
      }

      const link = result.data;
      const selectedProviderData = providers.find(
        (p) => p.id === selectedProvider
      );

      if (!selectedProviderData) {
        setError("Provider not found");
        setIsCreating(false);
        return;
      }

      // Create the app object using the real link data
      const newApp: CreatedApp = {
        id: link.name, // Use the link name as the dApp ID
        url: link.url, // Use the actual URL from the database
        provider: selectedProviderData,
        deployedAt: new Date().toISOString(),
        hexData: hexInput,
      };

      setCreatedApp(newApp);
    } catch (err) {
      setError("Failed to create dApp");
      console.error("Error creating dApp:", err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopy = async (text: string): Promise<void> => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className=" p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
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
            Deploy dApps from hex input using private-based nodes
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 border border-red-200 rounded-xl bg-red-50">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700 font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Main Form */}
        <div
          className="border rounded-2xl p-6 shadow-sm"
          style={{
            backgroundColor: "white",
            borderColor: "#e5e5e7",
          }}
        >
          {/* Grid Layout for larger screens */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Hex Input Section */}
            <div className="space-y-4 h-full flex flex-col">
              <label
                className="block text-[16px] font-medium"
                style={{ color: "var(--color-dark)" }}
              >
                Hex Input
              </label>
              <textarea
                value={hexInput}
                onChange={(e) => setHexInput(e.target.value)}
                placeholder="Paste your hex data here (e.g., 0xa9059cbb...)"
                className="w-full flex-1 p-4 text-sm border rounded-xl outline-none transition-all duration-150 font-mono resize-none"
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
              {/* Validation Indicator */}
              {hexInput && (
                <div className="flex items-center gap-2">
                  {validateHex(hexInput) ? (
                    <>
                      <div className="w-4 h-4 rounded-full bg-[#34C759]"></div>
                      <span className="text-sm font-medium text-[#34C759]">
                        Valid hex input
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-[#FF3B30]" />
                      <span className="text-sm font-medium text-[#FF3B30]">
                        Invalid hex format
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Provider Selection, Button, and Result */}
            <div className="space-y-6">
              {/* Provider Selection */}
              <div className="space-y-4">
                <label
                  className="block text-[16px] font-medium"
                  style={{ color: "var(--color-dark)" }}
                >
                  Choose URL Provider
                </label>
                <select
                  value={selectedProvider}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setSelectedProvider(e.target.value)
                  }
                  className="w-full p-4 text-sm border rounded-xl outline-none transition-all duration-150"
                  style={{
                    borderColor: "#e5e5e7",
                    color: "var(--color-dark)",
                  }}
                  onFocus={(e: React.FocusEvent<HTMLSelectElement>) => {
                    e.target.style.borderColor = "var(--color-brand)";
                    e.target.style.boxShadow =
                      "0 0 0 2px rgba(39, 114, 245, 0.1)";
                  }}
                  onBlur={(e: React.FocusEvent<HTMLSelectElement>) => {
                    e.target.style.borderColor = "#e5e5e7";
                    e.target.style.boxShadow = "none";
                  }}
                >
                  {providers.map((provider: Provider) => (
                    <option key={provider.id} value={provider.id}>
                      {provider.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Create Button */}
              <button
                onClick={handleCreateDapp}
                disabled={
                  isCreating || !hexInput.trim() || !validateHex(hexInput)
                }
                className="w-full p-4 bg-brand hover:bg-[#2062E5] disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer active:scale-95 text-[16px] font-medium"
              >
                {isCreating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating dApp...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    <span>Create dApp</span>
                  </>
                )}
              </button>

              {/* Created App Result */}
              {createdApp && (
                <div
                  className="border rounded-2xl p-6 shadow-sm"
                  style={{
                    backgroundColor: "white",
                    borderColor: "#e5e5e7",
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div>
                      <h3
                        className="text-lg font-semibold"
                        style={{ color: "var(--color-dark)" }}
                      >
                        dApp Created Successfully!
                      </h3>
                      <p className="text-sm" style={{ color: "#8e8e93" }}>
                        Deployed via {createdApp.provider.name}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* App URL */}
                    <div>
                      <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: "var(--color-dark)" }}
                      >
                        Application URL
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={createdApp.url}
                          readOnly
                          className="flex-1 p-3 border rounded-xl font-mono text-sm"
                          style={{
                            backgroundColor: "var(--color-light)",
                            borderColor: "#e5e5e7",
                            color: "var(--color-dark)",
                          }}
                        />
                        {/* <button
                          onClick={() => handleCopy(createdApp.url)}
                          className="w-10 h-10 flex items-center justify-center border rounded-xl transition-colors"
                          style={{ borderColor: "#e5e5e7" }}
                          onMouseEnter={(
                            e: React.MouseEvent<HTMLButtonElement>
                          ) => {
                            e.currentTarget.style.backgroundColor =
                              "var(--color-light)";
                          }}
                          onMouseLeave={(
                            e: React.MouseEvent<HTMLButtonElement>
                          ) => {
                            e.currentTarget.style.backgroundColor = "white";
                          }}
                        >
                          <Copy
                            className="w-4 h-4"
                            style={{ color: "#8e8e93" }}
                          />
                        </button> */}
                        {/* <button
                          onClick={() => window.open(createdApp.url, "_blank")}
                          className="w-10 h-10 flex items-center justify-center border rounded-xl transition-colors"
                          style={{ borderColor: "#e5e5e7" }}
                          onMouseEnter={(
                            e: React.MouseEvent<HTMLButtonElement>
                          ) => {
                            e.currentTarget.style.backgroundColor =
                              "var(--color-light)";
                          }}
                          onMouseLeave={(
                            e: React.MouseEvent<HTMLButtonElement>
                          ) => {
                            e.currentTarget.style.backgroundColor = "white";
                          }}
                        >
                          <ExternalLink
                            className="w-4 h-4"
                            style={{ color: "#8e8e93" }}
                          />
                        </button> */}
                      </div>
                    </div>

                    {/* App Details */}
                    <div
                      className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl"
                      style={{ backgroundColor: "var(--color-light)" }}
                    >
                      <div>
                        <p
                          className="text-sm font-medium"
                          style={{ color: "var(--color-dark)" }}
                        >
                          App ID
                        </p>
                        <p
                          className="text-sm font-mono"
                          style={{ color: "#8e8e93" }}
                        >
                          {createdApp.id}
                        </p>
                      </div>
                      <div>
                        <p
                          className="text-sm font-medium"
                          style={{ color: "var(--color-dark)" }}
                        >
                          Deployed At
                        </p>
                        <p className="text-sm" style={{ color: "#8e8e93" }}>
                          {new Date(createdApp.deployedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleCopy(createdApp.url)}
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

                    {copied && (
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

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm" style={{ color: "#8e8e93" }}>
          <p>
            Deploy smart contracts and interact with Ethereum using raw hex data
          </p>
        </div>
      </div>
    </div>
  );
}
