export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md mx-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">404 Page Not Found</h1>
        <p className="mt-4 text-sm text-gray-600">The page you're looking for doesn't exist.</p>
        <a href="/" className="mt-4 inline-block text-sm font-semibold text-[#ad542f]">Back home</a>
      </div>
    </div>
  );
}
