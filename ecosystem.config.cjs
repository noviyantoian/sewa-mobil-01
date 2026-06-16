// PM2 config untuk FolkaDrive di VPS
// Jalankan: pm2 start ecosystem.config.js
// Setelah: pnpm build && bash scripts/deploy-standalone.sh

module.exports = {
  apps: [
    {
      name: "folkadrive",
      script: ".next/standalone/server.js",
      cwd: "/var/www/folkadrive",
      instances: 1, // fork mode, BUKAN cluster — Next.js tidak butuh cluster
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3005,
        HOSTNAME: "0.0.0.0",
        // Batasi heap Node.js — tanpa ini Node.js bisa makan sampai 1.5GB
        NODE_OPTIONS: "--max-old-space-size=256",
      },
      // Restart otomatis jika melebihi 300MB — safety net
      max_memory_restart: "300M",
      max_restarts: 10,
      restart_delay: 3000,
      // Log
      out_file: "./logs/out.log",
      error_file: "./logs/error.log",
      merge_logs: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss",
    },
  ],
};
