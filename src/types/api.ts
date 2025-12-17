export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: 'USER' | 'ADMIN';
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  articleId: string;
  authorId: string;
  author: User;
  parentId?: string;
  replies?: Comment[];
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  banner?: string;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  author: User;
  categoryId: number;
  category: Category;
  comments?: Comment[];
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  userId: string;
  name: string;
  email: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

export interface CreateArticlePayload {
  title: string;
  content: string;
  categoryId: number;
  authorId: string;
  banner?: string;
  excerpt?: string;
}

export interface UpdateArticlePayload {
  title?: string;
  content?: string;
  categoryId?: number;
  banner?: string;
  excerpt?: string;
}

export interface CreateCommentPayload {
  content: string;
  articleId: string;
  authorId: string;
  parentId?: string | null;
}
