import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        scifi: {
          bg: "#020617", // slate-950 deep void
          surface: "rgba(15, 23, 42, 0.75)", // glass surface
          border: "rgba(51, 65, 85, 0.5)",
          cyan: "#22d3ee", // data flow / telemetry
          emerald: "#34d399", // validated / operational
          amber: "#f59e0b", // awaiting HITL approval
          rose: "#f43f5e", // high risk of bias / anomaly
          violet: "#a855f7", // cognitive synthesis
        },
      },
      boxShadow: {
        glowCyan: "0 0 20px -2px rgba(34, 211, 238, 0.4)",
        glowEmerald: "0 0 20px -2px rgba(52, 211, 153, 0.4)",
        glowAmber: "0 0 20px -2px rgba(245, 158, 11, 0.5)",
        glowRose: "0 0 20px -2px rgba(244, 63, 94, 0.5)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "conduit-flow": "flow 2s linear infinite",
      },
      keyframes: {
        flow: {
          "0%": { strokeDashoffset: "24" },
          "100%": { strokeDashoffset: "0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
