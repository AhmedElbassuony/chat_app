export interface IUser {
  fullName: string,
  email: string,
  password: string,
  profilePic: string,
  createdAt?: string,
  updatedAt?: string,
}

export interface IMessage {
  senderId: string,
  receiverId: string,
  text?: string,
  image?: string,
  createdAt?: string,
  updatedAt?: string,
}