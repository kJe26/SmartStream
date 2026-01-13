import React, { Suspense } from "react";
import "./styles.css";

const ContentApp = React.lazy(() => import("mfContent/ContentApp"));
const IoTApp = React.lazy(() => import("mfIoT/IoTApp"));
const UserApp = React.lazy(() => import("mfUser/UserApp"));

export default function App() {
  return (
    <div className="container">
      <h1>🌐 SmartStream Platform</h1>

      <div className="grid">
        <Suspense fallback={<div className="card">Loading Content…</div>}>
          <ContentApp />
        </Suspense>

        <Suspense fallback={<div className="card">Loading IoT…</div>}>
          <IoTApp />
        </Suspense>

        <Suspense fallback={<div className="card">Loading User…</div>}>
          <UserApp />
        </Suspense>
      </div>
    </div>
  );
}