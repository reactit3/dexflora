"use client";
import Link from "next/link";
import {
  BnbIcon,
  CoinMarketCapIcon,
  GithubIcon,
  LinkedlnIcon,
  XIcon,
} from "./Icons";
import { ExternalLink, Mail } from "lucide-react";
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
    <footer className="bg-white border-t border-gray-100 mt-16 relative ">
      <div className="  px-4 py-12">
        {/* Brand Section */}
        <div>
          <div className="md:flex md:items-center md:justify-between">
            <Link href="/" className="inline-block mb-6">
              <h3 className="font-poppins text-[22px] tracking-[2px] text-brand">
                DEXFLORA
              </h3>
            </Link>

            {/* Social Links */}
            <div className="flex items-center gap-4 mb-6">
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

          <div className="max-w-xl">
            <p className="text-gray-600 text-sm leading-relaxed mb-6 text-justify">
              A simple, browser-based platform for interacting with blockchain
              JSON-RPC endpoints, complete with a suite of additional tools to
              enhance your development and testing experience.
            </p>

            {/* Disclaimer */}
            <p className="text-xs text-gray-600 leading-relaxed mb-6 text-justify">
              <strong>Disclaimer:</strong> Dexflora is an independent entity and
              is not partnered with, affiliated with, managed by BNB or BNB
              Chain© in any way. Dexflora does not control or manage any
              official BNB social media accounts, nor does it offer any services
              on behalf of BNB or BNB Chain.
            </p>
          </div>
        </div>
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
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

      {/* Mail  */}
      <a
        href="mailto:legal@dexflora.com"
        className="fixed bottom-12 right-4 bg-brand text-white hover:bg-[#2062E5] transition-all ease-in-out p-3 rounded-full cursor-pointer"
      >
        <Mail className="size-5" />
      </a>
    </footer>
  );
}
