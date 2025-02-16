import React from "react";
import ReactDOMClient from "react-dom/client";
import singleSpaReact from "single-spa-react";
import Root from "./root.component";
import singleSpaCss from "single-spa-css";

// single-spa-css options
// 通过将css地址放到head的link部分中加载
const cssLifecycles = singleSpaCss({
  cssUrls: ["http://192.168.1.3:8082/style.css"],
  webpackExtractedCss: false,
  shouldUnmount: true, // 是否需要卸载css
});

const lifecycles = singleSpaReact({
  React,
  ReactDOMClient,
  rootComponent: Root,
  errorBoundary(err, info, props) {
    // Customize the root error boundary for your microfrontend here.
    return null;
  },
});

// 生命钩子
// export const { bootstrap, mount, unmount } = lifecycles;
export const bootstrap = [cssLifecycles.bootstrap, lifecycles.bootstrap];
export const mount = [cssLifecycles.mount, lifecycles.mount];
// 注意卸载顺序，先卸载应用，否则会先看到样式丢失的页面才关闭
export const unmount = [lifecycles.unmount, cssLifecycles.unmount];
