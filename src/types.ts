export interface User {
  id: string;
  username: string;
  fullName: string;
  avatar: string;
  bio: string;
  followersCount: number;
  followingCount: number;
  isVerified?: boolean;
}

export interface SocialComment {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  text: string;
  createdAt: number;
}

export interface Post {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  isVerified?: boolean;
  type: "post" | "reel";
  caption: string;
  mediaUrl: string; // Base64 or standard CDN URL
  likes: string[]; // List of user IDs who liked
  comments: SocialComment[];
  createdAt: number;
  duration?: number; // Video duration in seconds (only for reels)
  viewsCount?: number;
}
