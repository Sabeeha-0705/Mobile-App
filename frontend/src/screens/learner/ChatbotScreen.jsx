import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext.jsx';
import { chatbotAPI } from '../../services/api.jsx';

const ChatbotScreen = () => {
  const { theme } = useTheme();
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! I\'m your AI learning assistant. How can I help you today?', isBot: true }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), text: input, isBot: false };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await chatbotAPI.ask({ question: input });
      const botMessage = {
        id: Date.now() + 1,
        text: response.data.answer || 'I\'m here to help!',
        isBot: true
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Sorry, I encountered an error. Please try again.',
        isBot: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      <ScrollView style={styles.messagesContainer} contentContainerStyle={styles.messagesContent}>
        {messages.map(msg => (
          <View
            key={msg.id}
            style={[
              styles.messageBubble,
              msg.isBot ? { backgroundColor: theme.card, alignSelf: 'flex-start' } : { backgroundColor: theme.primary, alignSelf: 'flex-end' }
            ]}
          >
            <Text style={[styles.messageText, { color: msg.isBot ? theme.text : '#FFFFFF' }]}>
              {msg.text}
            </Text>
          </View>
        ))}
        {loading && (
          <View style={[styles.messageBubble, { backgroundColor: theme.card, alignSelf: 'flex-start' }]}>
            <Text style={[styles.messageText, { color: theme.textSecondary }]}>Typing...</Text>
          </View>
        )}
      </ScrollView>

      <View style={[styles.inputContainer, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
        <TextInput
          style={[styles.input, { backgroundColor: theme.surface, color: theme.text }]}
          placeholder="Ask me anything..."
          placeholderTextColor={theme.textSecondary}
          value={input}
          onChangeText={setInput}
          multiline
        />
        <TouchableOpacity
          style={[styles.sendButton, { backgroundColor: theme.primary }]}
          onPress={handleSend}
          disabled={loading || !input.trim()}
        >
          <Ionicons name="send" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  messagesContainer: { flex: 1 },
  messagesContent: { padding: 15 },
  messageBubble: { maxWidth: '80%', padding: 12, borderRadius: 15, marginBottom: 10 },
  messageText: { fontSize: 15, lineHeight: 20 },
  inputContainer: { flexDirection: 'row', padding: 10, borderTopWidth: 1, alignItems: 'flex-end' },
  input: { flex: 1, padding: 12, borderRadius: 20, marginRight: 10, maxHeight: 100, fontSize: 15 },
  sendButton: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
});

export default ChatbotScreen;
