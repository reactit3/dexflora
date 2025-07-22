"use client";
import React, { useState } from "react";
import { Copy, X, Code, Cpu } from "lucide-react";

interface QuickExample {
  label: string;
  value: string;
}

export function BytecodeConverter() {
  const [bytecodeInput, setBytecodeInput] = useState<string>("");
  const [opcodeOutput, setOpcodeOutput] = useState<string>("");
  const [opcodeInput, setOpcodeInput] = useState<string>("");
  const [bytecodeOutput, setBytecodeOutput] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [conversionError, setConversionError] = useState<string>("");

  const OPCODES: { [key: number]: string } = {
    0x00: "STOP",
    0x01: "ADD",
    0x02: "MUL",
    0x03: "SUB",
    0x04: "DIV",
    0x05: "SDIV",
    0x06: "MOD",
    0x07: "SMOD",
    0x08: "ADDMOD",
    0x09: "MULMOD",
    0x0a: "EXP",
    0x0b: "SIGNEXTEND",
    0x10: "LT",
    0x11: "GT",
    0x12: "SLT",
    0x13: "SGT",
    0x14: "EQ",
    0x15: "ISZERO",
    0x16: "AND",
    0x17: "OR",
    0x18: "XOR",
    0x19: "NOT",
    0x1a: "BYTE",
    0x1b: "SHL",
    0x1c: "SHR",
    0x1d: "SAR",
    0x20: "SHA3",
    0x30: "ADDRESS",
    0x31: "BALANCE",
    0x32: "ORIGIN",
    0x33: "CALLER",
    0x34: "CALLVALUE",
    0x35: "CALLDATALOAD",
    0x36: "CALLDATASIZE",
    0x37: "CALLDATACOPY",
    0x38: "CODESIZE",
    0x39: "CODECOPY",
    0x3a: "GASPRICE",
    0x3b: "EXTCODESIZE",
    0x3c: "EXTCODECOPY",
    0x3d: "RETURNDATASIZE",
    0x3e: "RETURNDATACOPY",
    0x3f: "EXTCODEHASH",
    0x40: "BLOCKHASH",
    0x41: "COINBASE",
    0x42: "TIMESTAMP",
    0x43: "NUMBER",
    0x44: "DIFFICULTY",
    0x45: "GASLIMIT",
    0x46: "CHAINID",
    0x47: "SELFBALANCE",
    0x48: "BASEFEE",
    0x50: "POP",
    0x51: "MLOAD",
    0x52: "MSTORE",
    0x53: "MSTORE8",
    0x54: "SLOAD",
    0x55: "SSTORE",
    0x56: "JUMP",
    0x57: "JUMPI",
    0x58: "PC",
    0x59: "MSIZE",
    0x5a: "GAS",
    0x5b: "JUMPDEST",
    0x60: "PUSH1",
    0x61: "PUSH2",
    0x62: "PUSH3",
    0x63: "PUSH4",
    0x64: "PUSH5",
    0x65: "PUSH6",
    0x66: "PUSH7",
    0x67: "PUSH8",
    0x68: "PUSH9",
    0x69: "PUSH10",
    0x6a: "PUSH11",
    0x6b: "PUSH12",
    0x6c: "PUSH13",
    0x6d: "PUSH14",
    0x6e: "PUSH15",
    0x6f: "PUSH16",
    0x70: "PUSH17",
    0x71: "PUSH18",
    0x72: "PUSH19",
    0x73: "PUSH20",
    0x74: "PUSH21",
    0x75: "PUSH22",
    0x76: "PUSH23",
    0x77: "PUSH24",
    0x78: "PUSH25",
    0x79: "PUSH26",
    0x7a: "PUSH27",
    0x7b: "PUSH28",
    0x7c: "PUSH29",
    0x7d: "PUSH30",
    0x7e: "PUSH31",
    0x7f: "PUSH32",
    0x80: "DUP1",
    0x81: "DUP2",
    0x82: "DUP3",
    0x83: "DUP4",
    0x84: "DUP5",
    0x85: "DUP6",
    0x86: "DUP7",
    0x87: "DUP8",
    0x88: "DUP9",
    0x89: "DUP10",
    0x8a: "DUP11",
    0x8b: "DUP12",
    0x8c: "DUP13",
    0x8d: "DUP14",
    0x8e: "DUP15",
    0x8f: "DUP16",
    0x90: "SWAP1",
    0x91: "SWAP2",
    0x92: "SWAP3",
    0x93: "SWAP4",
    0x94: "SWAP5",
    0x95: "SWAP6",
    0x96: "SWAP7",
    0x97: "SWAP8",
    0x98: "SWAP9",
    0x99: "SWAP10",
    0x9a: "SWAP11",
    0x9b: "SWAP12",
    0x9c: "SWAP13",
    0x9d: "SWAP14",
    0x9e: "SWAP15",
    0x9f: "SWAP16",
    0xa0: "LOG0",
    0xa1: "LOG1",
    0xa2: "LOG2",
    0xa3: "LOG3",
    0xa4: "LOG4",
    0xf0: "CREATE",
    0xf1: "CALL",
    0xf2: "CALLCODE",
    0xf3: "RETURN",
    0xf4: "DELEGATECALL",
    0xf5: "CREATE2",
    0xfa: "STATICCALL",
    0xfd: "REVERT",
    0xfe: "INVALID",
    0xff: "SELFDESTRUCT",
  };

  const REVERSE_OPCODES: { [key: string]: number } = {};
  Object.entries(OPCODES).forEach(([key, value]) => {
    REVERSE_OPCODES[value] = parseInt(key);
  });

  const handleBytecodeToOpcode = () => {
    if (!bytecodeInput.trim()) return;

    setConversionError("");
    setOpcodeOutput("");

    try {
      const input = bytecodeInput.trim().replace(/0x/gi, "");
      const bytes = input.match(/.{1,2}/g);

      if (!bytes) {
        setConversionError("Invalid bytecode format. Please check your input.");
        return;
      }

      let i = 0;
      let result = "";

      while (i < bytes.length) {
        const byte = parseInt(bytes[i], 16);

        if (isNaN(byte)) {
          setConversionError(`Invalid hex byte at position ${i}: ${bytes[i]}`);
          return;
        }

        // Handle unknown opcodes more gracefully
        const opcode =
          OPCODES[byte] ||
          `UNKNOWN_0x${byte.toString(16).toUpperCase().padStart(2, "0")}`;
        result += `${opcode}`;

        if (opcode.startsWith("PUSH")) {
          const pushBytes = byte - 0x5f;
          const data = bytes.slice(i + 1, i + 1 + pushBytes).join("");
          result += ` 0x${data}`;
          i += pushBytes;
        }

        result += "\n";
        i++;
      }

      setOpcodeOutput(result);
    } catch (error) {
      setConversionError("Error processing bytecode. Please check your input.");
    }
  };

  const handleOpcodeToBytecode = () => {
    if (!opcodeInput.trim()) return;

    setConversionError("");
    setBytecodeOutput("");

    try {
      const lines = opcodeInput
        .trim()
        .split("\n")
        .filter((line) => line.trim());
      let result = "";

      for (const line of lines) {
        const parts = line.trim().split(/\s+/);
        const opcode = parts[0].toUpperCase();

        // Handle unknown opcodes that were converted from bytecode
        if (opcode.startsWith("UNKNOWN_0x")) {
          const hexValue = opcode.replace("UNKNOWN_0x", "");
          result += hexValue;
        } else if (REVERSE_OPCODES[opcode] !== undefined) {
          const bytecode = REVERSE_OPCODES[opcode]
            .toString(16)
            .padStart(2, "0");
          result += bytecode;

          if (opcode.startsWith("PUSH") && parts[1]) {
            const data = parts[1].replace(/0x/gi, "");
            result += data;
          }
        } else {
          setConversionError(`Unknown opcode: ${opcode}`);
          return;
        }
      }

      setBytecodeOutput(result.toUpperCase());
    } catch (error) {
      setConversionError("Error processing opcodes. Please check your input.");
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

  const clearBytecode = () => {
    setBytecodeInput("");
    setOpcodeOutput("");
    setConversionError("");
  };

  const clearOpcode = () => {
    setOpcodeInput("");
    setBytecodeOutput("");
    setConversionError("");
  };

  const commonBytecodeExamples: QuickExample[] = [
    {
      label: "Simple Contract Creation",
      value:
        "608060405234801561001057600080fd5b50600436106100365760003560e01c8063a41368621461003b578063cfae321714610045575b600080fd5b610043610063565b005b61004d6100a4565b60405161005a9190610137565b60405180910390f35b6040518060400160405280600d81526020017f48656c6c6f2c20576f726c642100000000000000000000000000000000000000815250600090805190602001906100af929190610142565b50565b6060600080546100c1906101a8565b80601f01602080910402602001604051908101604052809291908181526020018280546100ed906101a8565b801561013a5780601f1061010f5761010080835404028352916020019161013a565b820191906000526020600020905b81548152906001019060200180831161011d57829003601f168201915b5050505050905090565b600060208201905081810360008301526101518184610159565b905092915050565b600082825260208201905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806101c057607f821691505b6020821081036101d3576101d2610179565b5b5091905056fea26469706673582212209d1d7f4d7e4d7e4d7e4d7e4d7e4d7e4d7e4d7e4d7e4d7e4d7e4d7e4d7e4d7e64736f6c63430008110033",
    },
    {
      label: "Simple Storage",
      value:
        "6080604052348015600f57600080fd5b5060043610603c5760003560e01c80632e64cec11460415780636057361d146051575b600080fd5b6047605b565b60405190815260200160405180910390f35b6059605c366004605e565b505050565b60005490565b5b50565b600060208284031215606f57600080fd5b503591905056fea2646970667358221220",
    },
  ];

  const handleQuickExample = (example: QuickExample) => {
    setBytecodeInput(example.value);
    setOpcodeOutput("");
    setConversionError("");
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
              BNB / EVM Bytecode Converter
            </h1>
          </div>
          <p className="text-[16px]" style={{ color: "#8e8e93" }}>
            Convert between EVM bytecode and opcodes in both directions
          </p>
        </div>

        {/* Bytecode to Opcode Section */}
        <div
          className="border rounded-2xl p-6 mb-8 shadow-sm"
          style={{
            backgroundColor: "white",
            borderColor: "#e5e5e7",
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Code className="w-5 h-5" style={{ color: "var(--color-brand)" }} />
            <h3
              className="text-lg font-semibold"
              style={{ color: "var(--color-dark)" }}
            >
              Bytecode to Opcodes
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label
                className="block text-base font-medium mb-2"
                style={{ color: "var(--color-dark)" }}
              >
                Bytecode (Hex)
              </label>
              <div className="relative">
                <textarea
                  value={bytecodeInput}
                  onChange={(e) => setBytecodeInput(e.target.value)}
                  placeholder="Paste hex bytecode here (0x prefix optional)..."
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
                {bytecodeInput && (
                  <button
                    onClick={clearBytecode}
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
              onClick={handleBytecodeToOpcode}
              disabled={!bytecodeInput.trim()}
              className="w-full sm:w-auto px-6 py-3 text-white rounded-xl font-medium transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: bytecodeInput.trim()
                  ? "var(--color-brand)"
                  : "#d1d1d6",
              }}
              onMouseEnter={(e) => {
                if (bytecodeInput.trim()) {
                  e.currentTarget.style.backgroundColor = "#2062E5";
                }
              }}
              onMouseLeave={(e) => {
                if (bytecodeInput.trim()) {
                  e.currentTarget.style.backgroundColor = "var(--color-brand)";
                }
              }}
            >
              Convert to Opcodes
            </button>

            {opcodeOutput && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    className="block text-base font-medium"
                    style={{ color: "var(--color-dark)" }}
                  >
                    Opcodes Output
                  </label>
                  <button
                    onClick={() => handleCopy(opcodeOutput)}
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
                <pre
                  className="w-full h-40 p-4 border rounded-xl overflow-auto text-sm font-mono whitespace-pre-wrap"
                  style={{
                    backgroundColor: "var(--color-light)",
                    borderColor: "#e5e5e7",
                    color: "var(--color-dark)",
                  }}
                >
                  {opcodeOutput}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Opcode to Bytecode Section */}
        <div
          className="border rounded-2xl p-6 mb-8 shadow-sm"
          style={{
            backgroundColor: "white",
            borderColor: "#e5e5e7",
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Cpu className="w-5 h-5" style={{ color: "var(--color-brand)" }} />
            <h3
              className="text-lg font-semibold"
              style={{ color: "var(--color-dark)" }}
            >
              Opcodes to Bytecode
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label
                className="block text-base font-medium mb-2"
                style={{ color: "var(--color-dark)" }}
              >
                Opcodes (One per line)
              </label>
              <div className="relative">
                <textarea
                  value={opcodeInput}
                  onChange={(e) => setOpcodeInput(e.target.value)}
                  placeholder={`PUSH1 0x60\nPUSH1 0x40\nMSTORE\nSTOP`}
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
                {opcodeInput && (
                  <button
                    onClick={clearOpcode}
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
              onClick={handleOpcodeToBytecode}
              disabled={!opcodeInput.trim()}
              className="w-full sm:w-auto px-6 py-3 text-white rounded-xl font-medium transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: opcodeInput.trim()
                  ? "var(--color-brand)"
                  : "#d1d1d6",
              }}
              onMouseEnter={(e) => {
                if (opcodeInput.trim()) {
                  e.currentTarget.style.backgroundColor = "#2062E5";
                }
              }}
              onMouseLeave={(e) => {
                if (opcodeInput.trim()) {
                  e.currentTarget.style.backgroundColor = "var(--color-brand)";
                }
              }}
            >
              Convert to Bytecode
            </button>

            {bytecodeOutput && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    className="block text-base font-medium"
                    style={{ color: "var(--color-dark)" }}
                  >
                    Bytecode Output
                  </label>
                  <button
                    onClick={() => handleCopy(bytecodeOutput)}
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
                <div className="relative">
                  <textarea
                    value={bytecodeOutput}
                    readOnly
                    className="w-full h-32 p-4 border rounded-xl resize-none break-all font-mono text-sm"
                    style={{
                      backgroundColor: "var(--color-light)",
                      borderColor: "#e5e5e7",
                      color: "var(--color-dark)",
                    }}
                  />
                </div>
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
          <div className="grid grid-cols-1 gap-3">
            {commonBytecodeExamples.map((example, index) => (
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
                  className="text-sm font-medium mb-1"
                  style={{ color: "#0b57d0" }}
                >
                  {example.label}
                </div>
                <div
                  className="text-xs font-mono truncate"
                  style={{ color: "var(--color-brand)" }}
                >
                  {example.value.substring(0, 80)}...
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
                Bytecode to Opcodes:
              </h4>
              <p>
                Paste raw hex bytecode (with or without 0x prefix) to convert it
                into human-readable EVM opcodes. PUSH instructions will show
                their data values.
              </p>
            </div>
            <div>
              <h4
                className="font-medium mb-2"
                style={{ color: "var(--color-dark)" }}
              >
                Opcodes to Bytecode:
              </h4>
              <p>
                Enter opcodes one per line (e.g., "PUSH1 0x60") to convert them
                back to hex bytecode. Use proper opcode names and hex values for
                PUSH instructions.
              </p>
            </div>
            <div>
              <h4
                className="font-medium mb-2"
                style={{ color: "var(--color-dark)" }}
              >
                Supported Networks:
              </h4>
              <p>
                Works with Binance Smart Chain (BSC), Ethereum, and other
                EVM-compatible networks that use the same opcode set.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm" style={{ color: "#8e8e93" }}>
          <p>
            Essential tool for smart contract developers and security
            researchers
          </p>
        </div>
      </div>
    </div>
  );
}
