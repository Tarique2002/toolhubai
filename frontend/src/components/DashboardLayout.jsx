import Sidebar from "../components/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-white min-h-screen p-6">
        {children}
      </div>
    </div>
  );
}