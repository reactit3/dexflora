"use client";
import React, { useState } from "react";
import { Copy, X, ArrowRightLeft, Type } from "lucide-react";

interface QuickExample {
  label: string;
  hex: string;
  utf8: string;
}

export function Utf8Converter() {
  const [hexInput, setHexInput] = useState<string>("");
  const [utf8Output, setUtf8Output] = useState<string>("");
  const [utf8Input, setUtf8Input] = useState<string>("");
  const [hexOutput, setHexOutput] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [conversionError, setConversionError] = useState<string>("");

  const handleHexToUtf8 = () => {
    if (!hexInput.trim()) return;

    setConversionError("");
    setUtf8Output("");

    try {
      const hex = hexInput.trim().replace(/\s+/g, "").replace(/0x/gi, "");

      if (!/^[0-9a-fA-F]*$/.test(hex)) {
        setConversionError(
          "Invalid hex characters. Please use only 0-9 and A-F."
        );
        return;
      }

      if (hex.length % 2 !== 0) {
        setConversionError(
          "Hex string must have an even number of characters."
        );
        return;
      }

      let str = "";
      for (let i = 0; i < hex.length; i += 2) {
        const code = parseInt(hex.substr(i, 2), 16);
        str += String.fromCharCode(code);
      }

      const utf8 = decodeURIComponent(escape(str));
      setUtf8Output(utf8);
    } catch (error) {
      setConversionError(
        "Error decoding hex input. Please check your input format."
      );
    }
  };

  const handleUtf8ToHex = () => {
    if (!utf8Input.trim()) return;

    setConversionError("");
    setHexOutput("");

    try {
      const utf8 = utf8Input.trim();
      const encoded = unescape(encodeURIComponent(utf8));
      let hex = "";

      for (let i = 0; i < encoded.length; i++) {
        hex += encoded.charCodeAt(i).toString(16).padStart(2, "0");
      }

      setHexOutput(hex.toUpperCase());
    } catch (error) {
      setConversionError(
        "Error encoding UTF-8 input. Please check your input."
      );
    }
  };

  const handleCopy = async (text: string) => {
    if (text) {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
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
    }
  };

  const clearHex = () => {
    setHexInput("");
    setUtf8Output("");
    setConversionError("");
  };

  const clearUtf8 = () => {
    setUtf8Input("");
    setHexOutput("");
    setConversionError("");
  };

  const quickExamples: QuickExample[] = [
    {
      label: "Hello World",
      hex: "48656C6C6F20576F726C64",
      utf8: "Hello World",
    },
    {
      label: "Unicode Example",
      hex: "48656C6C6F20F09F8C8D",
      utf8: "Hello 🌍",
    },
    {
      label: "Numbers",
      hex: "313233343536373839",
      utf8: "123456789",
    },
    {
      label: "Special Characters",
      hex: "21402324255E262A28293C3E3F",
      utf8: "!@#$%^&*()<>?",
    },
  ];

  const handleQuickExample = (example: QuickExample, type: "hex" | "utf8") => {
    if (type === "hex") {
      setHexInput(example.hex);
      setUtf8Output("");
      setConversionError("");
    } else {
      setUtf8Input(example.utf8);
      setHexOutput("");
      setConversionError("");
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
              Hex ↔ UTF-8 Converter
            </h1>
          </div>
          <p className="text-[16px]" style={{ color: "#8e8e93" }}>
            Convert between hexadecimal and UTF-8 text encoding in both
            directions
          </p>
        </div>

        {/* Hex to UTF-8 Section */}
        <div
          className="border rounded-2xl p-6 mb-8 shadow-sm"
          style={{
            backgroundColor: "white",
            borderColor: "#e5e5e7",
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Type className="w-5 h-5" style={{ color: "var(--color-brand)" }} />
            <h3
              className="text-lg font-semibold"
              style={{ color: "var(--color-dark)" }}
            >
              Hex to UTF-8
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label
                className="block text-base font-medium mb-2"
                style={{ color: "var(--color-dark)" }}
              >
                Hex Input
              </label>
              <div className="relative">
                <textarea
                  value={hexInput}
                  onChange={(e) => setHexInput(e.target.value)}
                  placeholder="Enter hex string (e.g., 68656c6c6f or 0x68656c6c6f)..."
                  className="w-full h-32 p-4 border rounded-xl outline-none resize-none transition-all duration-150 font-mono text-sm"
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
                {hexInput && (
                  <button
                    onClick={clearHex}
                    className="absolute top-3 right-3 transition-colors"
                    style={{ color: "#8e8e93" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#ff3b30";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#8e8e93";
                    }}
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            <button
              onClick={handleHexToUtf8}
              disabled={!hexInput.trim()}
              className="w-full sm:w-auto px-6 py-3 text-white rounded-xl font-medium transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: hexInput.trim()
                  ? "var(--color-brand)"
                  : "#d1d1d6",
              }}
              onMouseEnter={(e) => {
                if (hexInput.trim()) {
                  e.currentTarget.style.backgroundColor = "#2062E5";
                }
              }}
              onMouseLeave={(e) => {
                if (hexInput.trim()) {
                  e.currentTarget.style.backgroundColor = "var(--color-brand)";
                }
              }}
            >
              Convert to UTF-8
            </button>

            {utf8Output && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    className="block text-base font-medium"
                    style={{ color: "var(--color-dark)" }}
                  >
                    UTF-8 Output
                  </label>
                  <button
                    onClick={() => handleCopy(utf8Output)}
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
                </div>
                <textarea
                  value={utf8Output}
                  readOnly
                  className="w-full h-32 p-4 border rounded-xl resize-none text-sm"
                  style={{
                    backgroundColor: "var(--color-light)",
                    borderColor: "#e5e5e7",
                    color: "var(--color-dark)",
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* UTF-8 to Hex Section */}
        <div
          className="border rounded-2xl p-6 mb-8 shadow-sm"
          style={{
            backgroundColor: "white",
            borderColor: "#e5e5e7",
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <ArrowRightLeft
              className="w-5 h-5"
              style={{ color: "var(--color-brand)" }}
            />
            <h3
              className="text-lg font-semibold"
              style={{ color: "var(--color-dark)" }}
            >
              UTF-8 to Hex
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label
                className="block text-base font-medium mb-2"
                style={{ color: "var(--color-dark)" }}
              >
                UTF-8 Input
              </label>
              <div className="relative">
                <textarea
                  value={utf8Input}
                  onChange={(e) => setUtf8Input(e.target.value)}
                  placeholder="Enter UTF-8 string (e.g., hello)..."
                  className="w-full h-32 p-4 border rounded-xl outline-none resize-none transition-all duration-150 text-sm"
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
                {utf8Input && (
                  <button
                    onClick={clearUtf8}
                    className="absolute top-3 right-3 transition-colors"
                    style={{ color: "#8e8e93" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#ff3b30";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#8e8e93";
                    }}
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            <button
              onClick={handleUtf8ToHex}
              disabled={!utf8Input.trim()}
              className="w-full sm:w-auto px-6 py-3 text-white rounded-xl font-medium transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: utf8Input.trim()
                  ? "var(--color-brand)"
                  : "#d1d1d6",
              }}
              onMouseEnter={(e) => {
                if (utf8Input.trim()) {
                  e.currentTarget.style.backgroundColor = "#2062E5";
                }
              }}
              onMouseLeave={(e) => {
                if (utf8Input.trim()) {
                  e.currentTarget.style.backgroundColor = "var(--color-brand)";
                }
              }}
            >
              Convert to Hex
            </button>

            {hexOutput && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    className="block text-base font-medium"
                    style={{ color: "var(--color-dark)" }}
                  >
                    Hex Output
                  </label>
                  <button
                    onClick={() => handleCopy(hexOutput)}
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
                </div>
                <textarea
                  value={hexOutput}
                  readOnly
                  className="w-full h-32 p-4 border rounded-xl resize-none break-all font-mono text-sm"
                  style={{
                    backgroundColor: "var(--color-light)",
                    borderColor: "#e5e5e7",
                    color: "var(--color-dark)",
                  }}
                />
                {copied && (
                  <p
                    className="text-sm font-medium"
                    style={{ color: "#34C759" }}
                  >
                    Copied to clipboard!
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Error Display */}
        {conversionError && (
          <div
            className="border rounded-2xl p-4 mb-8"
            style={{
              backgroundColor: "#ffe6e6",
              borderColor: "#ffcccc",
              color: "#d70015",
            }}
          >
            {conversionError}
          </div>
        )}

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {quickExamples.map((example, index) => (
              <div key={index} className="space-y-2">
                <div
                  className="text-sm font-medium"
                  style={{ color: "var(--color-dark)" }}
                >
                  {example.label}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleQuickExample(example, "hex")}
                    className="flex-1 p-2 text-left border rounded-lg transition-all duration-150 active:scale-95"
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
                    <div className="text-xs" style={{ color: "#8e8e93" }}>
                      Hex:
                    </div>
                    <div
                      className="text-xs font-mono"
                      style={{ color: "var(--color-brand)" }}
                    >
                      {example.hex}
                    </div>
                  </button>
                  <button
                    onClick={() => handleQuickExample(example, "utf8")}
                    className="flex-1 p-2 text-left border rounded-lg transition-all duration-150 active:scale-95"
                    style={{
                      backgroundColor: "#f0f9ff",
                      borderColor: "#e0f2fe",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#e0f2fe";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#f0f9ff";
                    }}
                  >
                    <div className="text-xs" style={{ color: "#8e8e93" }}>
                      UTF-8:
                    </div>
                    <div className="text-xs" style={{ color: "#0ea5e9" }}>
                      {example.utf8}
                    </div>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Usage Guide */}
        <div
          className="border rounded-2xl p-6 shadow-sm"
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
                Hex to UTF-8:
              </h4>
              <p>
                Enter hexadecimal values (with or without 0x prefix) to convert
                them to readable UTF-8 text. Each pair of hex digits represents
                one byte.
              </p>
            </div>
            <div>
              <h4
                className="font-medium mb-2"
                style={{ color: "var(--color-dark)" }}
              >
                UTF-8 to Hex:
              </h4>
              <p>
                Enter any UTF-8 text (including Unicode characters like emojis)
                to convert it to its hexadecimal representation. Useful for
                encoding text data.
              </p>
            </div>
            <div>
              <h4
                className="font-medium mb-2"
                style={{ color: "var(--color-dark)" }}
              >
                Common Use Cases:
              </h4>
              <p>
                Perfect for debugging text encoding issues, working with binary
                data, examining encoded strings, or converting between different
                text representations.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm" style={{ color: "#8e8e93" }}>
          <p>
            Essential tool for text encoding, debugging, and data conversion
          </p>
        </div>
      </div>
    </div>
  );
}
