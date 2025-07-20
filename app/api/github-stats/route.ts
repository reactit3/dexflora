import { NextResponse } from "next/server";

let cachedData: any = null;
let lastFetched = 0;
const CACHE_DURATION = 1000 * 60 * 10; // 10 minutes

export async function GET() {
  const now = Date.now();

  if (cachedData && now - lastFetched < CACHE_DURATION) {
    return NextResponse.json(cachedData);
  }

  const response = await fetch(
    "https://api.github.com/repos/bnb-chain/bnb-chain.github.io"
  );
  const data = await response.json();

  cachedData = {
    stars: data.stargazers_count,
    forks: data.forks_count,
  };
  lastFetched = now;

  return NextResponse.json(cachedData);
}
