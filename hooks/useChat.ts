// hooks/useChat.ts

import { create } from 'zustand';
import { ChatMessage, Property, Conversation } from '../types';
import { getPropertyResponse } from '../services/aiService';

interface ChatState {
  conversations: Record<number, Conversation>;
  activePropertyId: number | null;
  initializeChat: (propertyId: number, property: Property) => void;
  sendMessage: (propertyId: number, property: Property, userMessage: string) => Promise<void>;
  clearChat: (propertyId: number) => void;
  setActiveProperty: (propertyId: number | null) => void;
}

export const useChat = create<ChatState>((set, get) => ({
  conversations: {},
  activePropertyId: null,

  initializeChat: (propertyId: number, property: Property) => {
    const { conversations } = get();
    
    if (!conversations[propertyId]) {
      set({
        conversations: {
          ...conversations,
          [propertyId]: {
            messages: [
              {
                role: 'assistant',
                content: `Hi! I'm your AI assistant for this property. ${property.aiSummary}\n\nFeel free to ask me anything about this listing!`,
                timestamp: new Date().toISOString()
              }
            ],
            isTyping: false
          }
        }
      });
    }

    set({ activePropertyId: propertyId });
  },

  sendMessage: async (propertyId: number, property: Property, userMessage: string) => {
    const { conversations } = get();
    const conversation = conversations[propertyId] || { messages: [], isTyping: false };

    const newUserMessage: ChatMessage = {
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    };

    set({
      conversations: {
        ...conversations,
        [propertyId]: {
          ...conversation,
          messages: [...conversation.messages, newUserMessage],
          isTyping: true
        }
      }
    });

    try {
      const aiResponse = await getPropertyResponse(
        property,
        userMessage,
        conversation.messages
      );

      const newAiMessage: ChatMessage = {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date().toISOString()
      };

      const updatedConversations = get().conversations;
      set({
        conversations: {
          ...updatedConversations,
          [propertyId]: {
            messages: [...updatedConversations[propertyId].messages, newAiMessage],
            isTyping: false
          }
        }
      });

    } catch (error) {
      console.error('Chat error:', error);
      
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString()
      };

      const updatedConversations = get().conversations;
      set({
        conversations: {
          ...updatedConversations,
          [propertyId]: {
            messages: [...updatedConversations[propertyId].messages, errorMessage],
            isTyping: false
          }
        }
      });
    }
  },

  clearChat: (propertyId: number) => {
    const { conversations } = get();
    const updated = { ...conversations };
    delete updated[propertyId];
    set({ conversations: updated });
  },

  setActiveProperty: (propertyId: number | null) => {
    set({ activePropertyId: propertyId });
  }
}));