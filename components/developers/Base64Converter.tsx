"use client";
import React, { useState, useRef } from "react";
import { Copy, Upload, Download, X } from "lucide-react";
import { Image as ImageIcon } from "lucide-react"; 

interface QuickExample {
  label: string;
  value: string;
}

export function Base64Converter() {
  const [base64Input, setBase64Input] = useState<string>("");
  const [base64Output, setBase64Output] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBase64ToImage = () => {
    if (!base64Input.trim()) return;

    setImageError("");
    setImagePreview("");

    try {
      let base64Image: string;
      const trimmedInput = base64Input.trim();

      if (trimmedInput.startsWith("data:image")) {
        base64Image = trimmedInput;
      } else {
        const cleanBase64 = trimmedInput.replace(/\s/g, "");
        base64Image = `data:image/png;base64,${cleanBase64}`;
      }

      const testImg = document.createElement("img");

      testImg.onload = () => {
        setImagePreview(base64Image);
        setImageError("");
      };

      testImg.onerror = () => {
        setImageError("Invalid Base64 image data. Please check your input.");
        setImagePreview("");
      };

      testImg.src = base64Image;
    } catch (error) {
      setImageError("Error processing Base64 data. Please check your input.");
      setImagePreview("");
    }
  };

  const handleImageToBase64 = () => {
    if (!selectedFile) {
      alert("Please select an image file first.");
      return;
    }

    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (e.target?.result) {
        setBase64Output(e.target.result as string);
      }
    };

    reader.onerror = () => {
      alert("Error reading file");
    };

    reader.readAsDataURL(selectedFile);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }
      setSelectedFile(file);
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

  const handleDownloadImage = () => {
    if (!imagePreview) return;

    try {
      const link = document.createElement("a");
      link.download = "converted-image.png";
      link.href = imagePreview;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  const clearImage = () => {
    setImagePreview("");
    setBase64Input("");
    setImageError("");
  };

  const clearFile = () => {
    setSelectedFile(null);
    setBase64Output("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const commonBase64Examples: QuickExample[] = [
    {
      label: "Small Red Pixel",
      value:
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    },
    {
      label: "Small Blue Pixel",
      value:
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPg/EwAChAGA3+e6kgAAAABJRU5ErkJggg==",
    },
  ];

  const handleQuickExample = (example: QuickExample) => {
    setBase64Input(example.value);
    setImageError("");
    setImagePreview("");
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
              Base64 Converter
            </h1>
          </div>
          <p className="text-[16px]" style={{ color: "#8e8e93" }}>
            Convert between Base64 strings and images in both directions
          </p>
        </div>

        {/* Base64 to Image Section */}
        <div
          className="border rounded-2xl p-6 mb-8 shadow-sm"
          style={{
            backgroundColor: "white",
            borderColor: "#e5e5e7",
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <ImageIcon
              className="w-5 h-5"
              style={{ color: "var(--color-brand)" }}
            />
            <h3
              className="text-lg font-semibold"
              style={{ color: "var(--color-dark)" }}
            >
              Base64 to Image
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label
                className="block text-[16px] font-medium mb-2"
                style={{ color: "var(--color-dark)" }}
              >
                Base64 String
              </label>
              <div className="relative">
                <textarea
                  value={base64Input}
                  onChange={(e) => setBase64Input(e.target.value)}
                  placeholder="Paste Base64 string here (with or without data:image prefix)..."
                  className="w-full h-32 p-4 border rounded-xl outline-none resize-none transition-all duration-150"
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
                {base64Input && (
                  <button
                    onClick={clearImage}
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
              onClick={handleBase64ToImage}
              disabled={!base64Input.trim()}
              className="w-full sm:w-auto px-6 py-3 text-white rounded-xl font-medium transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: base64Input.trim()
                  ? "var(--color-brand)"
                  : "#d1d1d6",
              }}
              onMouseEnter={(e) => {
                if (base64Input.trim()) {
                  e.currentTarget.style.backgroundColor = "#2062E5";
                }
              }}
              onMouseLeave={(e) => {
                if (base64Input.trim()) {
                  e.currentTarget.style.backgroundColor = "var(--color-brand)";
                }
              }}
            >
              Convert to Image
            </button>

            {imageError && (
              <div
                className="p-3 rounded-lg"
                style={{ backgroundColor: "#ffe6e6", color: "#d70015" }}
              >
                {imageError}
              </div>
            )}

            {imagePreview && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <h4
                    className="font-medium"
                    style={{ color: "var(--color-dark)" }}
                  >
                    Generated Image
                  </h4>
                  <button
                    onClick={handleDownloadImage}
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
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
                <div className="border rounded-xl p-4 bg-gray-50">
                  <img
                    src={imagePreview}
                    alt="Converted from Base64"
                    className="max-w-full h-auto rounded-lg shadow-sm"
                    style={{ maxHeight: "400px" }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Image to Base64 Section */}
        <div
          className="border rounded-2xl p-6 mb-8 shadow-sm"
          style={{
            backgroundColor: "white",
            borderColor: "#e5e5e7",
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Upload
              className="w-5 h-5"
              style={{ color: "var(--color-brand)" }}
            />
            <h3
              className="text-lg font-semibold"
              style={{ color: "var(--color-dark)" }}
            >
              Image to Base64
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label
                className="block text-[16px] font-medium mb-2"
                style={{ color: "var(--color-dark)" }}
              >
                Select Image File
              </label>
              <div className="flex items-center gap-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-3 border rounded-xl transition-all duration-150"
                  style={{
                    borderColor: "#e5e5e7",
                    color: "var(--color-dark)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--color-brand)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#e5e5e7";
                  }}
                >
                  <Upload className="w-5 h-5" />
                  Choose File
                </button>
                {selectedFile && (
                  <div className="flex items-center gap-2">
                    <span
                      className="text-sm"
                      style={{ color: "var(--color-dark)" }}
                    >
                      {selectedFile.name}
                    </span>
                    <button
                      onClick={clearFile}
                      className="transition-colors"
                      style={{ color: "#8e8e93" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "#ff3b30";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "#8e8e93";
                      }}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleImageToBase64}
              disabled={!selectedFile}
              className="w-full sm:w-auto px-6 py-3 text-white rounded-xl font-medium transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: selectedFile
                  ? "var(--color-brand)"
                  : "#d1d1d6",
              }}
              onMouseEnter={(e) => {
                if (selectedFile) {
                  e.currentTarget.style.backgroundColor = "#2062E5";
                }
              }}
              onMouseLeave={(e) => {
                if (selectedFile) {
                  e.currentTarget.style.backgroundColor = "var(--color-brand)";
                }
              }}
            >
              Convert to Base64
            </button>

            {base64Output && (
              <div className="space-y-2">
                <label
                  className="block text-[16px] font-medium"
                  style={{ color: "var(--color-dark)" }}
                >
                  Base64 Output
                </label>
                <div className="relative">
                  <textarea
                    value={base64Output}
                    readOnly
                    className="w-full h-32 p-4 pr-12 border rounded-xl resize-none break-all"
                    style={{
                      backgroundColor: "var(--color-light)",
                      borderColor: "#e5e5e7",
                      color: "var(--color-dark)",
                    }}
                  />
                  <button
                    onClick={() => handleCopy(base64Output)}
                    className="absolute top-3 right-3 transition-colors"
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
            {commonBase64Examples.map((example, index) => (
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
                  className="text-xs mt-1 font-mono truncate"
                  style={{ color: "var(--color-brand)" }}
                >
                  {example.value.substring(0, 40)}...
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
                Base64 to Image:
              </h4>
              <p>
                Paste a Base64 string (with or without the data:image prefix)
                and convert it to a viewable image. You can download the
                converted image to your device.
              </p>
            </div>
            <div>
              <h4
                className="font-medium mb-2"
                style={{ color: "var(--color-dark)" }}
              >
                Image to Base64:
              </h4>
              <p>
                Upload an image file and convert it to a Base64 string. The
                output includes the complete data URL that can be used directly
                in HTML or CSS.
              </p>
            </div>
            <div>
              <h4
                className="font-medium mb-2"
                style={{ color: "var(--color-dark)" }}
              >
                Supported Formats:
              </h4>
              <p>
                JPG, PNG, GIF, WebP, and other common image formats are
                supported for conversion.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm" style={{ color: "#8e8e93" }}>
          <p>
            Perfect for web developers working with embedded images and data
            URLs
          </p>
        </div>
      </div>
    </div>
  );
}
