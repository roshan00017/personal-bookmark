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
  {
    key: "x",
    label: "X",
    icon: <FaXTwitter className="text-black" />,
  },
  {
    key: "instagram",
    label: "Instagram",
    icon: <FaInstagram className="text-pink-500" />,
  },
  {
    key: "tiktok",
    label: "TikTok",
    icon: <FaTiktok className="text-gray-800" />,
  },
  {
    key: "websites",
    label: "Websites",
    icon: <FaGlobe className="text-blue-500" />,
  },
];

type Favorite = {
  id: string | number;
  platform: string;
  url: string;
  title?: string;
  description?: string;
};

type UserTab = {
  key: string;
  label: string;
};

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

  // Fetch favorites
  async function fetchFavorites() {
    try {
      const res = await fetch("/api/favorites");
      if (res.status === 401) return router.push("/login");
      const data = await res.json();
      setFavorites(data);
    } catch (err) {
      toast.error("Failed to load bookmarks.");
    }
  }

  // Fetch user tabs from backend
  async function fetchUserTabs() {
    try {
      const res = await fetch("/api/user-tabs");
      if (res.status === 401) return; // Not logged in
      const data = await res.json();
      setUserTabs(data);
      setTabs([
        ...DEFAULT_TABS,
        ...data.map((t: UserTab) => ({ key: t.key, label: t.label })),
      ]);
    } catch (err) {
      toast.error("Failed to load custom tabs.");
    }
  }

  // Add a new bookmark
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
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to add bookmark.");
      }
      setUrl("");
      setTitle("");
      setDescription("");
      toast.success("Bookmark added!");
      fetchFavorites();
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message || "Error adding bookmark.");
      } else {
        toast.error("Error adding bookmark.");
      }
    } finally {
      setLoading(false);
    }
  }

  // Logout
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }

  // Add a new custom tab (persisted)
  async function handleAddTab() {
    const trimmed = newTabName.trim();
    if (!trimmed) {
      toast.error("Tab name cannot be empty.");
      return;
    }
    if (userTabs.length >= 5) {
      toast.error("You can only create up to 5 custom tabs.");
      return;
    }
    if (tabs.find((t) => t.key.toLowerCase() === trimmed.toLowerCase())) {
      toast.error("Tab already exists.");
      return;
    }
    setTabLoading(true);
    try {
      const res = await fetch("/api/user-tabs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: trimmed, label: trimmed }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to add tab.");
      }
      setNewTabName("");
      toast.success("Tab created!");
      fetchUserTabs();
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message || "Error creating tab.");
      } else {
        toast.error("Error creating tab.");
      }
    } finally {
      setTabLoading(false);
    }
  }

  useEffect(() => {
    fetchFavorites();
    fetchUserTabs();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Toaster position="top-right" />
      <div className="max-w-5xl mx-auto py-10 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-blue-800 tracking-tight">
            Your Bookmarks
          </h1>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-5 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => {
            const iconObj = DEFAULT_TABS.find((t) => t.key === tab.key);
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition font-semibold ${
                  activeTab === tab.key
                    ? "bg-blue-700 text-white border-blue-700 shadow"
                    : "bg-white text-blue-800 border-blue-200 hover:bg-blue-50"
                }`}
              >
                {iconObj?.icon}
                {tab.label}
              </button>
            );
          })}
          {/* Add Tab */}
          {userTabs.length < 5 && (
            <div className="flex items-center gap-1">
              <input
                type="text"
                placeholder="New tab"
                value={newTabName}
                onChange={(e) => setNewTabName(e.target.value)}
                className="px-3 py-2 rounded-l-full border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                maxLength={16}
                disabled={tabLoading}
              />
              <button
                onClick={handleAddTab}
                className={`px-3 py-2 bg-green-500 text-white rounded-r-full hover:bg-green-600 transition ${
                  tabLoading ? "opacity-60 cursor-not-allowed" : ""
                }`}
                title="Add Tab"
                disabled={tabLoading}
              >
                <FaPlus />
              </button>
            </div>
          )}
        </div>

        {/* Add Bookmark Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 flex flex-col md:flex-row gap-4 items-center">
          <input
            type="url"
            placeholder="URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            disabled={loading}
          />
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            disabled={loading}
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="flex-1 border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            disabled={loading}
          />
          <button
            onClick={addFavorite}
            className={`bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition ${
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
            <div className="text-gray-400 text-center py-10">
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
                  className="bg-white rounded-xl shadow flex flex-col md:flex-row items-start md:items-center gap-4 p-5 hover:shadow-lg transition"
                >
                  <div className="flex-1">
                    <a
                      href={f.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-700 text-lg font-bold hover:underline break-all"
                    >
                      {f.title || f.url}
                    </a>
                    {f.description && (
                      <div className="text-gray-600 mt-1">{f.description}</div>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 font-mono px-2 py-1 rounded bg-gray-100">
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
