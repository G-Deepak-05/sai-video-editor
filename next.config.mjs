/** @type {import('next').NextConfig} */
export default {
  reactStrictMode: true,
  // lets a phone on the same Wi-Fi load dev assets (HMR) from this machine's LAN IP
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*"],
  experimental: {
    // enables the forbidden() function + app/forbidden.tsx, used to show a real 403 when
    // /admin is opened while its login is temporarily locked out (see lib/auth.ts isBlocked)
    authInterrupts: true,
  },
};
