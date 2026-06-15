import { FiHome, FiImage, FiFileText, FiUser, FiScissors, FiShield, FiMessageCircle } from "react-icons/fi";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const navItems = [
    { label: "Home", path: "/", icon: FiHome },
    { label: "Background Remover", path: "/image-ai", icon: FiImage },
    { label: "Object Remover", path: "/object-remover", icon: FiScissors },
    { label: "Image Enhancer", path: "/enhance-ai", icon: FiShield },
    { label: "Photo Upscaler", path: "/upscale-ai", icon: FiFileText },
    { label: "Resume Analyzer", path: "/resume-ai", icon: FiUser },
    { label: "AI Chat", path: "/ai-chat", icon: FiMessageCircle },
  ];

  return (
    <div className="hidden xl:flex xl:w-72 xl:flex-col xl:rounded-[32px] xl:border xl:border-slate-200/80 xl:bg-white/90 xl:p-6 xl:ring-1 xl:ring-slate-200/60 dark:xl:border-slate-800/80 dark:xl:bg-slate-950/85 dark:xl:ring-slate-800/70">
      <div className="mb-10">
        <p className="text-sm uppercase tracking-[0.35em] text-brand-600">ToolHubAI</p>
        <h1 className="mt-4 text-3xl font-semibold text-slate-950 dark:text-white">Tools</h1>
      </div>

      <nav className="space-y-3">
        {navItems.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-semibold transition ${
                isActive
                  ? "bg-brand-600 text-white shadow-soft"
                  : "text-slate-700 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
