export interface Done {
  id: number;
  text: string;
  tags: string[];
  createdAt: string; // API 응답은 보통 ISO 문자열로 오므로 string으로 받음
}

export interface User {
  id: number;
  email: string;
  username?: string;
  is_active: boolean;
  role: 'user' | 'admin';
  created_at: string;
} 