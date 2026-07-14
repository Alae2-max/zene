import React, { useState, useEffect } from "react";
import { Home, Film, PlusSquare, User as UserIcon, Flame, ShieldCheck, Heart } from "lucide-react";
import { User, Post } from "./types";
import { getPosts, getCurrentUser, initDB } from "./data";
import MainFeed from "./components/MainFeed";
import ReelsFeed from "./components/ReelsFeed";
import ProfileView from "./components/ProfileView";
import UploadModal from "./components/UploadModal";

export default function App() {
  const [activeTab, setActiveTab] = useState<"home" | "reels" | "profile">("reels");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Initialize database and retrieve state on component mount
  useEffect(() => {
    initDB();
    setCurrentUser(getCurrentUser());
    setPosts(getPosts());
  }, []);

  const refreshData = () => {
    setPosts(getPosts());
    setCurrentUser(getCurrentUser());
  };

  const handleProfileUpdated = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    refreshData();
  };

  // Navigating directly to post when clicked from profile
  const handlePostSelected = (post: Post) => {
    if (post.type === "reel") {
      setActiveTab("reels");
    } else {
      setActiveTab("home");
    }
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="animate-pulse font-bold text-sm">جاري تحميل المنصة...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col md:flex-row antialiased">
      {/* 1. Desktop Sidebar Navigation (Hidden on Mobile) */}
      <aside className="hidden md:flex flex-col justify-between w-64 border-r border-zinc-900 bg-zinc-950 p-6 h-screen sticky top-0" dir="rtl">
        <div className="space-y-8">
          {/* Logo Brand */}
          <div className="flex items-center gap-3 justify-start px-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-500/10">
              <Film size={16} />
            </div>
            <div>
              <h1 className="text-md font-black tracking-wider text-white">إنستا-ريلز</h1>
              <p className="text-[9px] text-zinc-500 font-bold">INSTAREELS PLATFORM</p>
            </div>
          </div>

          {/* Quick Active User Card */}
          <div className="flex items-center gap-3 p-3 bg-zinc-900/50 border border-zinc-800/60 rounded-2xl">
            <img
              src={currentUser.avatar}
              alt={currentUser.fullName}
              className="w-9 h-9 rounded-full object-cover border border-purple-500/20"
            />
            <div className="text-right">
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-white leading-tight">{currentUser.fullName}</span>
                {currentUser.isVerified && (
                  <ShieldCheck size={14} className="text-purple-400 fill-purple-950/20" />
                )}
              </div>
              <span className="text-[10px] text-zinc-500">@{currentUser.username}</span>
            </div>
          </div>

          {/* Nav Items List */}
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab("reels")}
              className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl font-bold text-xs transition-all ${
                activeTab === "reels"
                  ? "bg-gradient-to-l from-purple-900/40 to-indigo-900/30 text-purple-400 border border-purple-800/30 shadow-md"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
              }`}
            >
              <Film size={18} />
              <span>فيديوهات ريلز (Reels)</span>
            </button>

            <button
              onClick={() => setActiveTab("home")}
              className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl font-bold text-xs transition-all ${
                activeTab === "home"
                  ? "bg-gradient-to-l from-purple-900/40 to-indigo-900/30 text-purple-400 border border-purple-800/30"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
              }`}
            >
              <Home size={18} />
              <span>الرئيسية (Feed)</span>
            </button>

            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl font-bold text-xs transition-all ${
                activeTab === "profile"
                  ? "bg-gradient-to-l from-purple-900/40 to-indigo-900/30 text-purple-400 border border-purple-800/30"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
              }`}
            >
              <UserIcon size={18} />
              <span>الملف الشخصي (Profile)</span>
            </button>

            {/* Upload Button */}
            <button
              onClick={() => setIsUploadOpen(true)}
              className="w-full flex items-center gap-3.5 px-4 py-4 rounded-2xl font-black text-xs text-white bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 shadow-lg shadow-purple-950/20 transition-all mt-4"
            >
              <PlusSquare size={18} />
              <span>نشر ريلز أو منشور جديد</span>
            </button>
          </nav>
        </div>

        {/* Footer Credit */}
        <div className="text-zinc-600 text-[10px] text-right font-medium leading-relaxed border-t border-zinc-900 pt-4">
          <p>منصة إنستا-ريلز المتكاملة © 2026</p>
          <p className="text-[9px] text-zinc-700 mt-0.5">مبني بقاعدة بيانات محلية دائمة 📁</p>
        </div>
      </aside>

      {/* 2. Mobile Top Header Bar */}
      <header className="md:hidden flex items-center justify-between px-5 py-4 bg-zinc-950 border-b border-zinc-900 sticky top-0 z-40" dir="rtl">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white">
            <Film size={14} />
          </div>
          <h1 className="text-sm font-black text-white tracking-wide">إنستا-ريلز</h1>
        </div>
        
        {/* Quick action profile avatar link */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsUploadOpen(true)}
            className="p-1.5 bg-zinc-900 text-purple-400 rounded-lg border border-zinc-850 hover:bg-zinc-800 transition-colors"
            title="نشر جديد"
          >
            <PlusSquare size={18} />
          </button>
          <img
            src={currentUser.avatar}
            alt={currentUser.fullName}
            onClick={() => setActiveTab("profile")}
            className="w-8 h-8 rounded-full object-cover border border-purple-500/20 cursor-pointer"
          />
        </div>
      </header>

      {/* 3. Main Content Wrapper */}
      <main className="flex-1 min-h-[calc(100vh-140px)] md:min-h-screen flex flex-col p-4 md:p-8 overflow-y-auto">
        {activeTab === "reels" && (
          <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
            <ReelsFeed 
              currentUser={currentUser} 
              onPostDeleted={refreshData} 
              posts={posts} 
            />
          </div>
        )}

        {activeTab === "home" && (
          <div className="max-w-lg mx-auto w-full py-4">
            <MainFeed 
              currentUser={currentUser} 
              onPostDeleted={refreshData} 
              posts={posts} 
            />
          </div>
        )}

        {activeTab === "profile" && (
          <div className="max-w-2xl mx-auto w-full py-4">
            <ProfileView 
              user={currentUser} 
              posts={posts} 
              onProfileUpdated={handleProfileUpdated}
              onPostSelect={handlePostSelected}
            />
          </div>
        )}
      </main>

      {/* 4. Mobile Bottom Navigation Tab Bar (Hidden on Desktop) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 h-16 bg-zinc-950 border-t border-zinc-900 flex justify-around items-center px-4 z-40 pb-safe shadow-lg">
        <button
          onClick={() => setActiveTab("reels")}
          className={`flex flex-col items-center justify-center p-2.5 transition-all ${
            activeTab === "reels" ? "text-purple-400 scale-110" : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <Film size={22} />
        </button>

        <button
          onClick={() => setActiveTab("home")}
          className={`flex flex-col items-center justify-center p-2.5 transition-all ${
            activeTab === "home" ? "text-purple-400 scale-110" : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <Home size={22} />
        </button>

        <button
          onClick={() => setActiveTab("profile")}
          className={`flex flex-col items-center justify-center p-2.5 transition-all ${
            activeTab === "profile" ? "text-purple-400 scale-110" : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <UserIcon size={22} />
        </button>
      </nav>

      {/* 5. Centralized Upload Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        currentUser={currentUser}
        onUploadSuccess={refreshData}
      />
    </div>
  );
}
