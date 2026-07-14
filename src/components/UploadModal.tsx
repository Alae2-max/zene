import React, { useState, useRef } from "react";
import { X, UploadCloud, Film, Image as ImageIcon, Check, Loader2 } from "lucide-react";
import { Post, User } from "../types";
import { addPost } from "../data";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onUploadSuccess: () => void;
}

export default function UploadModal({ isOpen, onClose, currentUser, onUploadSuccess }: UploadModalProps) {
  const [type, setType] = useState<"reel" | "post">("reel");
  const [caption, setCaption] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [duration, setDuration] = useState<number | undefined>(undefined);
  const [error, setError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    setError("");
    const isVideo = file.type.startsWith("video/");
    const isImage = file.type.startsWith("image/");

    if (type === "reel" && !isVideo) {
      setError("الرجاء اختيار ملف فيديو للريلز 🎬");
      return;
    }
    if (type === "post" && !isImage && !isVideo) {
      setError("الرجاء اختيار صورة أو فيديو للمنشور 📸");
      return;
    }

    setFileName(file.name);
    setLoading(true);

    // Get video duration if it's a video
    if (isVideo) {
      const videoEl = document.createElement("video");
      videoEl.preload = "metadata";
      videoEl.onloadedmetadata = () => {
        setDuration(Math.round(videoEl.duration));
      };
      videoEl.src = URL.createObjectURL(file);
    } else {
      setDuration(undefined);
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setMediaUrl(event.target.result as string);
      }
      setLoading(false);
    };
    reader.onerror = () => {
      setError("حدث خطأ أثناء قراءة الملف.");
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaUrl) {
      setError("يرجى رفع ملف أولاً.");
      return;
    }

    setLoading(true);

    try {
      const newPost: Post = {
        id: "post_" + Math.random().toString(36).slice(2, 9),
        userId: currentUser.id,
        username: currentUser.username,
        userAvatar: currentUser.avatar,
        isVerified: currentUser.isVerified,
        type,
        caption,
        mediaUrl,
        likes: [],
        comments: [],
        createdAt: Date.now(),
        duration: type === "reel" ? (duration || 10) : undefined,
        viewsCount: type === "reel" ? 0 : undefined
      };

      addPost(newPost);
      setLoading(false);
      onUploadSuccess();
      onClose();
      // Reset state
      setCaption("");
      setMediaUrl("");
      setFileName("");
      setDuration(undefined);
    } catch (err) {
      console.error(err);
      setError("فشل نشر المحتوى. يرجى المحاولة لاحقاً.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-xl overflow-hidden bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <button 
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
          <h2 className="text-lg font-bold text-white text-right">إنشاء منشور جديد</h2>
          <div className="w-8"></div> {/* Spacing */}
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Post/Reel Selector */}
          <div className="grid grid-cols-2 gap-3 p-1 bg-zinc-900 border border-zinc-800 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setType("reel");
                setMediaUrl("");
                setFileName("");
                setDuration(undefined);
              }}
              className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-semibold text-sm transition-all ${
                type === "reel" 
                  ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg" 
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Film size={16} />
              <span>ريلز قصير (Reel)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setType("post");
                setMediaUrl("");
                setFileName("");
                setDuration(undefined);
              }}
              className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-semibold text-sm transition-all ${
                type === "post" 
                  ? "bg-white text-black shadow-lg" 
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <ImageIcon size={16} />
              <span>منشور عادي (Post)</span>
            </button>
          </div>

          {/* Upload Drop Zone */}
          {!mediaUrl ? (
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-[220px] ${
                dragActive 
                  ? "border-purple-500 bg-purple-950/10" 
                  : "border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/40"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                accept={type === "reel" ? "video/*" : "image/*,video/*"}
                className="hidden"
              />
              
              {loading ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="animate-spin text-purple-500" size={40} />
                  <p className="text-sm text-zinc-400 font-medium">جاري معالجة الملف...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-purple-500">
                    <UploadCloud size={32} />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">اسحب الملف وأفلته هنا أو اضغط للتصفح</p>
                    <p className="text-xs text-zinc-500 mt-1">
                      {type === "reel" ? "صيغة MP4 أو WebM (أقل من 50 ميجابايت)" : "صيغ PNG, JPG, JPEG أو MP4"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Media Preview */
            <div className="relative border border-zinc-800 rounded-2xl overflow-hidden bg-black flex justify-center max-h-[300px]">
              {type === "reel" || mediaUrl.startsWith("data:video") || mediaUrl.endsWith(".mp4") ? (
                <video src={mediaUrl} className="max-h-[300px] object-contain w-full" controls muted />
              ) : (
                <img src={mediaUrl} alt="Preview" className="max-h-[300px] object-contain w-full" />
              )}
              <button
                type="button"
                onClick={() => {
                  setMediaUrl("");
                  setFileName("");
                  setDuration(undefined);
                }}
                className="absolute top-3 right-3 p-1.5 bg-black/60 hover:bg-black/90 text-white rounded-full transition-colors border border-zinc-800"
              >
                <X size={16} />
              </button>
              <div className="absolute bottom-3 left-3 px-3 py-1 bg-black/70 border border-zinc-800 rounded-full text-xs font-semibold text-zinc-300">
                {type === "reel" ? "🎬 ريلز" : "📸 منشور"}
                {duration && ` • ${duration} ثانية`}
              </div>
            </div>
          )}

          {error && (
            <p className="text-red-500 text-sm font-semibold text-right">{error}</p>
          )}

          {/* Caption Input */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-zinc-400 text-right">الوصف أو الشرح (Caption)</label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="اكتب شرحاً جميلاً لمنشورك... استخدم الهشتاغات #سوشيال_ميديا"
              dir="rtl"
              rows={4}
              maxLength={200}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 text-white rounded-xl text-sm focus:border-purple-500 focus:outline-none transition-all placeholder:text-zinc-600 resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !mediaUrl}
            className="w-full py-3 px-5 rounded-xl font-bold text-sm text-center flex items-center justify-center gap-2 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-4"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                <span>جاري النشر...</span>
              </>
            ) : (
              <>
                <Check size={16} />
                <span>نشر الآن</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
