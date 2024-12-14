import React from "react";

interface IconProps {
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}

const WhiteBishop: React.FC<IconProps> = ({ width = 40, height = 40, style }) => (
  <svg
    viewBox="1 1 43 43"
    width={width}
    height={height}
    style={{ display: "block", ...style }}
  >
    <g>
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="45" height="45">
        <g
          style={{
            opacity: 1,
            fill: "none",
            fillRule: "evenodd",
            fillOpacity: 1,
            stroke: "rgb(0, 0, 0)",
            strokeWidth: 1.5,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeMiterlimit: 4,
            strokeDasharray: "none",
            strokeOpacity: 1,
          }}
        >
          <g
            style={{
              fill: "rgb(255, 255, 255)",
              stroke: "rgb(0, 0, 0)",
              strokeLinecap: "butt",
            }}
          >
            <path d="M 9,36 C 12.39,35.03 19.11,36.43 22.5,34 C 25.89,36.43 32.61,35.03 36,36 C 36,36 37.65,36.54 39,38 C 38.32,38.97 37.35,38.99 36,38.5 C 32.61,37.53 25.89,38.96 22.5,37.5 C 19.11,38.96 12.39,37.53 9,38.5 C 7.65,38.99 6.68,38.97 6,38 C 7.35,36.54 9,36 9,36 z"></path>
            <path d="M 15,32 C 17.5,34.5 27.5,34.5 30,32 C 30.5,30.5 30,30 30,30 C 30,27.5 27.5,26 27.5,26 C 33,24.5 33.5,14.5 22.5,10.5 C 11.5,14.5 12,24.5 17.5,26 C 17.5,26 15,27.5 15,30 C 15,30 14.5,30.5 15,32 z"></path>
            <path d="M 25 8 A 2.5 2.5 0 1 1  20,8 A 2.5 2.5 0 1 1  25 8 z"></path>
          </g>
          <path
            d="M 17.5,26 L 27.5,26 M 15,30 L 30,30 M 22.5,15.5 L 22.5,20.5 M 20,18 L 25,18"
            style={{
              fill: "none",
              stroke: "rgb(0, 0, 0)",
              strokeLinejoin: "miter",
            }}
          ></path>
        </g>
      </svg>
    </g>
  </svg>
);

export default WhiteBishop;
