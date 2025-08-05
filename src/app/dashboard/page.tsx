"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaYoutube,
  FaXTwitter,
  FaInstagram,
  FaTiktok,
  FaGlobe,
  FaPlus,
} from "react-icons/fa6";
import { FaSignOutAlt } from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast";

const DEFAULT_TABS = [
  {
    key: "youtube",
    label: "YouTube",
    icon: <FaYoutube className="text-red-500" />,
  },
  { key: "x", label: "X", icon: <FaXTwitter className="text-white" /> },
  {
    key: "instagram",
    label: "Instagram",
    icon: <FaInstagram className="text-pink-500" />,
  },
  {
    key: "tiktok",
    label: "TikTok",
    icon: <FaTiktok className="text-gray-200" />,
  },
  {
    key: "websites",
    label: "Websites",
    icon: <FaGlobe className="text-blue-400" />,
  },
];

type Favorite = {
  id: string | number;
  platform: string;
  url: string;
  title?: string;
  description?: string;
};
type UserTab = { key: string; label: string };

export default function Dashboard() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [userTabs, setUserTabs] = useState<UserTab[]>([]);
  const [tabs, setTabs] = useState<UserTab[]>([...DEFAULT_TABS]);
  const [activeTab, setActiveTab] = useState(DEFAULT_TABS[0].key);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [newTabName, setNewTabName] = useState("");
  const [loading, setLoading] = useState(false);
  const [tabLoading, setTabLoading] = useState(false);

  async function fetchFavorites() {
    try {
      const res = await fetch("/api/favorites");
      if (res.status === 401) return router.push("/login");
      const data = await res.json();
      setFavorites(data);
    } catch {
      toast.error("Failed to load bookmarks.");
    }
  }

  async function fetchUserTabs() {
    try {
      const res = await fetch("/api/user-tabs");
      if (res.status === 401) return;
      const data = await res.json();
      setUserTabs(data);
      setTabs([
        ...DEFAULT_TABS,
        ...data.map((t: UserTab) => ({ key: t.key, label: t.label })),
      ]);
    } catch {
      toast.error("Failed to load custom tabs.");
    }
  }

  async function addFavorite() {
    if (!url.trim()) {
      toast.error("URL is required.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform: activeTab, url, title, description }),
      });
      if (!res.ok)
        throw new Error((await res.json()).error || "Failed to add bookmark.");
      setUrl("");
      setTitle("");
      setDescription("");
      toast.success("Bookmark added!");
      fetchFavorites();
    } catch (err: any) {
      toast.error(err.message || "Error adding bookmark.");
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }

  async function handleAddTab() {
    const trimmed = newTabName.trim();
    if (!trimmed) return toast.error("Tab name cannot be empty.");
    if (userTabs.length >= 5)
      return toast.error("You can only create up to 5 custom tabs.");
    if (tabs.find((t) => t.key.toLowerCase() === trimmed.toLowerCase()))
      return toast.error("Tab already exists.");
    setTabLoading(true);
    try {
      const res = await fetch("/api/user-tabs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: trimmed, label: trimmed }),
      });
      if (!res.ok)
        throw new Error((await res.json()).error || "Failed to add tab.");
      setNewTabName("");
      toast.success("Tab created!");
      fetchUserTabs();
    } catch (err: any) {
      toast.error(err.message || "Error creating tab.");
    } finally {
      setTabLoading(false);
    }
  }

  useEffect(() => {
    fetchFavorites();
    fetchUserTabs();
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white">
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto py-10 px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
            Your Bookmarks
          </h1>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-5 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition shadow-lg"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-3 mb-8">
          {tabs.map((tab) => {
            const iconObj = DEFAULT_TABS.find((t) => t.key === tab.key);
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-5 py-2 rounded-full border transition-all font-semibold backdrop-blur-md
                  ${
                    activeTab === tab.key
                      ? "bg-gradient-to-r from-blue-500 to-green-500 text-white border-transparent shadow-lg"
                      : "bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700"
                  }`}
              >
                {iconObj?.icon}
                {tab.label}
              </button>
            );
          })}
          {userTabs.length < 5 && (
            <div className="flex items-center gap-1">
              <input
                type="text"
                placeholder="New tab"
                value={newTabName}
                onChange={(e) => setNewTabName(e.target.value)}
                className="px-3 py-2 rounded-l-full border border-gray-700 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={16}
                disabled={tabLoading}
              />
              <button
                onClick={handleAddTab}
                className={`px-3 py-2 bg-green-600 text-white rounded-r-full hover:bg-green-700 transition ${
                  tabLoading ? "opacity-60 cursor-not-allowed" : ""
                }`}
                disabled={tabLoading}
              >
                <FaPlus />
              </button>
            </div>
          )}
        </div>

        {/* Add Bookmark Form */}
        <div className="bg-gray-900/80 rounded-2xl shadow-xl p-6 mb-10 flex flex-col md:flex-row gap-4 items-center border border-gray-800 backdrop-blur-md">
          <input
            type="url"
            placeholder="URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 border p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-700"
            disabled={loading}
          />
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 border p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-700"
            disabled={loading}
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="flex-1 border p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-700"
            disabled={loading}
          />
          <button
            onClick={addFavorite}
            className={`bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-blue-600 transition shadow-lg ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </div>

        {/* Bookmarks List */}
        <div className="space-y-4">
          {favorites.filter((f) => f.platform === activeTab).length === 0 ? (
            <div className="text-gray-500 text-center py-10">
              No bookmarks yet for{" "}
              <span className="font-semibold">
                {tabs.find((t) => t.key === activeTab)?.label}
              </span>
              .
            </div>
          ) : (
            favorites
              .filter((f) => f.platform === activeTab)
              .map((f) => (
                <div
                  key={f.id}
                  className="bg-gray-900/80 rounded-xl shadow-md flex flex-col md:flex-row items-start md:items-center gap-4 p-5 hover:shadow-xl hover:bg-gray-800/90 transition border border-gray-800"
                >
                  <div className="flex-1">
                    <a
                      href={f.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 text-lg font-bold hover:underline break-all"
                    >
                      {f.title || f.url}
                    </a>
                    {f.description && (
                      <div className="text-gray-400 mt-1">{f.description}</div>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 font-mono px-3 py-1 rounded-full bg-gray-800 border border-gray-700">
                    {tabs.find((t) => t.key === f.platform)?.label ||
                      f.platform}
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
}
