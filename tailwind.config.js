module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#ffffff",
        foreground: "#030213",
        card: "#ffffff",
        primary: "#030213", // Sesuai --primary kamu
        secondary: "#f1f1f4",
        muted: "#ececf0",
        "muted-foreground": "#717182",
        accent: "#e9ebef",
        destructive: "#d4183d",
        border: "rgba(0, 0, 0, 0.1)",
        input: "#f3f3f5", // Diambil dari --input-background kamu
      },
      borderRadius: {
        lg: 10, // 0.625rem = 10px
        md: 8,
        sm: 6,
      },
    },
  },
  plugins: [],
};