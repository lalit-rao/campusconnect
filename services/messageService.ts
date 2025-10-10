import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  where, 
  getDocs,
  doc,
  updateDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/config/firebase';

export interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  chatId: string;
  timestamp: Timestamp;
  read: boolean;
}

export interface Chat {
  id: string;
  participants: string[];
  participantNames: { [key: string]: string };
  participantAvatars: { [key: string]: string };
  lastMessage: string;
  lastMessageTime: Timestamp;
  lastMessageSender: string;
  unreadCount: { [key: string]: number };
}

export const sendMessage = async (
  chatId: string,
  text: string,
  senderId: string,
  senderName: string,
  senderAvatar?: string
) => {
  try {
    await addDoc(collection(db, 'messages'), {
      text,
      senderId,
      senderName,
      senderAvatar,
      chatId,
      timestamp: serverTimestamp(),
      read: false
    });

    // Update chat's last message
    const chatRef = doc(db, 'chats', chatId);
    await updateDoc(chatRef, {
      lastMessage: text,
      lastMessageTime: serverTimestamp(),
      lastMessageSender: senderId
    });
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const subscribeToMessages = (
  chatId: string,
  callback: (messages: Message[]) => void
) => {
  const q = query(
    collection(db, 'messages'),
    where('chatId', '==', chatId),
    orderBy('timestamp', 'asc')
  );

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Message[];
    callback(messages);
  });
};

export const subscribeToUserChats = (
  userId: string,
  callback: (chats: Chat[]) => void
) => {
  const q = query(
    collection(db, 'chats'),
    where('participants', 'array-contains', userId),
    orderBy('lastMessageTime', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const chats = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Chat[];
    callback(chats);
  });
};

export const createOrGetChat = async (
  currentUserId: string,
  otherUserId: string,
  currentUserName: string,
  otherUserName: string,
  currentUserAvatar?: string,
  otherUserAvatar?: string
) => {
  try {
    // Check if chat already exists
    const q = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', currentUserId)
    );
    
    const querySnapshot = await getDocs(q);
    const existingChat = querySnapshot.docs.find(doc => {
      const data = doc.data();
      return data.participants.includes(otherUserId);
    });

    if (existingChat) {
      return existingChat.id;
    }

    // Create new chat
    const now = new Date();
    const chatData = {
      participants: [currentUserId, otherUserId],
      participantNames: {
        [currentUserId]: currentUserName,
        [otherUserId]: otherUserName
      },
      participantAvatars: {
        [currentUserId]: currentUserAvatar || '',
        [otherUserId]: otherUserAvatar || ''
      },
      lastMessage: 'Chat started',
      lastMessageTime: now,
      lastMessageSender: currentUserId,
      unreadCount: {
        [currentUserId]: 0,
        [otherUserId]: 0
      }
    };

    const docRef = await addDoc(collection(db, 'chats'), chatData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating/getting chat:', error);
    throw error;
  }
};

export const getAllUsers = async (currentUserId: string) => {
  try {
    const q = query(collection(db, 'users'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(user => user.id !== currentUserId);
  } catch (error) {
    console.error('Error getting users:', error);
    throw error;
  }
};