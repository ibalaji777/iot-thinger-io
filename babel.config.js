module.exports = {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
      // ['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: false }],
  
  
      // Below plugin is unable to handle some of our arrow-functions
      //  and results in "Unknown" error after the app is launched
      //    ['@babel/plugin-transform-arrow-functions', { spec: true }]
    ]
  };
