"use client";
import React, { useState } from "react";
import { Copy, ExternalLink, Zap, AlertCircle } from "lucide-react";

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

    setTimeout(() => {
      const selectedProviderData = providers.find(
        (p) => p.id === selectedProvider
      );
      if (!selectedProviderData) return;

      const mockApp: CreatedApp = {
        id: Math.random().toString(36).substr(2, 9),
        url: `https://dapp-${Math.random().toString(36).substr(2, 6)}.${
          selectedProviderData.url
        }`,
        provider: selectedProviderData,
        deployedAt: new Date().toISOString(),
        hexData: hexInput,
      };

      setCreatedApp(mockApp);
      setIsCreating(false);
    }, 2000);
  };

  const handleCopy = async (text: string): Promise<void> => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Low Level Interactions
            </h1>
          </div>
          <p className="text-gray-600">
            Deploy dApps from hex input using private-based nodes
          </p>
        </div>

        {/* Main Form */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          {/* Grid Layout for larger screens */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Hex Input Section */}
            <div className="space-y-4">
              <label className="block text-lg font-medium text-gray-900">
                Hex Input
              </label>
              <textarea
                value={hexInput}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setHexInput(e.target.value)
                }
                placeholder="Paste your hex data here (e.g., 0xa9059cbb000000000000000000000000...)"
                rows={8}
                className="w-full p-4 text-sm border border-gray-200 rounded-xl outline-none transition-all duration-150 font-mono resize-vertical focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              {/* Validation indicator */}
              {hexInput && (
                <div className="flex items-center gap-2">
                  {validateHex(hexInput) ? (
                    <>
                      <div className="w-4 h-4 rounded-full bg-green-500"></div>
                      <span className="text-sm font-medium text-green-600">
                        Valid hex input
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      <span className="text-sm font-medium text-red-600">
                        Invalid hex format
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Provider Selection, Button, and Result */}
            <div className="space-y-6">
              <div className="space-y-4">
                <label className="block text-lg font-medium text-gray-900">
                  Choose URL Provider
                </label>
                <select
                  value={selectedProvider}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setSelectedProvider(e.target.value)
                  }
                  className="w-full p-3 border border-gray-200 rounded-xl outline-none transition-all duration-150 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  {providers.map((provider) => (
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
                className="w-full p-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-xl flex items-center justify-center gap-2 transition-all duration-150 active:scale-95 text-lg font-medium disabled:cursor-not-allowed"
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

              {/* Created App Result - Now in the second column */}
              {createdApp && (
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                      <span className="text-xl">✅</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        dApp Created Successfully!
                      </h3>
                      <p className="text-sm text-gray-600">
                        Deployed via {createdApp.provider.name}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* App URL */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-900">
                        Application URL
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={createdApp.url}
                          readOnly
                          className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl font-mono text-sm text-gray-900"
                        />
                        <button
                          onClick={() => handleCopy(createdApp.url)}
                          className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-xl transition-colors hover:bg-gray-50"
                        >
                          <Copy className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => window.open(createdApp.url, "_blank")}
                          className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-xl transition-colors hover:bg-gray-50"
                        >
                          <ExternalLink className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>

                    {/* App Details */}
                    <div className="grid grid-cols-1 gap-4 p-4 bg-gray-50 rounded-xl">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          App ID
                        </p>
                        <p className="text-sm font-mono text-gray-600">
                          {createdApp.id}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Deployed At
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(createdApp.deployedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {copied && (
                      <p className="text-sm font-medium text-green-600">
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
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            Deploy smart contracts and interact with Ethereum using raw hex data
          </p>
        </div>
      </div>
    </div>
  );
}
