import "./globals.css";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth"; // adjust path as needed

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <html lang="en">
      <head>
        <style>{`
          @keyframes gradientBG {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animated-gradient-bg {
            background: linear-gradient(120deg, #dbeafe, #f0fdf4, #f3e8ff, #e0e7ff, #fef9c3);
            background-size: 300% 300%;
            animation: gradientBG 18s ease-in-out infinite;
          }
        `}</style>
      </head>
      <body className="animated-gradient-bg text-gray-900 min-h-screen flex flex-col">
        <header className="p-4 bg-white/80 backdrop-blur-md text-blue-700 text-3xl font-extrabold shadow-md border-b border-blue-100">
          <div className="max-w-7xl mx-auto flex items-center gap-3">
            <Link
              href={user ? "/dashboard" : "/"}
              className="flex items-center gap-3 cursor-pointer"
            >
              <svg width="36" height="36" fill="none" viewBox="0 0 24 24">
                <path
                  d="M7 3a5 5 0 0 0-5 5v8a5 5 0 0 0 5 5h10a5 5 0 0 0 5-5V8a5 5 0 0 0-5-5H7Zm0 2h10a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3Zm2 3a1 1 0 0 0-1 1v6a1 1 0 1 0 2 0V9a1 1 0 0 0-1-1Zm6 0a1 1 0 0 0-1 1v6a1 1 0 1 0 2 0V9a1 1 0 0 0-1-1Z"
                  fill="#2563eb"
                />
              </svg>
              <span>Personal Bookmark Hub</span>
            </Link>
          </div>
        </header>

        <main className="flex-1 w-full">{children}</main>

        <footer className="p-4 bg-white/70 backdrop-blur text-gray-700 text-center text-sm border-t border-blue-100">
          <span>
            &copy; {new Date().getFullYear()}{" "}
            <span className="font-semibold">Personal Bookmark Hub</span> &mdash;
            All rights reserved.
          </span>
        </footer>
      </body>
    </html>
  );
}
