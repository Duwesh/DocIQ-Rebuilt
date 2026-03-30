import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 40,
          background: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
        }}
      >
        <svg
          width="110"
          height="130"
          viewBox="0 0 22 26"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 3C2 1.89543 2.89543 1 4 1H13L20 8V23C20 24.1046 19.1046 25 18 25H4C2.89543 25 2 24.1046 2 23V3Z"
            fill="white"
            fillOpacity="0.95"
          />
          <path d="M13 1L20 8H15C13.8954 8 13 7.10457 13 6V1Z" fill="white" fillOpacity="0.6" />
          <circle cx="11" cy="16" r="3" fill="#6366f1" />
          <circle cx="11" cy="16" r="1.2" fill="white" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
