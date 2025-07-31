"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaLink, FaTags, FaCloud, FaRegEye, FaLock } from "react-icons/fa";

const features = [
  {
    icon: <FaLink className="text-blue-500 w-6 h-6" />,
    text: "Save any link from the web or social media in seconds",
  },
  {
    icon: <FaTags className="text-green-500 w-6 h-6" />,
    text: "Organize bookmarks with tags and categories",
  },
  {
    icon: <FaCloud className="text-blue-400 w-6 h-6" />,
    text: "Access your collection from any device, anytime",
  },
  {
    icon: <FaRegEye className="text-purple-500 w-6 h-6" />,
    text: "Clean, distraction-free dashboard",
  },
  {
    icon: <FaLock className="text-gray-700 w-6 h-6" />,
    text: "Completely private and secure",
  },
];

export default function LandingHero({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[80vh] px-6 py-16 overflow-hidden">
      {/* Animated gradient blobs */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        <motion.div
          className="absolute bg-blue-200 rounded-full mix-blend-multiply filter blur-2xl opacity-40 w-[500px] h-[500px] -top-40 -left-40 animate-pulse"
          animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bg-green-200 rounded-full mix-blend-multiply filter blur-2xl opacity-40 w-[400px] h-[400px] -bottom-32 -right-32 animate-pulse"
          animate={{ y: [0, -20, 0], x: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Main Hero Section */}
      <motion.div
        className="relative z-10 text-center max-w-5xl mx-auto"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 120,
            damping: 10,
            delay: 0.1,
          }}
        >
          <Image
            src="/bookmark-hero.svg"
            alt="Bookmark Hub"
            width={120}
            height={120}
            className="mx-auto mb-8 drop-shadow-lg"
            priority
          />
        </motion.div>

        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-blue-700 drop-shadow-sm">
          Personal Bookmark Hub
        </h1>
        <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-10">
          Effortlessly collect, organize, and access your favorite websites,
          YouTube channels, Twitter accounts, Instagram profiles, TikToks, and
          more—all in one beautiful, easy-to-use dashboard.
        </p>

        <div className="flex flex-col md:flex-row gap-4 justify-center mb-14">
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-semibold shadow-lg hover:bg-blue-700 transition"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-semibold shadow-lg hover:bg-blue-700 transition"
              >
                Get Started
              </Link>
              <Link
                href="/register"
                className="px-8 py-4 bg-green-600 text-white rounded-lg text-lg font-semibold shadow-lg hover:bg-green-700 transition"
              >
                Create Account
              </Link>
            </>
          )}
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div
        className="relative z-10 mt-12 max-w-6xl w-full px-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.12 } },
        }}
      >
        <motion.h2
          className="text-2xl font-bold text-gray-800 mb-8 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          Why use Personal Bookmark Hub?
        </motion.h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              className="flex items-center gap-3 bg-white/70 rounded-xl px-5 py-4 shadow-md backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + idx * 0.1, duration: 0.5 }}
            >
              {feature.icon}
              <span className="text-gray-700">{feature.text}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        className="relative z-10 mt-16 text-gray-500 text-sm text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        Start organizing your digital world today!
      </motion.div>
    </div>
  );
}
