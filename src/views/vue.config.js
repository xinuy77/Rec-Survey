module.exports = {
    pages: {
      admin: {
        entry: 'src/entry-point/index/main.js', // エントリーポイントとなるjs
        template: 'public/index.html', // テンプレートのHTML
        filename: 'index.html' // build時に出力されるファイル名
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
      historyApiFallback: {
        rewrites: [
          { from: /\/index/, to: '/index.html' }, // index.html に飛ばす
          { from: /\/survey/, to: '/survey.html' },
          { from: /\/login/, to: '/login.html' }
        ]
      }
    }
}
