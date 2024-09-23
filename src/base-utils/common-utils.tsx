export interface IUser {
  email: string;
  name: string;
  photoUrl: string;
  timestamp: string;
}

export interface IPost {
  id: string;
  userId: string;
  title: string;
  username: string;
  description: string;
  imageUrl: string;
  photoUrl: string;
  time: string;
}
export interface ILikes {
  postId: string;
  userId: string;
  username: string;
}

export interface IComment {
  postId: string;
  username: string;
  commentDesc: string;
  userId: string;
  id: string;
  photoUrl: string;
}
