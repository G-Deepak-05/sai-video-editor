/** @type {import('next').NextConfig} */
export default {
  reactStrictMode: true,
  // lets a phone on the same Wi-Fi load dev assets (HMR) from this machine's LAN IP
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*"],
};
