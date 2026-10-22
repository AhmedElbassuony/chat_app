export interface IUser {
  _id?: string,
  fullName: string,
  email: string,
  password: string,
  profilePic: string,
  createdAt?: string,
  updatedAt?: string,
}

export interface IMessage {
  _id?: string,
  senderId: string,
  receiverId: string,
  text?: string,
  image?: string,
  createdAt?: string,
  updatedAt?: string,
}