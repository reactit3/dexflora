import { useEffect } from "react";
import { GithubIcon, StarIcon, ForkIcon } from "./Icons";
import { useGitHubStats } from "@/store/githhubStats";

interface GithubButtonProps {
  className?: string;
}

export function GithubButton({ className = "" }: GithubButtonProps) {
  const { stats, setStats } = useGitHubStats();

  useEffect(() => {
    if (!stats) {
      fetch("/api/github-stats")
        .then((res) => res.json())
        .then((data) => setStats(data));
    }
  }, [stats, setStats]);

  const formatCount = (count: number | null) => {
    if (count === null) return "--";
    if (count >= 1000) return (count / 1000).toFixed(1) + "k";
    return count.toString();
  };

  return (
    <a
      href="https://github.com/bnb-chain/bnb-chain.github.io"
      target="_blank"
      rel="noopener noreferrer"
      className={`px-4 py-2 bg-[#ebf3ff] text-[#0b57d0] transition-all ease-in-out hover:bg-[#D6E6FF] rounded-xl cursor-pointer flex items-center justify-between gap-3 ${className}`}
    >
      <div className="flex items-center gap-2">
        <GithubIcon />
        <span>BNB Chain GitHub</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <StarIcon />
          {stats ? (
            <span className="text-sm">{formatCount(stats.stars)}</span>
          ) : (
            <div className="w-6 h-4 bg-gray-300 rounded animate-pulse" />
          )}
        </div>
        <div className="flex items-center gap-1">
          <ForkIcon />
          {stats ? (
            <span className="text-sm">{formatCount(stats.forks)}</span>
          ) : (
            <div className="w-6 h-4 bg-gray-300 rounded animate-pulse" />
          )}
        </div>
      </div>
    </a>
  );
}
