"use client";

import React, { useState } from "react";
import { Shield, FileText, ChevronDown, ChevronUp } from "lucide-react";

export default function PrivacyPolicyPage() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const sections = [
    {
      id: "privacy",
      title: "Privacy Policy",
      icon: Shield,
      content: (
        <div className="space-y-6">
          <div className="mb-6">
            <p
              className="text-sm font-medium mb-4"
              style={{ color: "#8e8e93" }}
            >
              LAST UPDATED: 21 July, 2025
            </p>
            <p className="mb-4" style={{ color: "var(--color-dark)" }}>
              At Dexflora, we respect your privacy and are committed to
              protecting it. This Privacy Policy explains what personal data (if
              any) we collect, how we use it, and your rights.
            </p>
            <p className="mb-4" style={{ color: "var(--color-dark)" }}>
              If you do not agree with our policies and practices, please
              discontinue your use of Dexflora.
            </p>
            <p style={{ color: "var(--color-dark)" }}>
              This Policy is aligned with the European Union General Data
              Protection Regulation (EU 2016/679, "GDPR"), the California
              Consumer Privacy Act ("CCPA"), and other applicable privacy laws.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <h4
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--color-dark)" }}
              >
                Who We Are
              </h4>
              <p style={{ color: "var(--color-dark)" }}>
                Dexflora is a simple browser-based tool that allows users to
                interact directly with blockchain JSON-RPC endpoints.
              </p>
            </div>

            <div>
              <h4
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--color-dark)" }}
              >
                What Data We Collect and How We Collect It
              </h4>
              <div className="space-y-3" style={{ color: "var(--color-dark)" }}>
                <p>
                  Dexflora does not collect, store, or process any personal
                  data.
                </p>
                <p>
                  All RPC calls and responses happen directly between your
                  browser and the selected blockchain node.
                </p>
                <p>
                  Dexflora does not have access to your blockchain keys,
                  accounts, or any sensitive information.
                </p>
                <p>No cookies, trackers, or analytics scripts are used.</p>
                <p>
                  We do not require registration, account creation, or
                  submission of any personal information to use the tool.
                </p>
              </div>
            </div>

            <div>
              <h4
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--color-dark)" }}
              >
                Third-Party Services
              </h4>
              <div className="space-y-3" style={{ color: "var(--color-dark)" }}>
                <p>
                  Dexflora communicates directly with public blockchain RPC
                  endpoints. Data transmitted depends on your interactions with
                  those nodes. Please review the privacy practices of any RPC
                  provider you choose to use.
                </p>
                <p>
                  Dexflora is not responsible for how any third-party service
                  providers process your data.
                </p>
              </div>
            </div>

            <div>
              <h4
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--color-dark)" }}
              >
                Your Rights
              </h4>
              <div className="space-y-3" style={{ color: "var(--color-dark)" }}>
                <p>
                  Since Dexflora does not collect or process personal data,
                  there is no user data to manage, access, or erase.
                </p>
                <p>
                  If you believe any third-party provider accessed your personal
                  data through the use of Dexflora, please contact them
                  directly.
                </p>
              </div>
            </div>

            <div>
              <h4
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--color-dark)" }}
              >
                Updates to This Policy
              </h4>
              <p style={{ color: "var(--color-dark)" }}>
                We may update this Privacy Policy from time to time to reflect
                changes in our practices or legal requirements. The latest
                version will always be available on this page.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "terms",
      title: "Terms of Service",
      icon: FileText,
      content: (
        <div className="space-y-6">
          <div className="mb-6">
            <p
              className="text-sm font-medium mb-4"
              style={{ color: "#8e8e93" }}
            >
              LAST UPDATED: 21 July, 2025
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <h4
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--color-dark)" }}
              >
                1. Introduction
              </h4>
              <p style={{ color: "var(--color-dark)" }}>
                Welcome to Dexflora, a simple browser-based tool for interacting
                with blockchain JSON-RPC endpoints (the "Service"). By using
                Dexflora, you agree to these Terms of Service ("Terms"). If you
                do not agree, please stop using the Service.
              </p>
            </div>

            <div>
              <h4
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--color-dark)" }}
              >
                2. Use of the Service
              </h4>
              <div className="space-y-3" style={{ color: "var(--color-dark)" }}>
                <p>
                  Dexflora is a free, open tool provided for developers,
                  researchers, and blockchain enthusiasts.
                </p>
                <p>
                  You are free to use, modify, and distribute Dexflora for
                  personal or commercial purposes.
                </p>
                <p>No registration or payment is required.</p>
                <p>
                  The Service does not guarantee the availability, accuracy, or
                  uptime of any RPC endpoints accessed through it.
                </p>
              </div>
            </div>

            <div>
              <h4
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--color-dark)" }}
              >
                3. No Warranties
              </h4>
              <div className="space-y-3" style={{ color: "var(--color-dark)" }}>
                <p>
                  Dexflora is provided "as is" and "as available". We make no
                  warranties or representations regarding the Service's
                  functionality, availability, or accuracy.
                </p>
                <p>We are not liable for:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Loss of data</li>
                  <li>Misuse of the Service by third parties</li>
                  <li>Any damages arising from your use of public RPC nodes</li>
                </ul>
              </div>
            </div>

            <div>
              <h4
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--color-dark)" }}
              >
                4. User Responsibility
              </h4>
              <div className="space-y-3" style={{ color: "var(--color-dark)" }}>
                <p>By using Dexflora, you acknowledge:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>
                    You are responsible for all interactions with public
                    blockchain nodes.
                  </li>
                  <li>
                    You will not use the Service for any illegal or unauthorized
                    purpose.
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <h4
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--color-dark)" }}
              >
                5. Intellectual Property
              </h4>
              <p style={{ color: "var(--color-dark)" }}>
                Dexflora's code and interface are provided under open usage
                rights. You may reuse, adapt, or redistribute them in compliance
                with applicable open-source licenses if stated.
              </p>
            </div>

            <div>
              <h4
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--color-dark)" }}
              >
                6. Modifications
              </h4>
              <p style={{ color: "var(--color-dark)" }}>
                We may update these Terms at any time. Changes will be posted on
                this page. Your continued use of Dexflora means you accept any
                updates.
              </p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen p-4" style={{ backgroundColor: "#f5f5f7" }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1
            className="text-[28px] sm:text-[32px] font-bold mb-4"
            style={{ color: "var(--color-dark)" }}
          >
            Legal Information
          </h1>
          <p className="text-[16px]" style={{ color: "#8e8e93" }}>
            Privacy Policy and Terms of Service for Dexflora
          </p>
        </div>

        {/* Legal Documents */}
        <div className="space-y-4">
          {sections.map((section) => {
            const Icon = section.icon;
            const isExpanded = expandedSection === section.id;

            return (
              <div
                key={section.id}
                className="border rounded-2xl shadow-sm overflow-hidden"
                style={{
                  backgroundColor: "white",
                  borderColor: "#e5e5e7",
                }}
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full p-6 text-left transition-all duration-150"
                  style={{ backgroundColor: isExpanded ? "#f9f9f9" : "white" }}
                  onMouseEnter={(e) => {
                    if (!isExpanded) {
                      e.currentTarget.style.backgroundColor = "#f9f9f9";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isExpanded) {
                      e.currentTarget.style.backgroundColor = "white";
                    }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon
                        className="w-6 h-6"
                        style={{ color: "var(--color-brand)" }}
                      />
                      <h2
                        className="text-xl font-semibold"
                        style={{ color: "var(--color-dark)" }}
                      >
                        {section.title}
                      </h2>
                    </div>
                    {isExpanded ? (
                      <ChevronUp
                        className="w-5 h-5"
                        style={{ color: "#8e8e93" }}
                      />
                    ) : (
                      <ChevronDown
                        className="w-5 h-5"
                        style={{ color: "#8e8e93" }}
                      />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-6 pb-6">
                    <div
                      className="border-t pt-6"
                      style={{ borderColor: "#e5e5e7" }}
                    >
                      {section.content}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
            style={{ backgroundColor: "#ebf3ff", color: "#0b57d0" }}
          >
            <Shield className="w-4 h-4" />
            <span>Your privacy is protected - no data collection</span>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm" style={{ color: "#8e8e93" }}>
          <p>Last updated: July 21, 2025</p>
        </div>
      </div>

      <style jsx>{`
        :root {
          --color-brand: #2772f5;
          --color-dark: #1d1d1f;
        }
      `}</style>
    </div>
  );
}
