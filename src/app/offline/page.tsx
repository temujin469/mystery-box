export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Интернэт холболт алга</h1>
        <p className="text-gray-400">
          Та интернэт холболтгүй байна. Дахин оролдохын тулд холболтоо шалгана уу.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium"
        >
          Дахин оролдох
        </button>
      </div>
    </div>
  );
}

export const metadata = {
  title: "Интернэт холболт алга | Нууцлаг хайрцаг",
  robots: {
    index: false,
    follow: false,
  },
};
