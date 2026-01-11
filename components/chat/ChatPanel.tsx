// components/chat/ChatPanel.tsx - COMPLETE REPLACEMENT

import React, { useEffect, useRef } from 'react';
import { View, ScrollView, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { Property } from '../../types';
import { useChat } from '../../hooks/useChat';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { COLORS, SPACING, FONT_SIZES } from '../../utils/constants';

interface ChatPanelProps {
  property: Property;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ property }) => {
  const { conversations, initializeChat, sendMessage } = useChat();
  const conversation = conversations[property.id] || { messages: [], isTyping: false };
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    initializeChat(property.id, property);
  }, [property.id]);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [conversation.messages]);

  const handleSendMessage = async (message: string) => {
    await sendMessage(property.id, property, message);
  };

  return (
    <View style={styles.container}>
      {/* Messages - NO HEADER HERE */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
      >
        {conversation.messages.map((msg, idx) => (
          <ChatMessage key={idx} message={msg} />
        ))}
        
        {/* Typing Indicator */}
        {conversation.isTyping && (
          <View style={styles.typingContainer}>
            <ActivityIndicator size="small" color={COLORS.primary} />
            <Text style={styles.typingText}>AI is typing...</Text>
          </View>
        )}
      </ScrollView>

      {/* Input */}
      <ChatInput onSend={handleSendMessage} disabled={conversation.isTyping} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: SPACING.md,
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  typingText: {
    marginLeft: SPACING.sm,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
});