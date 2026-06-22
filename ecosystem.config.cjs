// PM2 process list — ONE app per client (instance-per-tenant).
//
// Shared-VPS safety: app names are namespaced `folkadrive-<slug>` and ports live
// in a dedicated 39000+ range, so they never collide with other projects'
// processes or ports on the same box. scripts/new-client.sh appends a client()
// entry automatically; you can also edit this file by hand.
//
// Each client has its own deploy dir: <BASE_DIR>/<slug> holding the copied
// standalone build (.next/standalone + static + public) and its own .env
// (DATABASE_URL, TENANT_SLUG, BETTER_AUTH_SECRET, BETTER_AUTH_URL, R2_*, …).
// PORT/HOSTNAME are set here (authoritative) — keep PORT OUT of .env.
//
// Start/reload:  pm2 start ecosystem.config.cjs   |   pm2 reload folkadrive-<slug>

const BASE_DIR = process.env.FOLKADRIVE_BASE_DIR || "/var/www/folkadrive";

function client(slug, port) {
  const dir = `${BASE_DIR}/${slug}`;
  return {
    name: `folkadrive-${slug}`,
    cwd: `${dir}/.next/standalone`,
    script: "server.js",
    // Node loads the per-client .env at runtime; --env-file does NOT override
    // env already set below, so PORT/HOSTNAME here stay authoritative.
    node_args: `--env-file-if-exists=${dir}/.env --max-old-space-size=256`,
    exec_mode: "fork", // Next.js standalone — fork, never cluster
    instances: 1,
    env: {
      NODE_ENV: "production",
      PORT: String(port),
      HOSTNAME: "127.0.0.1", // bind loopback only; nginx is the public edge
    },
    autorestart: true,
    max_memory_restart: "320M",
    max_restarts: 10,
    restart_delay: 3000,
    out_file: `${dir}/logs/out.log`,
    error_file: `${dir}/logs/error.log`,
    merge_logs: true,
    log_date_format: "YYYY-MM-DD HH:mm:ss",
  };
}

module.exports = {
  apps: [
    // Example — one client on a dedicated port. Add more with client("<slug>", <port>).
    client("folkastudio", 39001),
  ],
};
