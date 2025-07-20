"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  AppChainIcon,
  DedicatedNodesIcon,
  ForkIcon,
  GithubIcon,
  RpcServiceIcon,
  StarIcon,
} from "./Icons";
import { GithubButton } from "./GithubActionButton";

// TypeScript interfaces
interface NavItem {
  title: string;
  subtitle?: string;
  badge?: string;
  icon: React.ReactElement;
  href: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Single array containing all navigation sections
  const navSections: NavSection[] = [
    {
      title: "Documentation",
      items: [
        {
          icon: <RpcServiceIcon />,
          title: "Getting Started",
          subtitle: "Quick start guide",
          href: "/docs/getting-started",
        },
      ],
    },
    {
      title: "Explorers",
      items: [
        {
          icon: <AppChainIcon />,
          title: "BscScan",
          subtitle: "Build custom blockchain",
          href: "https://bscscan.com/",
        },
        {
          icon: <AppChainIcon />,
          title: "OKLink (BNB Chain Explorer)",
          subtitle: "Build custom blockchain",
          href: "https://www.oklink.com/bsc",
        },
        {
          icon: <AppChainIcon />,
          title: "Bitquery Explorer",
          subtitle: "Build custom blockchain",
          href: "https://explorer.bitquery.io/bsc",
        },
        {
          icon: <AppChainIcon />,
          title: "DexGuru",
          subtitle: "Build custom blockchain",
          href: "https://dex.guru/",
        },
        {
          icon: <AppChainIcon />,
          title: "Bloxy Explorer",
          subtitle: "Build custom blockchain",
          href: "https://bloxy.info/",
        },
        {
          icon: <AppChainIcon />,
          title: "BSC Trace",
          subtitle: "Build custom blockchain",
          href: "https://bsctrace.com/",
        },
        {
          icon: <AppChainIcon />,
          title: "Tokenview (BNB Chain Explorer)",
          subtitle: "Build custom blockchain",
          href: "https://bsc.tokenview.io/",
        },
        {
          icon: <AppChainIcon />,
          title: "Blockchair (BNB Smart Chain)",
          subtitle: "Build custom blockchain",
          href: "https://blockchair.com/binance-smart-chain",
        },
        {
          icon: <AppChainIcon />,
          title: "BscScan Testnet",
          subtitle: "Build custom blockchain",
          href: "https://testnet.bscscan.com/",
        },
        {
          icon: <AppChainIcon />,
          title: "AtomScan (BSC)",
          subtitle: "Build custom blockchain",
          href: "https://atoms.xyz/bsc",
        },
      ],
    },

    {
      title: "Developers",
      items: [
        {
          icon: <DedicatedNodesIcon />,
          title: "Low Level Interactions",
          subtitle: "Private-based nodes",
          badge: "Beta",
          href: "/developers/low-level",
        },
        {
          icon: <RpcServiceIcon />,
          title: "Unit Converter",
          subtitle: "Wei unit converter",
          href: "/developers/unit-converter",
        },
      ],
    },
  ];

  // Create a unique key for each item across all sections
  const createItemKey = (sectionIndex: number, itemIndex: number) =>
    `${sectionIndex}-${itemIndex}`;

  // Function to handle link clicks
  const handleLinkClick = () => {
    setIsOpen(false);
    setActiveIndex(null);
  };

  // Function to handle touch/click on items
  const handleTouch = (itemKey: string) => {
    setActiveIndex((prev) => (prev === itemKey ? null : itemKey));
  };

  // Control body overflow when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Detect outside clicks to reset activeIndex
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveIndex(null);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="bg-white fixed top-0 left-0 right-0 z-100">
      <header className="px-4 py-3 w-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <h3 className="font-poppins text-[22px] tracking-[2px] text-brand">
            DEXFLORA
          </h3>
        </Link>

        {/* Navigation */}
        <ul className="text-[14px] font-medium flex items-center space-x-2 max-md:hidden">
          {navSections.map((section) => (
            <li
              key={section.title}
              className="flex items-center gap-2 cursor-pointer transition-all ease-in-out hover:bg-light px-[12px] py-2 rounded-md"
            >
              <span>{section.title}</span>
              <img src="/assets/icons/chevron-down.svg" alt="Chevron Down" />
            </li>
          ))}
        </ul>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 text-[16px] font-medium max-md:hidden">
          <GithubButton />
          <button className="px-4 bg-brand hover:bg-[#2062E5] text-white py-2 rounded-xl flex items-center gap-2 transition-all ease-in-out cursor-pointer">
            <span>Dashboard</span>
            <img src="/assets/icons/cursor-click.svg" alt="Cursor Click" />
          </button>
        </div>

        {/* Mobile Hamburger Menu */}
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="w-13 h-13 bg-brand active:bg-[#2062E5] text-white rounded-2xl flex items-center justify-center transition-transform duration-150 ease-in-out cursor-pointer active:scale-90 md:hidden"
        >
          <img
            src="/assets/icons/hamburger.svg"
            alt="Hamburger"
            className={`${isOpen ? "hidden" : "block"}`}
          />
          <img
            src="/assets/icons/x-close-white.svg"
            alt="Close"
            className={`${isOpen ? "block" : "hidden"}`}
          />
        </button>
      </header>

      {/* Mobile Menu Content */}
      {isOpen && (
        <div
          ref={menuRef}
          className="absolute z-50 bg-white pb-50 top-[75px] left-0 w-full px-4 sm:px-10 h-screen overflow-y-auto sm:hidden"
        >
          <div className="grid sm:grid-cols-2 items-center gap-3 sm:gap-2 text-[16px] font-medium mt-4">
            <GithubButton className="justify-center w-full py-4" />
            <button className="justify-center p-4 bg-brand active:bg-[#2062E5] text-white rounded-xl flex items-center gap-2 transition-all ease-in-out cursor-pointer">
              <span>Dashboard</span>
              <img src="/assets/icons/cursor-click.svg" alt="Cursor Click" />
            </button>
          </div>

          {/* Loop through all sections */}
          {navSections.map((section, sectionIndex) => (
            <div key={section.title} className="mt-8">
              <h3 className="text-[18px] font-bold mb-12">{section.title}</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {section.items.map((item, itemIndex) => {
                  const itemKey = createItemKey(sectionIndex, itemIndex);
                  const isTouched = activeIndex === itemKey;
                  const isCurrentPath = pathname === item.href;
                  const isActive = isTouched || isCurrentPath;
                  const isExplorer = section.title === "Explorers";

                  return (
                    <a
                      href={item.href}
                      key={itemKey}
                      // onClick={() => handleTouch(itemKey)}
                      onClick={handleLinkClick}
                      className={`rounded-2xl p-2 flex items-center gap-4 transition-all duration-150 ease-in-out cursor-pointer ${
                        isActive ? "bg-light" : "bg-transparent"
                      }`}
                      target={isExplorer ? "_blank" : "_self"}
                      rel={isExplorer ? "noopener noreferrer" : undefined}
                    >
                      <div
                        className={`w-13 h-13 rounded-2xl flex items-center justify-center transition-all duration-150 ease-in-out text-[#2772F5] ${
                          isActive ? "bg-[#2062E5] text-white" : "bg-[#ebf3ff]"
                        }`}
                      >
                        {item.icon}
                      </div>

                      <div>
                        <div className="font-medium">
                          <div className="flex items-center gap-2">
                            <p className="text-[16px]">{item.title}</p>
                            {item.badge && (
                              <span className="text-[10px] bg-[#FFF4E6] text-[#FF9500] px-2 rounded-xl">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          {item.subtitle && (
                            <p className="text-[12px] text-[#8e8e93]">
                              {item.subtitle}
                            </p>
                          )}
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
