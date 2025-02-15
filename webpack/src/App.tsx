import React from "react";
import { useState, Suspense } from "react";
// import { Button } from "./Button";

// 异步组件
const AsyncButton = React.lazy(() =>
  import("./Button").then(({ Button }) => ({ default: Button }))
);
export const App = () => {
  const [count, setCount] = useState(0);
  return (
    <div>
      App Hello 你好{new Date().toString()}
      {count}
      {/* <Button onClick={() => setCount(count + 1)}>add</Button> */}
      <Suspense fallback={<div>Loading...</div>}>
        <AsyncButton onClick={() => setCount(count + 1)}>add</AsyncButton>
      </Suspense>
    </div>
  );
};
