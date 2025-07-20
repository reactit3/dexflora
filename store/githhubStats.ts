import { create } from "zustand";

type GitHubStats = { stars: number; forks: number } | null;

export const useGitHubStats = create<{
  stats: GitHubStats;
  setStats: (stats: GitHubStats) => void;
}>((set) => ({
  stats: null,
  setStats: (stats) => set({ stats }),
}));
