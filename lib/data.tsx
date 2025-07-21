import {
  AppChainIcon,
  DedicatedNodesIcon,
  FaqIcon,
  RpcServiceIcon,
} from "@/components/Icons";
import { Globe, FileImage, Code2, Type } from "lucide-react";

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

export const navSections: NavSection[] = [
  {
    title: "Documentation",
    items: [
      {
        icon: <AppChainIcon />,
        title: "BNB chain",
        subtitle: "Developer docs for BSC",
        href: "https://docs.bnbchain.org/bnb-smart-chain/",
      },
      {
        icon: <FaqIcon />,
        title: "Privacy Policy",
        subtitle: "How we respect and protect your privacy",
        href: "/privacy-policy",
      },
    ],
  },
  {
    title: "Explorers",
    items: [
      {
        icon: <Globe size={24} />,
        title: "BscScan",
        subtitle: "Explore BNB Chain data",
        href: "https://bscscan.com/",
      },
      {
        icon: <Globe size={24} />,
        title: "OKLink (BNB Chain Explorer)",
        subtitle: "Visualize blockchain activity",
        href: "https://www.oklink.com/bsc",
      },
      {
        icon: <Globe size={24} />,
        title: "Bitquery Explorer",
        subtitle: "Query smart contract activity",
        href: "https://explorer.bitquery.io/bsc",
      },
      {
        icon: <Globe size={24} />,
        title: "DexGuru",
        subtitle: "Live DEX trades and token info",
        href: "https://dex.guru/",
      },
      {
        icon: <Globe size={24} />,
        title: "Bloxy Explorer",
        subtitle: "Detailed transaction tracking",
        href: "https://bloxy.info/",
      },
      {
        icon: <Globe size={24} />,
        title: "BSC Trace",
        subtitle: "Trace BNB chain activity",
        href: "https://bsctrace.com/",
      },
      {
        icon: <Globe size={24} />,
        title: "Tokenview (BNB Chain Explorer)",
        subtitle: "Token analytics & tracking",
        href: "https://bsc.tokenview.io/",
      },
      {
        icon: <Globe size={24} />,
        title: "Blockchair (BNB Smart Chain)",
        subtitle: "Multi-chain block explorer",
        href: "https://blockchair.com/binance-smart-chain",
      },
      {
        icon: <Globe size={24} />,
        title: "BscScan Testnet",
        subtitle: "BNB Chain testnet explorer",
        href: "https://testnet.bscscan.com/",
      },
      {
        icon: <Globe size={24} />,
        title: "AtomScan (BSC)",
        subtitle: "Minimal chain explorer",
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
      {
        icon: <FileImage size={20} />,
        title: "Base64 Converter",
        subtitle: "Base 64 to image converter",
        href: "/developers/base64-converter",
      },
      {
        icon: <Code2 size={20} />,
        title: "Bytecode Converter",
        subtitle: "Bytecode to opcode converter",
        href: "/developers/bytecode-converter",
      },
      {
        icon: <Type size={20} />,
        title: "Utf8 Converter",
        subtitle: "Utf 8 to hex and hex to utf 8",
        href: "/developers/utf8-converter",
      },
    ],
  },
];
