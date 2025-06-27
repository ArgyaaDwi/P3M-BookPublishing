module.exports = {
  apps: [
    {
      name: "publikasi-p3m",
      cwd: "/var/www/P3M-BookPublishing",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
