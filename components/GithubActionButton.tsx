"use client";

import { useEffect, useState } from "react";
import { GithubIcon, StarIcon, ForkIcon } from "./Icons";

interface GithubButtonProps {
  className?: string;
}

export function GithubButton({ className = "" }: GithubButtonProps) {
  const [stars, setStars] = useState<number | null>(null);
  const [forks, setForks] = useState<number | null>(null);

  useEffect(() => {
    const fetchRepoStats = async () => {
      try {
        const res = await fetch(
          "https://api.github.com/repos/bnb-chain/bnb-chain.github.io"
        );
        if (!res.ok) throw new Error("Failed to fetch repo data");
        const data = await res.json();
        setStars(data.stargazers_count);
        setForks(data.forks_count);
      } catch (error) {
        console.error("Error fetching GitHub stats:", error);
      }
    };

    fetchRepoStats();
  }, []);

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
          <span className="text-sm">{formatCount(stars)}</span>
        </div>
        <div className="flex items-center gap-1">
          <ForkIcon />
          <span className="text-sm">{formatCount(forks)}</span>
        </div>
      </div>
    </a>
  );
}
