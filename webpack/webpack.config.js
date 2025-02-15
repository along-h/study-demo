const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer");
const TestPlugin = require("./plugins/TestPlugin");
// 通用配置

// webpack几大概念
// 1. entry 入口
// 2. output 输出
// 3. modlue 模块
// 4. assets 资源
// 5. chunk 模块处理成代码块
// 6. bundle 产物
module.exports = {
  // 什么情况下会自动打开tree shaking？
  // 1. 在生成模式下，即mode: "production"时，webpack会自动进行tree shaking。
  mode: "production",
  entry: path.resolve(__dirname, "src", "index.tsx"),
  //以什么样的方式打包对应内容
  output: {
    // 打包后的名称
    // hash: 打包后的文件hash值
    // contenthash: 打包后的内容hash值，只要文件内容改变，hash值就会改变
    filename: "build.[contenthash].js",
    // 打包后的路径
    path: path.resolve(__dirname, "build"),
    // 每次打包都清除之间的打包内容
    clean: true,
    // 处理webpack5默认的箭头函数，防止运行在不兼容es6的浏览器上
    environment: {
      arrowFunction: false,
    },
  },
  module: {
    rules: [
      {
        test: /\.js|ts|tsx$/,
        // use: {
        //   loader: "babel-loader",
        // },
        use: ["babel-loader", "./loader/TestLoader.js"],
      },
    ],
  },
  // 指定HTML插件
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "public", "index.html"),
    }),
    // new BundleAnalyzerPlugin.BundleAnalyzerPlugin(),
    new TestPlugin(),
  ],
  // 优化，提取公共模块
  // 只能在production模式下
  optimization: {
    usedExports: true,
    splitChunks: {
      chunks: "async",
      minSize: 1024,
      minRemainingSize: 0,
      minChunks: 3,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 4,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
  resolve: {
    // 指定后缀名，简化导入时的名称给定
    extensions: [".js", ".ts", ".tsx"],
  },
  // 开发环境配置
  devServer: {
    // 项目构建后的路径
    static: path.join(__dirname, "build"),
    // 启动gzip压缩
    compress: true,
    //端口号
    port: 3000,
    // 开启热更新
    hot: true,
    // 自动打开浏览器
    open: true,
  },
};
