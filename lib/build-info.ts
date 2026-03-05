import { execSync } from "child_process";

export interface BuildInfo {
  gitVersion: string;
  gitCommit: string;
  buildTime: string;
}

export function getBuildInfo(): BuildInfo {
  let gitVersion = "unknown";
  let gitCommit = "unknown";
  let buildTime = "unknown";

  try {
    // Get git describe (tags + commits)
    gitVersion = execSync("git describe --tags --always --dirty", {
      encoding: "utf-8",
    }).trim();
  } catch {
    // ignore
  }

  try {
    // Get short commit hash
    gitCommit = execSync("git rev-parse --short HEAD", {
      encoding: "utf-8",
    }).trim();
  } catch {
    // ignore
  }

  try {
    // Get build time
    buildTime = new Date().toISOString();
  } catch {
    // ignore
  }

  return {
    gitVersion,
    gitCommit,
    buildTime,
  };
}
