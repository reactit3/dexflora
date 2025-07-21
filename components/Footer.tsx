"use client";
import Link from "next/link";
import {
  AppChainIcon,
  BnbIcon,
  CoinMarketCapIcon,
  DedicatedNodesIcon,
  FaqIcon,
  GithubIcon,
  LinkedlnIcon,
  RpcServiceIcon,
  XIcon,
} from "./Icons";
import {
  Globe,
  FileImage,
  Code2,
  Type,
  Github,
  Twitter,
  Mail,
  ExternalLink,
} from "lucide-react";
import { navSections } from "@/lib/data";

export function Footer() {
  const socialLinks = [
    {
      name: "BNB Chain",
      icon: <BnbIcon />,
      href: "https://www.bnbchain.org/en",
    },
    {
      name: "X",
      icon: <XIcon />,
      href: "https://twitter.com/BNBChain",
    },
    {
      name: "GitHub",
      icon: <GithubIcon />,
      href: "https://github.com/bnb-chain",
    },

    {
      name: "Coin Market Cap",
      icon: <CoinMarketCapIcon />,
      href: "https://coinmarketcap.com/community/profile/BNBChain",
    },
    {
      name: "Linkedln",
      icon: <LinkedlnIcon />,
      href: "https://www.linkedin.com/company/bnbchaininnovation",
    },
  ];

  return (
    <footer className="bg-white border-t border-gray-100 mt-16 ">
      <div className="  px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <h3 className="font-poppins text-[22px] tracking-[2px] text-brand font-bold">
                DEXFLORA
              </h3>
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Your comprehensive platform for BNB Smart Chain exploration,
              development tools, and blockchain analytics.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 rounded-xl bg-[#ebf3ff] flex items-center justify-center text-[#0b57d0] transition-all ease-in-out hover:bg-[#D6E6FF] `}
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links Sections */}
          {navSections.map((section, sectionIndex) => (
            <div key={section.title} className="lg:col-span-1">
              <h4 className="text-gray-900 font-semibold text-sm mb-6 tracking-wide uppercase">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.items.map((item, itemIndex) => {
                  const isExternal = item.href.startsWith("https");
                  return (
                    <li key={itemIndex}>
                      <a
                        href={item.href}
                        target={isExternal ? "_blank" : "_self"}
                        rel={isExternal ? "noopener noreferrer" : undefined}
                        className="group flex items-center gap-3 text-gray-600 hover:text-brand transition-colors duration-200 text-sm"
                      >
                        <span className="group-hover:translate-x-1 transition-transform duration-200">
                          {item.title}
                        </span>
                        {isExternal && (
                          <ExternalLink
                            size={12}
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          />
                        )}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <div className="text-gray-600 text-sm">
              © {new Date().getFullYear()} DEXFLORA. All rights reserved.
            </div>

            {/* Status Indicator */}
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-600">All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
