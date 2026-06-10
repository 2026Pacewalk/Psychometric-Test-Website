// PM2 process config — keeps the Next.js server running and restarts on reboot.
// Usage on the server:
//   npm ci && npm run build && npm run setup   (setup only the FIRST time)
//   pm2 start ecosystem.config.js && pm2 save && pm2 startup
module.exports = {
  apps: [
    {
      name: "testpsychometric",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      cwd: __dirname,
      instances: 1,
      exec_mode: "fork",
      env: { NODE_ENV: "production", PORT: "3000" },
      max_memory_restart: "500M",
    },
  ],
};
