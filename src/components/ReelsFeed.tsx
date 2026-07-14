import React, { useState, useEffect, useRef } from "react";
import { Heart, MessageCircle, Volume2, VolumeX, Trash2, ShieldCheck, Play, Pause, Send } from "lucide-react";
import { Post, User, SocialComment } from "../types";
import { toggleLikePost, addCommentToPost, deletePost, getPosts } from "../data";

interface ReelsFeedProps {
  currentUser: User;
  onPostDeleted: () => void;
  posts: Post[];
}

export default function ReelsFeed({ currentUser, onPostDeleted, posts }: ReelsFeedProps) {
  const [reels, setReels] = useState<Post[]>([]);
  const [isMuted, setIsMuted] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter only reel type posts
  useEffect(() => {
    setReels(posts.filter(p => p.type === "reel"));
  }, [posts]);

  if (reels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center text-zinc-500">
        <div className="w-16 h-16 rounded-full border border-zinc-800 flex items-center justify-center bg-zinc-900 mb-4 text-purple-500">
          <Trash2 size={24} />
        </div>
        <p className="font-semibold text-white">لا توجد ريلزات حالياً</p>
        <p className="text-xs mt-1">اضغط على زر النشر لإضافة ريلز جديد! 🎬</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[420px] mx-auto h-[calc(100vh-140px)] md:h-[750px] relative rounded-2xl border border-zinc-800 bg-black overflow-hidden shadow-2xl">
      <div 
        ref={containerRef}
        className="h-full w-full overflow-y-scroll snap-y snap-mandatory scrollbar-none"
        style={{ scrollBehavior: "smooth" }}
      >
        {reels.map((reel) => (
          <ReelItem 
            key={reel.id} 
            reel={reel} 
            currentUser={currentUser} 
            isMuted={isMuted}
            onToggleMute={() => setIsMuted(!isMuted)}
            onPostDeleted={onPostDeleted}
          />
        ))}
      </div>
    </div>
  );
}

interface ReelItemProps {
  key?: string;
  reel: Post;
  currentUser: User;
  isMuted: boolean;
  onToggleMute: () => void;
  onPostDeleted: () => void;
}

function ReelItem({ reel, currentUser, isMuted, onToggleMute, onPostDeleted }: ReelItemProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [localReel, setLocalReel] = useState<Post>(reel);
  const [showHeartOverlay, setShowHeartOverlay] = useState(false);
  const [showPlayOverlay, setShowPlayOverlay] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [progress, setProgress] = useState(0);

  const hasLiked = localReel.likes.includes(currentUser.id);
  const isOwner = localReel.userId === currentUser.id;

  // Sync state if reel changes in parent
  useEffect(() => {
    setLocalReel(reel);
  }, [reel]);

  // Video viewport triggers (auto-play when fully visible)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.currentTime = 0;
            video.play().catch(err => console.log("Auto-play blocked by browser", err));
            setIsPlaying(true);
          } else {
            video.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.6 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play().catch(err => console.log("Play failed", err));
      setIsPlaying(true);
    }
    setShowPlayOverlay(true);
    setTimeout(() => setShowPlayOverlay(false), 500);
  };

  const handleDoubleTap = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!hasLiked) {
      handleLike();
    }
    setShowHeartOverlay(true);
    setTimeout(() => setShowHeartOverlay(false), 800);
  };

  const handleLike = () => {
    const updated = toggleLikePost(localReel.id, currentUser.id);
    if (updated) {
      setLocalReel({ ...updated });
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    const pct = (video.currentTime / video.duration) * 100;
    setProgress(pct || 0);
  };

  const handleDelete = () => {
    if (window.confirm("هل أنت متأكد من حذف هذا الريلز نهائياً؟ 🗑️")) {
      deletePost(localReel.id);
      onPostDeleted();
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const updated = addCommentToPost(localReel.id, {
      userId: currentUser.id,
      username: currentUser.username,
      userAvatar: currentUser.avatar,
      text: commentText.trim()
    });

    if (updated) {
      setLocalReel({ ...updated });
      setCommentText("");
    }
  };

  return (
    <div className="relative w-full h-full snap-start flex items-center justify-center bg-black">
      {/* Video Element */}
      <video
        ref={videoRef}
        src={localReel.mediaUrl}
        loop
        muted={isMuted}
        playsInline
        onClick={handlePlayPause}
        onDoubleClick={handleDoubleTap}
        onTimeUpdate={handleTimeUpdate}
        className="w-full h-full object-cover cursor-pointer"
      />

      {/* Play/Pause Flashing Indicator */}
      {showPlayOverlay && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 animate-ping-once">
          <div className="p-4 bg-black/60 rounded-full text-white">
            {isPlaying ? <Play size={32} /> : <Pause size={32} />}
          </div>
        </div>
      )}

      {/* Hearts Flashing Indicator on Double Tap */}
      {showHeartOverlay && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 animate-heart-pop">
          <Heart className="text-red-500 fill-red-500 scale-150 drop-shadow-2xl" size={80} />
        </div>
      )}

      {/* Top Controls Overlay */}
      <div className="absolute top-4 inset-x-4 flex justify-between items-center pointer-events-none z-20">
        <h3 className="text-white font-black text-lg tracking-wider drop-shadow-md">ريلز</h3>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleMute();
          }}
          className="p-2.5 bg-black/40 hover:bg-black/60 text-white rounded-full transition-all pointer-events-auto border border-white/10 backdrop-blur-sm"
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      </div>

      {/* Sidebar Controls Panel (Right side) */}
      <div className="absolute right-3 bottom-20 flex flex-col items-center gap-5 z-20 pointer-events-auto">
        {/* Like */}
        <div className="flex flex-col items-center">
          <button
            onClick={handleLike}
            className="group p-3 bg-black/40 hover:bg-black/60 text-white hover:scale-110 rounded-full transition-all border border-white/10 backdrop-blur-sm shadow-lg"
          >
            <Heart 
              size={22} 
              className={`transition-all ${
                hasLiked ? "text-red-500 fill-red-500 scale-110" : "text-white group-hover:text-red-400"
              }`} 
            />
          </button>
          <span className="text-white text-xs font-bold mt-1 drop-shadow-md">
            {localReel.likes.length}
          </span>
        </div>

        {/* Comment Bubble */}
        <div className="flex flex-col items-center">
          <button
            onClick={() => setShowComments(true)}
            className="p-3 bg-black/40 hover:bg-black/60 text-white hover:scale-110 rounded-full transition-all border border-white/10 backdrop-blur-sm shadow-lg"
          >
            <MessageCircle size={22} className="text-white hover:text-purple-400" />
          </button>
          <span className="text-white text-xs font-bold mt-1 drop-shadow-md">
            {localReel.comments.length}
          </span>
        </div>

        {/* Delete (Strict Deletion Verification) */}
        {isOwner && (
          <div className="flex flex-col items-center">
            <button
              onClick={handleDelete}
              className="p-3 bg-red-600/80 hover:bg-red-600 text-white hover:scale-110 rounded-full transition-all shadow-lg border border-red-500/10"
              title="حذف الريل"
            >
              <Trash2 size={22} />
            </button>
            <span className="text-red-400 text-[10px] font-bold mt-1 drop-shadow-md">حذف</span>
          </div>
        )}
      </div>

      {/* Bottom Info Overlay */}
      <div className="absolute bottom-3 inset-x-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 rounded-xl z-20 text-right" dir="rtl">
        <div className="flex items-center gap-2 mb-2 justify-end">
          {/* Avatar & User Details */}
          <div className="text-right">
            <div className="flex items-center gap-1.5 justify-end">
              {localReel.isVerified && (
                <ShieldCheck size={16} className="text-purple-400 fill-purple-950/20" />
              )}
              <span className="text-white font-bold text-sm tracking-wide">@{localReel.username}</span>
            </div>
          </div>
          <img
            src={localReel.userAvatar}
            alt={localReel.username}
            className="w-9 h-9 rounded-full object-cover border-2 border-purple-500 shadow-md"
          />
        </div>

        {/* Caption */}
        <p className="text-zinc-200 text-xs leading-relaxed max-w-[85%] mr-auto break-words font-medium">
          {localReel.caption}
        </p>

        {/* Small spacer */}
        <div className="h-2"></div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800 z-30">
        <div 
          className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 transition-all duration-100" 
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Comments Drawer (Slide Over inside parent) */}
      {showComments && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-40 flex flex-col justify-end transition-all animate-slide-up">
          <div className="w-full bg-zinc-950 border-t border-zinc-800 rounded-t-3xl max-h-[70%] flex flex-col">
            
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
              <button 
                onClick={() => setShowComments(false)}
                className="p-1 text-zinc-400 hover:text-white"
              >
                ✕
              </button>
              <h4 className="text-white text-sm font-bold">التعليقات ({localReel.comments.length})</h4>
              <div className="w-6"></div>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {localReel.comments.length === 0 ? (
                <p className="text-center text-zinc-600 text-xs py-8">لا توجد تعليقات بعد. كن أول من يعلق! ✍️</p>
              ) : (
                localReel.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3 items-start justify-end text-right" dir="rtl">
                    <img
                      src={comment.userAvatar}
                      alt={comment.username}
                      className="w-8 h-8 rounded-full object-cover border border-zinc-800"
                    />
                    <div className="flex-1 bg-zinc-900 border border-zinc-800/40 rounded-2xl px-4 py-2.5">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-zinc-500 text-[10px]">
                          {new Date(comment.createdAt).toLocaleDateString("ar-EG", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                        <span className="text-white text-xs font-bold">@{comment.username}</span>
                      </div>
                      <p className="text-zinc-200 text-xs break-all leading-relaxed font-medium">
                        {comment.text}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Post Comment Input */}
            <form onSubmit={handleAddComment} className="p-4 border-t border-zinc-900 bg-zinc-950 flex gap-2">
              <button
                type="submit"
                className="p-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-all"
              >
                <Send size={16} className="rotate-180" />
              </button>
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="أضف تعليقاً..."
                dir="rtl"
                className="flex-1 px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs focus:border-purple-500 focus:outline-none placeholder:text-zinc-600"
              />
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
