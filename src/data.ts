import { User, Post, SocialComment } from "./types";

// High-quality vertical video URLs (direct public MP4 links from Vimeo/Mixkit)
const DEMO_REELS = [
  {
    mediaUrl: "https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0227e3dc26a42426993208034dbf754&profile_id=165&oauth2_token_id=57447761",
    caption: "Wandering through the breathtaking bamboo forests of Kyoto 🎋✨ Nature at its finest. #travel #nature #kyoto",
    duration: 15,
    viewsCount: 14200
  },
  {
    mediaUrl: "https://player.vimeo.com/external/435674703.sd.mp4?s=7f394c1e138a4d137fd1006593fc2aa19d007a12&profile_id=165&oauth2_token_id=57447761",
    caption: "The morning pour is a form of art ☕️ Here is your daily dose of calm. Have a beautiful day! #coffee #barista #aesthetic",
    duration: 12,
    viewsCount: 8900
  },
  {
    mediaUrl: "https://player.vimeo.com/external/517602126.sd.mp4?s=73bf206ce59ec476fa35be6b4f7a26f30df4d8d1&profile_id=165&oauth2_token_id=57447761",
    caption: "Lost in the vibrant lights of Tokyo's neon streets 🌌 True cyberpunk vibes. #tokyo #citylife #neon",
    duration: 18,
    viewsCount: 25400
  },
  {
    mediaUrl: "https://player.vimeo.com/external/538564175.sd.mp4?s=b6c2ee74b62db446df0dfa4a7541b632015fa4d5&profile_id=165&oauth2_token_id=57447761",
    caption: "Quick garlic butter pasta recipe that takes less than 10 minutes 🍝 Saving this for dinner! #cooking #pasta #recipes",
    duration: 22,
    viewsCount: 19800
  }
];

const DEMO_POSTS_IMAGES = [
  "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=80"
];

const DEFAULT_USERS: User[] = [
  {
    id: "user_alaadine",
    username: "alaadine",
    fullName: "Alaadine",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    bio: "المنصة الرسمية لنشر الريلزات والفيديوهات القصيرة 🎬✨ مرحباً بكم في عالمي الخاص.",
    followersCount: 1250,
    followingCount: 380,
    isVerified: true
  },
  {
    id: "user_sarah",
    username: "sarah_chen",
    fullName: "Sarah Chen",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    bio: "Travel filmmaker and explorer. Capturing moments from around the world 📸✈️",
    followersCount: 8400,
    followingCount: 420,
    isVerified: true
  },
  {
    id: "user_lucas",
    username: "chef_lucas",
    fullName: "Lucas Miller",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80",
    bio: "Gastronomy enthusiast and digital creator. Making cooking simple and fun 🍕👨‍🍳",
    followersCount: 12100,
    followingCount: 150
  }
];

// Helper to seed database if empty
export function initDB() {
  const usersKey = "instareels_users";
  const postsKey = "instareels_posts";
  const currentUserKey = "instareels_current_user";

  if (!localStorage.getItem(usersKey)) {
    localStorage.setItem(usersKey, JSON.stringify(DEFAULT_USERS));
  }

  if (!localStorage.getItem(currentUserKey)) {
    localStorage.setItem(currentUserKey, JSON.stringify(DEFAULT_USERS[0]));
  }

  if (!localStorage.getItem(postsKey)) {
    const initialPosts: Post[] = [
      // Pre-seeded Reels
      {
        id: "reel_1",
        userId: "user_sarah",
        username: "sarah_chen",
        userAvatar: DEFAULT_USERS[1].avatar,
        isVerified: DEFAULT_USERS[1].isVerified,
        type: "reel",
        caption: DEMO_REELS[0].caption,
        mediaUrl: DEMO_REELS[0].mediaUrl,
        likes: ["user_alaadine", "user_lucas"],
        comments: [
          {
            id: "comment_1",
            userId: "user_alaadine",
            username: "alaadine",
            userAvatar: DEFAULT_USERS[0].avatar,
            text: "This is stunning! Kyoto is definitely on my bucket list. 😍🎋",
            createdAt: Date.now() - 3600000 * 5
          },
          {
            id: "comment_2",
            userId: "user_lucas",
            username: "chef_lucas",
            userAvatar: DEFAULT_USERS[2].avatar,
            text: "Beautiful grading! What lens did you use?",
            createdAt: Date.now() - 3600000 * 2
          }
        ],
        createdAt: Date.now() - 3600000 * 24,
        duration: DEMO_REELS[0].duration,
        viewsCount: DEMO_REELS[0].viewsCount
      },
      {
        id: "reel_2",
        userId: "user_lucas",
        username: "chef_lucas",
        userAvatar: DEFAULT_USERS[2].avatar,
        type: "reel",
        caption: DEMO_REELS[1].caption,
        mediaUrl: DEMO_REELS[1].mediaUrl,
        likes: ["user_sarah"],
        comments: [
          {
            id: "comment_3",
            userId: "user_sarah",
            username: "sarah_chen",
            userAvatar: DEFAULT_USERS[1].avatar,
            text: "Ah, the lighting is absolutely perfect. Need this coffee right now!",
            createdAt: Date.now() - 3600000 * 4
          }
        ],
        createdAt: Date.now() - 3600000 * 18,
        duration: DEMO_REELS[1].duration,
        viewsCount: DEMO_REELS[1].viewsCount
      },
      {
        id: "reel_3",
        userId: "user_sarah",
        username: "sarah_chen",
        userAvatar: DEFAULT_USERS[1].avatar,
        isVerified: DEFAULT_USERS[1].isVerified,
        type: "reel",
        caption: DEMO_REELS[2].caption,
        mediaUrl: DEMO_REELS[2].mediaUrl,
        likes: ["user_alaadine"],
        comments: [],
        createdAt: Date.now() - 3600000 * 12,
        duration: DEMO_REELS[2].duration,
        viewsCount: DEMO_REELS[2].viewsCount
      },
      {
        id: "reel_4",
        userId: "user_lucas",
        username: "chef_lucas",
        userAvatar: DEFAULT_USERS[2].avatar,
        type: "reel",
        caption: DEMO_REELS[3].caption,
        mediaUrl: DEMO_REELS[3].mediaUrl,
        likes: ["user_alaadine", "user_sarah"],
        comments: [
          {
            id: "comment_4",
            userId: "user_alaadine",
            username: "alaadine",
            userAvatar: DEFAULT_USERS[0].avatar,
            text: "Tried this! It is extremely delicious and super quick to make. 🍝💯",
            createdAt: Date.now() - 3600000 * 1
          }
        ],
        createdAt: Date.now() - 3600000 * 6,
        duration: DEMO_REELS[3].duration,
        viewsCount: DEMO_REELS[3].viewsCount
      },
      // Pre-seeded Image Post
      {
        id: "post_1",
        userId: "user_sarah",
        username: "sarah_chen",
        userAvatar: DEFAULT_USERS[1].avatar,
        isVerified: DEFAULT_USERS[1].isVerified,
        type: "post",
        caption: "Found this gorgeous secret spot while hiking. Nature heals. 🌲💚 #naturelovers #adventure",
        mediaUrl: DEMO_POSTS_IMAGES[0],
        likes: ["user_alaadine"],
        comments: [
          {
            id: "comment_5",
            userId: "user_lucas",
            username: "chef_lucas",
            userAvatar: DEFAULT_USERS[2].avatar,
            text: "Wow! The air must be so fresh there.",
            createdAt: Date.now() - 3600000 * 3
          }
        ],
        createdAt: Date.now() - 3600000 * 48
      }
    ];
    localStorage.setItem(postsKey, JSON.stringify(initialPosts));
  }
}

// DB Retrieval and Update Utilities
export function getUsers(): User[] {
  initDB();
  return JSON.parse(localStorage.getItem("instareels_users") || "[]");
}

export function saveUsers(users: User[]) {
  localStorage.setItem("instareels_users", JSON.stringify(users));
}

export function getPosts(): Post[] {
  initDB();
  return JSON.parse(localStorage.getItem("instareels_posts") || "[]");
}

export function savePosts(posts: Post[]) {
  localStorage.setItem("instareels_posts", JSON.stringify(posts));
}

export function getCurrentUser(): User {
  initDB();
  return JSON.parse(localStorage.getItem("instareels_current_user") || "{}");
}

export function saveCurrentUser(user: User) {
  localStorage.setItem("instareels_current_user", JSON.stringify(user));
  // Also sync with the list of users
  const users = getUsers();
  const idx = users.findIndex(u => u.id === user.id);
  if (idx !== -1) {
    users[idx] = user;
    saveUsers(users);
  }
}

export function addPost(post: Post) {
  const posts = getPosts();
  posts.unshift(post);
  savePosts(posts);
}

export function deletePost(postId: string): boolean {
  const posts = getPosts();
  const originalLength = posts.length;
  const filteredPosts = posts.filter(p => p.id !== postId);
  savePosts(filteredPosts);
  return filteredPosts.length < originalLength;
}

export function toggleLikePost(postId: string, userId: string): Post | null {
  const posts = getPosts();
  const idx = posts.findIndex(p => p.id === postId);
  if (idx === -1) return null;

  const post = posts[idx];
  const likedIndex = post.likes.indexOf(userId);

  if (likedIndex === -1) {
    post.likes.push(userId);
  } else {
    post.likes.splice(likedIndex, 1);
  }

  posts[idx] = post;
  savePosts(posts);
  return post;
}

export function addCommentToPost(postId: string, comment: Omit<SocialComment, "id" | "createdAt">): Post | null {
  const posts = getPosts();
  const idx = posts.findIndex(p => p.id === postId);
  if (idx === -1) return null;

  const post = posts[idx];
  const newComment = {
    ...comment,
    id: "comment_" + Math.random().toString(36).slice(2, 9),
    createdAt: Date.now()
  };

  post.comments.push(newComment);
  posts[idx] = post;
  savePosts(posts);
  return post;
}
