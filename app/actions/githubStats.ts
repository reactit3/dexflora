let cachedData: { stars: number; forks: number } | null = null;
let lastFetched = 0;
const CACHE_DURATION = 1000 * 60 * 10; // 10 minutes

export async function getGithubStats() {
  const now = Date.now();

  if (cachedData && now - lastFetched < CACHE_DURATION) {
    return cachedData;
  }

  const response = await fetch(
    "https://api.github.com/repos/bnb-chain/bnb-chain.github.io",
    {
      headers: {
        Accept: "application/vnd.github+json",
      },
      next: { revalidate: CACHE_DURATION }, // optional, for ISR-like revalidation
    }
  );

  const data = await response.json();

  cachedData = {
    stars: data.stargazers_count,
    forks: data.forks_count,
  };
  lastFetched = now;

  return cachedData;
}
