"use client";
import React, { useState, useEffect } from "react";
import { Copy, ArrowUpDown, Calculator } from "lucide-react";

interface Conversion {
  label: string;
  from: string;
  to: string;
  value: string;
}

interface WeiConversions {
  [key: string]: string;
}

interface UnitLabels {
  [key: string]: string;
}

export function UnitConverter() {
  const [inputValue, setInputValue] = useState<string>("");
  const [fromUnit, setFromUnit] = useState<string>("ether");
  const [toUnit, setToUnit] = useState<string>("wei");
  const [result, setResult] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  const weiConversions: WeiConversions = {
    wei: "1",
    kwei: "1000",
    mwei: "1000000",
    gwei: "1000000000",
    szabo: "1000000000000",
    finney: "1000000000000000",
    ether: "1000000000000000000",
    kether: "1000000000000000000000",
    mether: "1000000000000000000000000",
    gether: "1000000000000000000000000000",
    tether: "1000000000000000000000000000000",
  };

  const unitLabels: UnitLabels = {
    wei: "Wei",
    kwei: "Kwei (Babbage)",
    mwei: "Mwei (Lovelace)",
    gwei: "Gwei (Shannon)",
    szabo: "Szabo",
    finney: "Finney",
    ether: "Ether",
    kether: "Kether (Grand)",
    mether: "Mether",
    gether: "Gether",
    tether: "Tether",
  };


  const convertUnits = (value: string, from: string, to: string): string => {
    if (!value || isNaN(Number(value))) return "";

    try {
      const inputNum = parseFloat(value);
      if (inputNum === 0) return "0";

      const fromWei = parseFloat(weiConversions[from]);
      const toWei = parseFloat(weiConversions[to]);

     
      const conversionFactor = fromWei / toWei;
      const result = inputNum * conversionFactor;

      if (result >= 1e15) {
        return result.toLocaleString("en-US", {
          maximumFractionDigits: 0,
          useGrouping: false,
        });
      }

     
      if (result < 1 && result > 0) {
     
        let resultStr = result.toString();

   
        if (resultStr.includes("e")) {
          const [base, exponent] = resultStr.split("e");
          const exp = parseInt(exponent);
          const baseNum = parseFloat(base);

          if (exp < 0) {
      
            const decimalPlaces =
              Math.abs(exp) + (base.split(".")[1]?.length || 0);
            resultStr = baseNum.toFixed(decimalPlaces);
          } else {
        
            resultStr = (baseNum * Math.pow(10, exp)).toString();
          }
        }

    
        if (resultStr.includes(".")) {
          resultStr = resultStr.replace(/\.?0+$/, "");
        }

        return resultStr;
      }


      if (result % 1 === 0) {
        return result.toString();
      } else {

        const precision = result < 1 ? 18 : 8;
        return parseFloat(result.toPrecision(precision)).toString();
      }
    } catch (error) {
      return "Invalid input";
    }
  };

  useEffect(() => {
    if (inputValue) {
      const converted = convertUnits(inputValue, fromUnit, toUnit);
      setResult(converted);
    } else {
      setResult("");
    }
  }, [inputValue, fromUnit, toUnit]);

  const handleSwapUnits = (): void => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const handleCopy = async (): Promise<void> => {
    if (result) {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const commonConversions: Conversion[] = [
    { label: "1 ETH to Wei", from: "ether", to: "wei", value: "1" },
    { label: "1 Gwei to Wei", from: "gwei", to: "wei", value: "1" },
    { label: "21000 Gwei (Gas)", from: "gwei", to: "ether", value: "21000" },
    { label: "1 Wei to ETH", from: "wei", to: "ether", value: "1" },
  ];

  const handleQuickConversion = (conversion: Conversion): void => {
    setInputValue(conversion.value);
    setFromUnit(conversion.from);
    setToUnit(conversion.to);
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
              Unit Converter
            </h1>
          </div>
          <p className="text-[16px] sm:" style={{ color: "#8e8e93" }}>
            Convert between different Wei units used in Ethereum development
          </p>
        </div>

        {/* Main Converter */}
        <div
          className="border rounded-2xl p-6 mb-8 shadow-sm"
          style={{
            backgroundColor: "white",
            borderColor: "#e5e5e7",
          }}
        >
          <div className="grid grid-cols-1 gap-6 relative">
            {/* From Section */}
            <div className="space-y-4">
              <label
                className="block text-[16px] font-medium"
                style={{ color: "var(--color-dark)" }}
              >
                From
              </label>
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="w-full p-3 border rounded-xl outline-none transition-all duration-150"
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
              >
                {Object.entries(unitLabels).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full p-4 text-lg border rounded-xl outline-none transition-all duration-150"
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

                <div className="hidden lg:flex items-center justify-center ">
                  <button
                    onClick={handleSwapUnits}
                    className="w-12 h-12 text-white rounded-xl flex items-center justify-center transition-all duration-150 active:scale-95 cursor-pointer"
                    style={{
                      backgroundColor: "var(--color-brand)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#2062E5";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "var(--color-brand)";
                    }}
                  >
                    <ArrowUpDown className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex items-center justify-center lg:hidden">
              <button
                onClick={handleSwapUnits}
                className="w-12 h-12 text-white rounded-xl flex items-center justify-center transition-all duration-150 active:scale-95"
                style={{
                  backgroundColor: "var(--color-brand)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#2062E5";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--color-brand)";
                }}
              >
                <ArrowUpDown className="w-5 h-5 rotate-90" />
              </button>
            </div>

            {/* To Section */}
            <div className="space-y-4">
              <label
                className="block text-[16px] font-medium"
                style={{ color: "var(--color-dark)" }}
              >
                To
              </label>
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="w-full p-3 border rounded-xl outline-none transition-all duration-150"
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
              >
                {Object.entries(unitLabels).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
              <div className="relative">
                <input
                  type="text"
                  value={result}
                  readOnly
                  placeholder="Result will appear here"
                  className="w-full p-4 pr-12 text-lg border rounded-xl break-all"
                  style={{
                    backgroundColor: "var(--color-light)",
                    borderColor: "#e5e5e7",
                    color: "var(--color-dark)",
                  }}
                />
                {result && (
                  <button
                    onClick={handleCopy}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors"
                    style={{ color: "#8e8e93" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "var(--color-brand)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#8e8e93";
                    }}
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                )}
              </div>
              {copied && (
                <p className="text-sm font-medium" style={{ color: "#34C759" }}>
                  Copied to clipboard!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Conversions */}
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
            Quick Conversions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {commonConversions.map((conversion, index) => (
              <button
                key={index}
                onClick={() => handleQuickConversion(conversion)}
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
                  {conversion.label}
                </div>
                <div
                  className="text-xs mt-1"
                  style={{ color: "var(--color-brand)" }}
                >
                  {conversion.value} {unitLabels[conversion.from]} →{" "}
                  {unitLabels[conversion.to]}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Unit Reference Table */}
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
            Unit Reference
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid #e5e5e7" }}>
                  <th
                    className="text-left py-3 text-sm font-medium max-sm:pr-24"
                    style={{ color: "var(--color-dark)" }}
                  >
                    Unit
                  </th>
                  <th
                    className="text-left py-3 text-sm font-medium"
                    style={{ color: "var(--color-dark)" }}
                  >
                    Wei Value
                  </th>
                  <th
                    className="text-left py-3 text-sm font-medium"
                    style={{ color: "var(--color-dark)" }}
                  >
                    Alternative Name
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(weiConversions).map(([unit, value]) => (
                  <tr key={unit} style={{ borderBottom: "1px solid #f0f0f0" }}>
                    <td
                      className="py-3 text-sm font-medium"
                      style={{ color: "var(--color-dark)" }}
                    >
                      {unitLabels[unit]}
                    </td>
                    <td
                      className="py-3 text-sm font-mono"
                      style={{ color: "#8e8e93" }}
                    >
                      {value}
                    </td>
                    <td className="py-3 text-sm" style={{ color: "#8e8e93" }}>
                      {unit === "kwei" && "Babbage"}
                      {unit === "mwei" && "Lovelace"}
                      {unit === "gwei" && "Shannon"}
                      {unit === "kether" && "Grand"}
                      {!["kwei", "mwei", "gwei", "kether"].includes(unit) &&
                        "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm" style={{ color: "#8e8e93" }}>
          <p>
            Perfect for Ethereum developers working with smart contracts and gas
            calculations
          </p>
        </div>
      </div>
    </div>
  );
}
