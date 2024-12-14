import React from "react";

interface IconProps {
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}

const WhiteRook: React.FC<IconProps> = ({ width = 40, height = 40, style }) => (
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
            fill: "rgb(255, 255, 255)",
            fillOpacity: 1,
            fillRule: "evenodd",
            stroke: "rgb(0, 0, 0)",
            strokeWidth: 1.5,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeMiterlimit: 4,
            strokeDasharray: "none",
            strokeOpacity: 1,
          }}
        >
          <path
            d="M 9,39 L 36,39 L 36,36 L 9,36 L 9,39 z"
            style={{ strokeLinecap: "butt" }}
          ></path>
          <path
            d="M 12,36 L 12,32 L 33,32 L 33,36 L 12,36 z"
            style={{ strokeLinecap: "butt" }}
          ></path>
          <path
            d="M 11,14 L 11,9 L 15,9 L 15,11 L 20,11 L 20,9 L 25,9 L 25,11 L 30,11 L 30,9 L 34,9 L 34,14"
            style={{ strokeLinecap: "butt" }}
          ></path>
          <path d="M 34,14 L 31,17 L 14,17 L 11,14"></path>
          <path
            d="M 31,17 L 31,29.5 L 14,29.5 L 14,17"
            style={{ strokeLinecap: "butt", strokeLinejoin: "miter" }}
          ></path>
          <path d="M 31,29.5 L 32.5,32 L 12.5,32 L 14,29.5"></path>
          <path
            d="M 11,14 L 34,14"
            style={{ fill: "none", stroke: "rgb(0, 0, 0)", strokeLinejoin: "miter" }}
          ></path>
        </g>
      </svg>
    </g>
  </svg>
);

export default WhiteRook;
