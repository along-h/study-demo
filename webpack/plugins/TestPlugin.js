class TestPlugin {
  // 主要实现apply方法
  apply(compiler) {
    //通过对应的钩子函数，在执行
    compiler.hooks.done.tap("TestPlugin", (stats) => {
      console.log("TestPlugin: Compilation done.");
    });
  }
}
module.exports = TestPlugin;
