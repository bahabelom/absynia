import { getDbInstance } from '../firebase/config';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  Timestamp,
} from 'firebase/firestore';

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp?: number;
};

export type Conversation = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
};

type ConversationDocument = {
  conversations: Conversation[];
  userId: string;
  courseId: string;
  updatedAt: Timestamp | number;
};

/**
 * Get conversations for a specific user and course from Firestore
 */
export async function getConversations(
  userId: string,
  courseId: string
): Promise<Conversation[]> {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const db = getDbInstance();
    const docRef = doc(db, 'conversations', `${userId}_${courseId}`);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return [];
    }

    const data = docSnap.data() as ConversationDocument;
    return data.conversations || [];
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return [];
  }
}

/**
 * Save conversations for a specific user and course to Firestore
 */
export async function saveConversations(
  userId: string,
  courseId: string,
  conversations: Conversation[]
): Promise<void> {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const db = getDbInstance();
    const docRef = doc(db, 'conversations', `${userId}_${courseId}`);
    
    const conversationData: ConversationDocument = {
      userId,
      courseId,
      conversations,
      updatedAt: serverTimestamp(),
    };

    await setDoc(docRef, conversationData, { merge: true });
  } catch (error) {
    console.error('Error saving conversations:', error);
    throw error;
  }
}

/**
 * Delete a specific conversation
 */
export async function deleteConversation(
  userId: string,
  courseId: string,
  conversationId: string
): Promise<void> {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const conversations = await getConversations(userId, courseId);
    const updated = conversations.filter(c => c.id !== conversationId);
    await saveConversations(userId, courseId, updated);
  } catch (error) {
    console.error('Error deleting conversation:', error);
    throw error;
  }
}

/**
 * Update a specific conversation
 */
export async function updateConversation(
  userId: string,
  courseId: string,
  conversationId: string,
  updates: Partial<Conversation>
): Promise<void> {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const conversations = await getConversations(userId, courseId);
    const updated = conversations.map(c =>
      c.id === conversationId ? { ...c, ...updates, updatedAt: Date.now() } : c
    );
    await saveConversations(userId, courseId, updated);
  } catch (error) {
    console.error('Error updating conversation:', error);
    throw error;
  }
}

