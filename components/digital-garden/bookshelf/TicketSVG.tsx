import React from "react";

/**
 * SVG for a classic event/raffle ticket shape with stylized cutouts (3 scallops on each side, small inward curves on corners).
 * The white border is included for contrast on colored backgrounds.
 */
const TicketSVG: React.FC<{
  className?: string;
  strokeWidth?: number;
  strokeColor?: string;
  fillColor?: string;
  children?: React.ReactNode;
}> = ({
  className = "",
  strokeWidth = 4,
  strokeColor = "#fff",
  fillColor = "#f472b6", // Tailwind pink-400
  children,
}) => (
  <svg
    viewBox="0 0 400 200"
    width="100%"
    height="100%"
    className={className}
    style={{ display: "block" }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      {/* Scallop pattern for left/right sides */}
      <clipPath id="ticket-clip">
        <path
          d="
            M 30,0
            Q 20,20 30,40
            Q 20,60 30,80
            Q 20,100 30,120
            Q 20,140 30,160
            Q 20,180 30,200
            L 370,200
            Q 380,180 370,160
            Q 380,140 370,120
            Q 380,100 370,80
            Q 380,60 370,40
            Q 380,20 370,0
            Z
          "
        />
      </clipPath>
    </defs>
    {/* Main ticket shape with border */}
    <g clipPath="url(#ticket-clip)">
      <rect
        x="0"
        y="0"
        width="400"
        height="200"
        rx="28"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
      {/* Inner white border for contrast */}
      <rect
        x={strokeWidth * 1.6}
        y={strokeWidth * 1.6}
        width={400 - strokeWidth * 3.2}
        height={200 - strokeWidth * 3.2}
        rx="22"
        fill="none"
        stroke="#fff"
        strokeWidth={strokeWidth}
        style={{ pointerEvents: "none" }}
      />
      {/* Render children inside ticket */}
      <foreignObject x="0" y="0" width="400" height="200">
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "1.5rem",
            boxSizing: "border-box",
          }}
        >
          {children}
        </div>
      </foreignObject>
    </g>
  </svg>
);

export default TicketSVG;
