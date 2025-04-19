
export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface File {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  shareUrl: string;
  uploadedAt: Date;
  userId: string;
}
