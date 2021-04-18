module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? './'
    : '/',
  pwa: {
    name: "scribor",
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    manifestPath: './manifest.json',
    iconPaths: {
      favicon32: 'icons/favicon-32x32.png',
      favicon16: 'icons/favicon-16x16.png',
      appleTouchIcon: 'icons/apple-touch-icon-192x192.png',
      maskIcon: null, //'icons/safari-pinned-tab.svg',
      msTileImage: null, //'img/icons/msapplication-icon-144x144.png'
    },
    themeColor: "#203647",
    manifestOptions: {
      background_color: "purple",
      start_url: 'index.html',
      description: "blah",
      display: "fullscreen",
      icons: [
        {
          "src": "icons/128x128.png",
          "sizes": "128x128",
          "type": "image/png"
        },
        {
          "src": "icons/apple-touch-icon-192x192.png",
          "sizes": "192x192",
          "type": "image/png",
          "purpose": "any maskable"
        },
        {
          "src": "icons/android-chrome-512x512.png",
          "sizes": "512x512",
          "type": "image/png",
          "purpose": "any maskable"
        }
      ],
    }
  }
}