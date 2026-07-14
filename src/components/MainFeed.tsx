import React, { useState } from "react";
import { Heart, MessageCircle, Trash2, ShieldCheck, Send } from "lucide-react";
import { Post, User } from "../types";
import { toggleLikePost, addCommentToPost, deletePost } from "../data";

interface MainFeedProps {
  currentUser: User;
  onPostDeleted: () => void;
  posts: Post[];
}

export default function MainFeed({ currentUser, onPostDeleted, posts }: MainFeedProps) {
  // Filters out reels and sorts by newest
  const feedPosts = posts.filter(p => p.type === "post");

  if (feedPosts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center text-zinc-500 bg-zinc-950 border border-zinc-900 rounded-3xl p-8 max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-full border border-zinc-800 flex items-center justify-center bg-zinc-900 mb-4 text-purple-500">
          <MessageCircle size={24} />
        </div>
        <p className="font-semibold text-white text-lg">الخلاصة فارغة حالياً</p>
        <p className="text-xs mt-1 text-zinc-400">انشر أول صورة أو مقطع فيديو قصير لتظهر هنا! 📸</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      {feedPosts.map((post) => (
        <PostCard 
          key={post.id} 
          post={post} 
          currentUser={currentUser} 
          onPostDeleted={onPostDeleted} 
        />
      ))}
    </div>
  );
}

interface PostCardProps {
  key?: string;
  post: Post;
  currentUser: User;
  onPostDeleted: () => void;
}

function PostCard({ post, currentUser, onPostDeleted }: PostCardProps) {
  const [localPost, setLocalPost] = useState<Post>(post);
  const [commentText, setCommentText] = useState("");
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);

  const hasLiked = localPost.likes.includes(currentUser.id);
  const isOwner = localPost.userId === currentUser.id;

  const handleLike = () => {
    const updated = toggleLikePost(localPost.id, currentUser.id);
    if (updated) {
      setLocalPost({ ...updated });
    }
  };

  const handleDoubleTap = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!hasLiked) {
      handleLike();
    }
    setShowHeartAnimation(true);
    setTimeout(() => setShowHeartAnimation(false), 800);
  };

  const handleDelete = () => {
    if (window.confirm("هل ترغب في حذف هذا المنشور نهائياً؟ 🗑️")) {
      deletePost(localPost.id);
      onPostDeleted();
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const updated = addCommentToPost(localPost.id, {
      userId: currentUser.id,
      username: currentUser.username,
      userAvatar: currentUser.avatar,
      text: commentText.trim()
    });

    if (updated) {
      setLocalPost({ ...updated });
      setCommentText("");
    }
  };

  // Format time ago manually in Arabic
  const formatTimeArabic = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);

    if (mins < 1) return "الآن";
    if (mins < 60) return `منذ ${mins} دقيقة`;
    if (hours < 24) return `منذ ${hours} ساعة`;
    return `منذ ${days} يوم`;
  };

  return (
    <div className="bg-zinc-950 border border-zinc-900 rounded-3xl overflow-hidden shadow-xl animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-900" dir="rtl">
        <div className="flex items-center gap-3">
          <img
            src={localPost.userAvatar}
            alt={localPost.username}
            className="w-10 h-10 rounded-full object-cover border border-purple-500/30"
          />
          <div>
            <div className="flex items-center gap-1">
              <span className="text-white font-bold text-sm">@{localPost.username}</span>
              {localPost.isVerified && (
                <ShieldCheck size={16} className="text-purple-400 fill-purple-950/20" />
              )}
            </div>
            <span className="text-zinc-500 text-[10px]">{formatTimeArabic(localPost.createdAt)}</span>
          </div>
        </div>

        {isOwner && (
          <button
            onClick={handleDelete}
            className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
            title="حذف المنشور"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {/* Media Image / Video content */}
      <div 
        className="relative aspect-square bg-zinc-900 flex items-center justify-center cursor-pointer overflow-hidden"
        onDoubleClick={handleDoubleTap}
      >
        {localPost.mediaUrl.startsWith("data:video") || localPost.mediaUrl.endsWith(".mp4") ? (
          <video 
            src={localPost.mediaUrl} 
            className="w-full h-full object-cover" 
            controls 
            muted 
          />
        ) : (
          <img 
            src={localPost.mediaUrl} 
            alt="Post content" 
            className="w-full h-full object-cover" 
          />
        )}

        {/* Double click heart animation overlay */}
        {showHeartAnimation && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 animate-heart-pop">
            <Heart className="text-red-500 fill-red-500 scale-150 drop-shadow-2xl" size={70} />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-center" dir="rtl">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              className="flex items-center gap-1.5 text-zinc-400 hover:text-red-500 transition-colors"
            >
              <Heart 
                size={22} 
                className={hasLiked ? "text-red-500 fill-red-500 animate-heart-pop" : ""} 
              />
              <span className="text-xs font-bold text-zinc-300">{localPost.likes.length}</span>
            </button>
            <button
              onClick={() => setShowAllComments(!showAllComments)}
              className="flex items-center gap-1.5 text-zinc-400 hover:text-purple-400 transition-colors"
            >
              <MessageCircle size={22} />
              <span className="text-xs font-bold text-zinc-300">{localPost.comments.length}</span>
            </button>
          </div>
        </div>

        {/* Caption */}
        <div className="text-right text-sm" dir="rtl">
          <span className="text-white font-bold ml-2">@{localPost.username}</span>
          <span className="text-zinc-300 font-medium">{localPost.caption}</span>
        </div>

        {/* Dynamic Comments List */}
        {localPost.comments.length > 0 && (
          <div className="border-t border-zinc-900 pt-3 mt-2 space-y-2.5 text-right" dir="rtl">
            <button 
              onClick={() => setShowAllComments(!showAllComments)}
              className="text-xs text-zinc-500 hover:text-zinc-300 font-semibold mb-1"
            >
              {showAllComments 
                ? "إخفاء التعليقات" 
                : `عرض كافة التعليقات (${localPost.comments.length})...`
              }
            </button>

            {/* Comments rendering */}
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {(showAllComments ? localPost.comments : localPost.comments.slice(-2)).map((comment) => (
                <div key={comment.id} className="text-xs flex items-start gap-2 justify-start">
                  <img
                    src={comment.userAvatar}
                    alt={comment.username}
                    className="w-6 h-6 rounded-full object-cover border border-zinc-800"
                  />
                  <div className="bg-zinc-900/60 rounded-xl px-3 py-1.5 flex-1 border border-zinc-900">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="text-[9px] text-zinc-500">
                        {formatTimeArabic(comment.createdAt)}
                      </span>
                      <span className="text-white font-bold">@{comment.username}</span>
                    </div>
                    <p className="text-zinc-300 break-words">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comment post input */}
        <form onSubmit={handleAddComment} className="flex gap-2 pt-2 border-t border-zinc-900">
          <button
            type="submit"
            className="p-2.5 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-purple-500 hover:text-purple-400 rounded-xl transition-all"
          >
            <Send size={15} className="rotate-180" />
          </button>
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="أضف تعليقاً..."
            dir="rtl"
            className="flex-1 px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-xl text-xs focus:border-purple-500 focus:outline-none placeholder:text-zinc-600"
          />
        </form>
      </div>
    </div>
  );
}
