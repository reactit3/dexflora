"use server";

interface BNBPriceData {
  price: number;
  change24h: number;
  marketCap: string;
  volume24h: string;
}

interface BNBChainStats {
  totalTransactions: string;
  avgGasPrice: number;
  tps: number;
  txnVolume24h: string;
  latestBlock: number;
  activeAddresses: number;
}

export async function getBNBData(): Promise<{
  price: BNBPriceData | null;
  stats: BNBChainStats | null;
  error?: string;
}> {
  try {
    // Fetch BNB price from CoinGecko
    const priceResponse = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true",
      { next: { revalidate: 60 } } // Cache for 1 minute
    );

    if (!priceResponse.ok) {
      throw new Error("Failed to fetch BNB price");
    }

    const priceData = await priceResponse.json();
    const bnbData = priceData.binancecoin;

    const price: BNBPriceData = {
      price: bnbData.usd,
      change24h: bnbData.usd_24h_change,
      marketCap: (bnbData.usd_market_cap / 1e9).toFixed(2) + "B",
      volume24h: (bnbData.usd_24h_vol / 1e6).toFixed(2) + "M",
    };

    // Mock BNB Chain stats (in a real app, you'd fetch from BSC API)
    const stats: BNBChainStats = {
      totalTransactions: "8.20B",
      avgGasPrice: 0.1863,
      tps: 175.49,
      txnVolume24h: "643.77K",
      latestBlock: Math.floor(Math.random() * 1000000) + 45000000,
      activeAddresses: Math.floor(Math.random() * 50000) + 150000,
    };

    return { price, stats };
  } catch (error) {
    console.error("Error fetching BNB data:", error);
    return {
      price: null,
      stats: null,
      error: "Failed to fetch BNB data",
    };
  }
}

export async function searchBNBAddress(query: string): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> {
  try {
    // Validate if it's a valid BSC address/transaction/block
    if (!query || query.length < 10) {
      return {
        success: false,
        error:
          "Please enter a valid address, transaction hash, or block number",
      };
    }

    // Check if it's a valid Ethereum-style address
    const addressRegex = /^0x[a-fA-F0-9]{40}$/;
    const txHashRegex = /^0x[a-fA-F0-9]{64}$/;
    const blockRegex = /^\d+$/;

    let searchType = "";
    let redirectUrl = "";

    if (addressRegex.test(query)) {
      searchType = "address";
      redirectUrl = `https://bscscan.com/address/${query}`;
    } else if (txHashRegex.test(query)) {
      searchType = "transaction";
      redirectUrl = `https://bscscan.com/tx/${query}`;
    } else if (blockRegex.test(query)) {
      searchType = "block";
      redirectUrl = `https://bscscan.com/block/${query}`;
    } else {
      return {
        success: false,
        error:
          "Invalid format. Please enter a valid BSC address (0x...), transaction hash, or block number",
      };
    }

    return {
      success: true,
      data: {
        type: searchType,
        query,
        redirectUrl,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: "Search failed. Please try again.",
    };
  }
}
