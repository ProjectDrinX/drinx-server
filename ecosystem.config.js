module.exports = {
  apps: [
    {
      name: 'drinx-server',
      script: 'node dist/main.js',
      instances: 1,
      autorestart: true,
      watch: '.',
      max_memory_restart: '1G',
    },
  ],
  deploy: {
    production: {
      host: process.env.DEPLOY_SERVER_HOST,
      port: process.env.DEPLOY_SERVER_PORT,
      user: process.env.DEPLOY_SERVER_USER,
      key: 'deploy.key',
      ref: 'origin/main',
      repo: 'git@github.com:ProjectDrinX/drinx-server.git',
      path: `${process.env.DEPLOY_SERVER_PATH}/DrinX-server`,
      'post-deploy':
        'yarn && yarn build && pm2 reload ecosystem.config.js --env production && pm2 save && git checkout yarn.lock',
    },
  },
};
