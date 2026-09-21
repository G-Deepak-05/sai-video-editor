import { ImageResponse } from "next/og";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Saikumar — Video Editor";
export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", background: "#0a0a0a", color: "#f1efe9", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 72 }}>
        <div style={{ fontSize: 28, letterSpacing: 6, color: "#e8552d" }}>VIDEO EDITOR</div>
        <div style={{ fontSize: 200, fontWeight: 800, lineHeight: 0.95 }}>SAIKUMAR</div>
      </div>
    ),
    size,
  );
}
