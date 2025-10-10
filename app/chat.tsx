import { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Image, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { ChevronLeft, Send } from 'lucide-react-native';
import { subscribeToMessages, sendMessage, Message } from '@/services/messageService';

export default function ChatScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { user } = useAuth();
  const { chatId, otherUserName } = useLocalSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (!chatId || typeof chatId !== 'string') return;

    const unsubscribe = subscribeToMessages(chatId, (newMessages) => {
      setMessages(newMessages);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    return unsubscribe;
  }, [chatId]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || !user || !chatId || typeof chatId !== 'string') return;
    
    setLoading(true);
    try {
      await sendMessage(
        chatId,
        inputText.trim(),
        user.id,
        user.name,
        user.profilePic
      );
      setInputText('');
    } catch (error) {
      Alert.alert('Error', 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    if (!user) return null;
    
    const isUser = item.senderId === user.id;
    
    const formatTime = (timestamp: any) => {
      if (!timestamp) return '';
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
    
    return (
      <View style={[
        styles.messageContainer,
        isUser ? styles.userMessageContainer : styles.ambassadorMessageContainer
      ]}>
        {!isUser && (
          <Image 
            source={{ 
              uri: item.senderAvatar || 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' 
            }} 
            style={styles.avatar} 
          />
        )}
        
        <View style={[
          styles.messageBubble, 
          isUser 
            ? [styles.userBubble, { backgroundColor: colors.primary }]
            : [styles.ambassadorBubble, { backgroundColor: colors.cardBackground }]
        ]}>
          <Text style={[
            styles.messageText, 
            isUser 
              ? { color: 'white' }
              : { color: colors.text }
          ]}>
            {item.text}
          </Text>
          <Text style={[
            styles.timestamp, 
            isUser
              ? styles.userTimestamp
              : [styles.ambassadorTimestamp, { color: colors.secondaryText }]
          ]}>
            {formatTime(item.timestamp)}
          </Text>
        </View>
      </View>
    );
  };

  if (!user) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.center}>
          <Text style={[styles.errorText, { color: colors.text }]}>Please log in to chat</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.chatInfo}>
            <Text style={[styles.chatName, { color: colors.text }]}>
              {otherUserName || 'Chat'}
            </Text>
            <Text style={[styles.chatStatus, { color: colors.secondaryText }]}>Online</Text>
          </View>
        </View>
        
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesContainer}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={[styles.emptyText, { color: colors.secondaryText }]}>
                Start a conversation!
              </Text>
            </View>
          }
        />
        
        <View style={[styles.inputContainer, { backgroundColor: colors.cardBackground }]}>
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Type a message..."
            placeholderTextColor={colors.secondaryText}
            value={inputText}
            onChangeText={setInputText}
            multiline
            editable={!loading}
          />
          
          <TouchableOpacity 
            style={[
              styles.sendButton, 
              { 
                backgroundColor: loading ? colors.secondaryText : colors.primary,
                opacity: loading ? 0.6 : 1
              }
            ]}
            onPress={handleSendMessage}
            disabled={loading || !inputText.trim()}
          >
            <Send size={20} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 8,
  },
  chatInfo: {
    flex: 1,
    marginLeft: 8,
  },
  chatName: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  chatStatus: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  messagesContainer: {
    flexGrow: 1,
    padding: 16,
    paddingTop: 8,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '80%',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
  },
  ambassadorMessageContainer: {
    alignSelf: 'flex-start',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 20,
    maxWidth: '100%',
  },
  userBubble: {
    borderTopRightRadius: 4,
  },
  ambassadorBubble: {
    borderTopLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    lineHeight: 22,
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  userTimestamp: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  ambassadorTimestamp: {
    color: '#9E9E9E',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },

  input: {
    flex: 1,
    marginRight: 12,
    fontSize: 16,
    maxHeight: 100,
    minHeight: 40,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    fontFamily: 'Poppins-Regular',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});