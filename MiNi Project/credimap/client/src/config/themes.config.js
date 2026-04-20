/**
 * Centralized Theme Configuration
 * Defines parameters for 3D backgrounds and UI accents
 */
export const THEMES = {
    default: {
        name: "Default Particles",
        category: "Animated",
        variant: "default",
        colors: ["#3b82f6", "#8b5cf6", "#1e293b"],
        particleCount: 1500,
        speed: 0.5,
    },
    grid: {
        name: "Neon Grid",
        category: "Professional",
        variant: "grid",
        colors: ["#10b981", "#3b82f6", "#0f172a"],
        particleCount: 0,
        speed: 0.2,
    },
    galaxy: {
        name: "Galaxy Nebula",
        category: "Animated",
        variant: "galaxy",
        colors: ["#f472b6", "#8b5cf6", "#020617"],
        particleCount: 2000,
        speed: 0.8,
    },
    orbs: {
        name: "Floating Orbs",
        category: "Creative",
        variant: "orbs",
        colors: ["#fbbf24", "#f87171", "#171717"],
        particleCount: 20,
        speed: 0.3,
    },
    waves: {
        name: "Depth Waves",
        category: "Minimal",
        variant: "waves",
        colors: ["#2dd4bf", "#2563eb", "#000000"],
        particleCount: 0,
        speed: 0.4,
    },
    light: {
        name: "Daylight Bright",
        category: "Minimal",
        variant: "default",
        colors: ["#3b82f6", "#10b981", "#f1f5f9"],
        particleCount: 800,
        speed: 0.3,
    }
};

export const THEME_CATEGORIES = ["All", "Animated", "Professional", "Creative", "Minimal"];
