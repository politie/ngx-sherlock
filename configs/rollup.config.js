module.exports = {
    external: ['@politie/sherlock', '@politie/sherlock-proxy', '@politie/informant'],
    globals: {
        '@politie/sherlock': 'politie.sherlock',
        '@politie/sherlock-proxy': 'politie.sherlock_proxy',
        '@politie/informant': 'politie.informant'
    }
}