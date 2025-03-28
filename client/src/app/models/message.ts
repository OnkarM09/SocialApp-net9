export interface Message {
  id: number
  senderUserId: number
  senderUsername: string
  senderPhotoUrl: string
  recipientUserId: number
  recipientUsername: string
  recipientPhotoUrl: string
  content: string
  dateRead?: Date
  messageSent: Date
}
