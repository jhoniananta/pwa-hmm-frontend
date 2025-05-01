module.exports = {
    apps: [
        {
            name: 'myhmm_client',
            script: 'node_modules/next/dist/bin/next',
            args: 'start',
            interpreter: 'node',
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '256M',
            env: {
                NODE_ENV: 'production',
                PORT: 3000,
            },
        },
    ],
};