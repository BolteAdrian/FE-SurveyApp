import { Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <div
      style={{
        maxWidth: 800,
        margin: "0 auto",
        padding: 20,
      }}
    >
      <Outlet />
    </div>
  );
}