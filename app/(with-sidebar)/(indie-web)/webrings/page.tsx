import React from "react";

const palettes = [
  {
    name: "Midnight Lavender",
    colors: [
      { name: "background", hex: "#120d19" },
      { name: "surface", hex: "#2C1E3E" },
      { name: "textPrimary", hex: "#F2EBFF", darkText: true },
      { name: "textSecondary", hex: "#A890D3" },
      { name: "accent", hex: "#FF914D", darkText: true },
      { name: "accentHover", hex: "#FFB380", darkText: true },
    ],
  },
  {
    name: "Forest Terminal",
    colors: [
      { name: "background", hex: "#07110d" },
      { name: "surface", hex: "#1C2F26" },
      { name: "textPrimary", hex: "#E2F1E6", darkText: true },
      { name: "textSecondary", hex: "#9FD5B3" },
      { name: "accent", hex: "#B2FF59", darkText: true },
      { name: "accentHover", hex: "#D1FF87", darkText: true },
    ],
  },
  {
    name: "Ember Noir",
    colors: [
      { name: "background", hex: "#190b07" },
      { name: "surface", hex: "#2D1A1C" },
      { name: "textPrimary", hex: "#F9EBEB", darkText: true },
      { name: "textSecondary", hex: "#D98B8B" },
      { name: "accent", hex: "#FF5C5C" },
      { name: "accentHover", hex: "#FF8383" },
    ],
  },
];

const ColorPalettes = () => {
  return (
    <div className="bg-zinc-900 text-white min-h-screen p-8 space-y-12">
      {palettes.map((palette) => (
        <div key={palette.name}>
          <h2 className="text-2xl font-bold mb-4">{palette.name}</h2>
          <div className="flex flex-wrap gap-4">
            {palette.colors.map((color) => (
              <div
                key={color.hex}
                className={`w-24 h-24 rounded-lg flex flex-col items-center justify-center p-2 text-center text-xs font-medium ${
                  color.darkText ? "text-black" : "text-white"
                }`}
                style={{ backgroundColor: color.hex }}
              >
                <div>{color.name}</div>
                <div className="text-[10px]">{color.hex}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ColorPalettes;
