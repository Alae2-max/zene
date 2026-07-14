import React, { useState } from "react";
import { Grid, Film, ShieldCheck, Edit3, Save, MessageCircle, Heart, Film as ReelIcon } from "lucide-react";
import { User, Post } from "../types";
import { saveCurrentUser } from "../data";

interface ProfileViewProps {
  user: User;
  posts: Post[];
  onProfileUpdated: (updatedUser: User) => void;
  onPostSelect?: (post: Post) => void;
}

export default function ProfileView({ user, posts, onProfileUpdated, onPostSelect }: ProfileViewProps) {
  const [activeTab, setActiveTab] = useState<"posts" | "reels">("posts");
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user.fullName);
  const [bio, setBio] = useState(user.bio);
  const [avatar, setAvatar] = useState(user.avatar);

  // Filter posts of the current profile user
  const userPosts = posts.filter(p => p.userId === user.id && p.type === "post");
  const userReels = posts.filter(p => p.userId === user.id && p.type === "reel");

  const handleSave = () => {
    if (!fullName.trim()) return;
    const updatedUser: User = {
      ...user,
      fullName: fullName.trim(),
      bio: bio.trim(),
      avatar: avatar.trim()
    };
    saveCurrentUser(updatedUser);
    onProfileUpdated(updatedUser);
    setIsEditing(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12 animate-fade-in" dir="rtl">
      {/* Banner / Header Card */}
      <div className="relative bg-zinc-950 border border-zinc-900 rounded-3xl overflow-hidden shadow-xl">
        {/* Cover Background Gradient */}
        <div className="h-40 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 relative">
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />
        </div>

        {/* Profile Content Details */}
        <div className="px-6 pb-6 pt-1">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-5 -mt-16 mb-5">
            {/* Avatar */}
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.fullName}
                className="w-28 h-28 rounded-full object-cover border-4 border-zinc-950 bg-zinc-900 shadow-xl"
              />
            </div>

            {/* User Title Information */}
            <div className="flex-1 text-center md:text-right">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1">
                <h2 className="text-xl font-black text-white">{user.fullName}</h2>
                {user.isVerified && (
                  <ShieldCheck size={20} className="text-purple-400 fill-purple-950/20" title="حساب موثق" />
                )}
                <span className="text-zinc-500 text-xs font-semibold px-2.5 py-0.5 bg-zinc-900 border border-zinc-800 rounded-full">
                  @{user.username}
                </span>
              </div>

              {isEditing ? (
                <div className="mt-4 space-y-3 max-w-md bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-zinc-500">الاسم الكامل</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-zinc-500">رابط الصورة الشخصية (URL)</label>
                    <input
                      type="text"
                      value={avatar}
                      onChange={(e) => setAvatar(e.target.value)}
                      className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-zinc-500">السيرة الذاتية (Bio)</label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-purple-500 resize-none"
                    />
                  </div>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold rounded-xl text-xs shadow-lg hover:from-pink-500 hover:to-purple-500 transition-all"
                  >
                    <Save size={13} />
                    <span>حفظ التعديلات</span>
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-zinc-300 text-xs mt-1.5 font-medium max-w-md leading-relaxed whitespace-pre-wrap">
                    {user.bio || "لا يوجد وصف."}
                  </p>
                  
                  {/* Stats Counter Row */}
                  <div className="flex justify-center md:justify-start gap-6 mt-4 border-t border-zinc-900 pt-3">
                    <div className="text-center md:text-right">
                      <span className="text-white font-black text-sm">{userPosts.length + userReels.length}</span>
                      <span className="text-zinc-500 text-xs mr-1 font-semibold">منشور</span>
                    </div>
                    <div className="text-center md:text-right">
                      <span className="text-white font-black text-sm">{user.followersCount}</span>
                      <span className="text-zinc-500 text-xs mr-1 font-semibold">متابع</span>
                    </div>
                    <div className="text-center md:text-right">
                      <span className="text-white font-black text-sm">{user.followingCount}</span>
                      <span className="text-zinc-500 text-xs mr-1 font-semibold">يتابع</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Edit Profile Trigger */}
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 hover:text-white font-bold rounded-xl text-xs transition-colors shadow-sm"
              >
                <Edit3 size={13} />
                <span>تعديل الملف</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid Tabs Selection */}
      <div className="flex border-b border-zinc-900">
        <button
          onClick={() => setActiveTab("posts")}
          className={`flex-1 pb-3 flex items-center justify-center gap-2 border-b-2 font-bold text-sm transition-all ${
            activeTab === "posts" 
              ? "border-purple-500 text-purple-500" 
              : "border-transparent text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <Grid size={16} />
          <span>المنشورات ({userPosts.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("reels")}
          className={`flex-1 pb-3 flex items-center justify-center gap-2 border-b-2 font-bold text-sm transition-all ${
            activeTab === "reels" 
              ? "border-purple-500 text-purple-500" 
              : "border-transparent text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <Film size={16} />
          <span>الريلزات ({userReels.length})</span>
        </button>
      </div>

      {/* Thumbnail Grids */}
      {activeTab === "posts" ? (
        userPosts.length === 0 ? (
          <div className="text-center py-16 text-zinc-600 bg-zinc-950 border border-zinc-900 rounded-3xl p-6">
            <p className="font-semibold text-white">لا توجد منشورات بعد</p>
            <p className="text-xs mt-1">اضغط على زر النشر وأضف أول صورة لمنشوراتك! 📸</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 md:gap-4">
            {userPosts.map((post) => (
              <div 
                key={post.id} 
                onClick={() => onPostSelect && onPostSelect(post)}
                className="relative aspect-square group cursor-pointer border border-zinc-900 rounded-2xl overflow-hidden bg-zinc-900/40 hover:border-zinc-700 transition-all"
              >
                {post.mediaUrl.startsWith("data:video") || post.mediaUrl.endsWith(".mp4") ? (
                  <video src={post.mediaUrl} className="w-full h-full object-cover" muted />
                ) : (
                  <img src={post.mediaUrl} alt={post.caption} className="w-full h-full object-cover" />
                )}
                {/* Stats hover Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-4 transition-all z-10">
                  <div className="flex items-center gap-1.5 text-white font-bold text-xs">
                    <MessageCircle size={14} className="fill-white" />
                    <span>{post.comments.length}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-white font-bold text-xs">
                    <Heart size={14} className="fill-white text-red-500" />
                    <span>{post.likes.length}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        userReels.length === 0 ? (
          <div className="text-center py-16 text-zinc-600 bg-zinc-950 border border-zinc-900 rounded-3xl p-6">
            <p className="font-semibold text-white">لا توجد ريلزات بعد</p>
            <p className="text-xs mt-1">ابدأ برفع أول ريلز قصير واجذب المتابعين! 🎬</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 md:gap-4">
            {userReels.map((reel) => (
              <div 
                key={reel.id} 
                onClick={() => onPostSelect && onPostSelect(reel)}
                className="relative aspect-[9/16] group cursor-pointer border border-zinc-900 rounded-2xl overflow-hidden bg-zinc-900/40 hover:border-zinc-700 transition-all"
              >
                <video src={reel.mediaUrl} className="w-full h-full object-cover" muted />
                {/* Reels Info Overlay */}
                <div className="absolute bottom-2 right-2 p-1.5 bg-black/60 rounded-lg text-white pointer-events-none flex items-center gap-1 text-[10px] font-bold border border-white/5 backdrop-blur-sm">
                  <ReelIcon size={10} />
                  <span>{reel.duration}ث</span>
                </div>
                {/* Stats hover Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-4 transition-all z-10">
                  <div className="flex items-center gap-1.5 text-white font-bold text-xs">
                    <MessageCircle size={14} className="fill-white" />
                    <span>{reel.comments.length}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-white font-bold text-xs">
                    <Heart size={14} className="fill-white text-red-500" />
                    <span>{reel.likes.length}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
