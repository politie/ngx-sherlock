module.exports = {
    external: [
        '@politie/informant',
        '@politie/sherlock',
        '@politie/sherlock-proxy',
        '@politie/sherlock-rxjs'
    ],
    globals: {
        '@politie/informant': 'politie.informant',
        '@politie/sherlock': 'politie.sherlock',
        '@politie/sherlock-proxy': 'politie.sherlock-proxy',
        '@politie/sherlock-rxjs': 'politie.sherlock-rxjs',
    }
}
