import React, { Suspense } from "react";

const ContentApp = React.lazy(() => import("mfContent/ContentApp"));
const IoTApp = React.lazy(() => import("mfIoT/IoTApp"));
const UserApp = React.lazy(() => import("mfUser/UserApp"));

export default function App() {
  return (
    <div>
      <h1>SmartStream Platform</h1>

      <Suspense fallback={<div>Loading Content...</div>}>
        <ContentApp />
      </Suspense>

      <Suspense fallback={<div>Loading IoT...</div>}>
        <IoTApp />
      </Suspense>

      <Suspense fallback={<div>Loading User...</div>}>
        <UserApp />
      </Suspense>
    </div>
  );
}