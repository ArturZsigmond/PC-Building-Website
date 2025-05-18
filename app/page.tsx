import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white px-4">
      <h1 className="text-4xl mb-6 text-purple-400 font-bold">ARTUR&#39;S PC BUILDER</h1>
      <h2 className="text-2xl mb-4 text-purple-300 text-center">
        Welcome to the Ultimate PC Building Experience!
      </h2>
      <p className="text-md mb-6 text-gray-300 text-center">
        Your one-stop solution for building your dream PC.
      </p>
      <p className="text-md mb-12 text-gray-400 text-center">
        Please login or register to continue.
      </p>

      <div className="space-y-6 w-64"> {/* increased spacing */}
        <Link href="/login_page">
          <button className="bg-purple-700 hover:bg-purple-800 text-white w-full p-3 rounded">
            Login
          </button>
        </Link>

        <Link href="/register_page">
          <button className="bg-gray-700 hover:bg-gray-800 text-white w-full p-3 rounded">
            Register
          </button>
        </Link>

        <Link href="/admin_page">
          <button className="bg-purple-700 hover:bg-purple-800 text-white w-full p-3 rounded">
            Admin Mode
          </button>
        </Link>
      </div>
    </div>
  );
}
