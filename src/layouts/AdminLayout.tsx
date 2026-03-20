import { Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function AdminLayout() {
  const { logout } = useAuth();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-4">
        <h2 className="text-xl font-bold mb-6">Admin</h2>

        <nav className="space-y-2">
          <a href="/admin" className="block p-2 rounded hover:bg-gray-700">
            Surveys
          </a>

          <a
            href="/admin/create"
            className="block p-2 rounded hover:bg-gray-700"
          >
            Create
          </a>

          <div>
            <button onClick={logout}>Logout</button>
          </div>
        </nav>
      </div>

      {/* CONTENT */}
      <div className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </div>
    </div>
  );
}
