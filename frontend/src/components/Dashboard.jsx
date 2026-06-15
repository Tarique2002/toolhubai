import DashboardLayout from "../layout/DashboardLayout";

export default function Dashboard() {
  return (
    <DashboardLayout>
      
      <h1 className="text-3xl font-bold mb-2">
        Welcome to ToolHubAI
      </h1>

      <p className="text-gray-500 mb-6">
        Choose a tool to start working
      </p>

      {/* Tool Grid */}
      <div className="grid grid-cols-3 gap-5">

        <div className="p-5 border rounded-xl hover:shadow-md cursor-pointer">
          🖼 Background Remover
        </div>

        <div className="p-5 border rounded-xl hover:shadow-md cursor-pointer">
          ✂ Object Remover
        </div>

        <div className="p-5 border rounded-xl hover:shadow-md cursor-pointer">
          📄 PDF Summarizer
        </div>

        <div className="p-5 border rounded-xl hover:shadow-md cursor-pointer">
          📊 Resume Analyzer
        </div>

        <div className="p-5 border rounded-xl hover:shadow-md cursor-pointer">
          ✍ AI Writer
        </div>

        <div className="p-5 border rounded-xl hover:shadow-md cursor-pointer">
          🔍 OCR Tool
        </div>

      </div>

    </DashboardLayout>
  );
}