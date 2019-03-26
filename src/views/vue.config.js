module.exports = {
    pages: {
      index: {
        entry: 'src/entry-point/login/main.js',
        template: 'public/login.html',
        filename: 'login.html'
      },
      admin: {
        entry: 'src/entry-point/admin/main.js', // エントリーポイントとなるjs
        template: 'public/admin.html', // テンプレートのHTML
        filename: 'admin.html' // build時に出力されるファイル名
      },
      survey: {
        entry: 'src/entry-point/survey/main.js',
        template: 'public/survey.html',
        filename: 'survey.html'
      },
      login: {
        entry: 'src/entry-point/login/main.js',
        template: 'public/login.html',
        filename: 'login.html'
      }
    },
    devServer: {
      open: process.platform === 'darwin',
      host: '0.0.0.0',
      port: 8085, // CHANGE YOUR PORT HERE!
      https: true,
      hotOnly: false,
      historyApiFallback: {
        rewrites: [
          { from: /\/index/, to: '/login.html' }, // index.html に飛ばす
          { from: /\/survey/, to: '/survey.html' },
          { from: /\/login/, to: '/login.html' },
          { from: /\/admin/, to: '/admin.html' }
        ]
      }
    }
}
