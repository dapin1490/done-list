export interface UserPublic {
  id: number;
  email: string;
}

export interface Done {
  id: number;
  text: string;
  tags: string[];
  created_at: string; // API 응답은 보통 ISO 문자열로 오므로 string으로 받음
  owner_id: number;
  owner: UserPublic;
  likes_count: number;
  is_liked: boolean;
  is_public: boolean; // 공개 여부
}

export interface User {
  id: number;
  email: string;
  username?: string;
  is_active: boolean;
  role: 'user' | 'admin';
  created_at: string;
} 