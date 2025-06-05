import { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { ChevronLeft, Send, Paperclip, Video as VideoIcon } from 'lucide-react-native';

// Sample chat messages
const initialMessages = [
  {
    id: '1',
    text: 'Hi there! Welcome to Campus Connect. I\'m Alex, your student ambassador. How can I help you today?',
    sender: 'ambassador',
    timestamp: new Date(Date.now() - 60000 * 10),
  },
  {
    id: '2',
    text: 'Hi Alex! I\'m new to campus and feeling a bit overwhelmed. Can you help me find my way around?',
    sender: 'user',
    timestamp: new Date(Date.now() - 60000 * 8),
  },
  {
    id: '3',
    text: 'Of course! I remember how that feels. The campus can be confusing at first. Are you looking for a specific building or service?',
    sender: 'ambassador',
    timestamp: new Date(Date.now() - 60000 * 6),
  },
];

export default function ChatScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [messages, setMessages] = useState(initialMessages);
  const [inputText, setInputText] = useState('');
  const [chatMode, setChatMode] = useState('student'); // 'student' or 'admin'
  const flatListRef = useRef(null);

  const sendMessage = () => {
    if (inputText.trim() === '') return;
    
    const newMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages([...messages, newMessage]);
    setInputText('');
    
    // Simulate response after a short delay
    setTimeout(() => {
      const responseMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Thanks for your message! I\'ll help you with that. The campus map in the app shows all buildings with their abbreviations. You can also filter by category to find what you need.',
        sender: 'ambassador',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, responseMessage]);
    }, 1000);
  };

  const renderMessage = ({ item }) => {
    const isUser = item.sender === 'user';
    
    return (
      <View style={[
        styles.messageContainer,
        isUser ? styles.userMessageContainer : styles.ambassadorMessageContainer
      ]}>
        {!isUser && (
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/5212361/pexels-photo-5212361.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }} 
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
            {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.chatInfo}>
          <Text style={[styles.chatName, { color: colors.text }]}>
            {chatMode === 'student' ? 'Student Ambassador' : 'Admin Helpdesk'}
          </Text>
          <Text style={[styles.chatStatus, { color: colors.secondaryText }]}>Online</Text>
        </View>
        <TouchableOpacity 
          style={[styles.videoCallButton, { backgroundColor: colors.primary }]}
        >
          <VideoIcon size={16} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.switchContainer}>
        <TouchableOpacity
          style={[
            styles.switchOption,
            chatMode === 'student' && [styles.activeSwitchOption, { backgroundColor: colors.primary }],
          ]}
          onPress={() => setChatMode('student')}
        >
          <Text
            style={[
              styles.switchText,
              chatMode === 'student' ? styles.activeSwitchText : { color: colors.secondaryText },
            ]}
          >
            Chat with Student
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.switchOption,
            chatMode === 'admin' && [styles.activeSwitchOption, { backgroundColor: colors.primary }],
          ]}
          onPress={() => setChatMode('admin')}
        >
          <Text
            style={[
              styles.switchText,
              chatMode === 'admin' ? styles.activeSwitchText : { color: colors.secondaryText },
            ]}
          >
            Talk to Admin
          </Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesContainer}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />
      
      <View style={[styles.inputContainer, { backgroundColor: colors.cardBackground }]}>
        <TouchableOpacity style={styles.attachButton}>
          <Paperclip size={20} color={colors.secondaryText} />
        </TouchableOpacity>
        
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder="Type a message..."
          placeholderTextColor={colors.secondaryText}
          value={inputText}
          onChangeText={setInputText}
          multiline
        />
        
        <TouchableOpacity 
          style={[styles.sendButton, { backgroundColor: colors.primary }]}
          onPress={sendMessage}
        >
          <Send size={20} color="white" />
        </TouchableOpacity>
      </View>
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
  videoCallButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchContainer: {
    flexDirection: 'row',
    padding: 8,
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 24,
  },
  switchOption: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 20,
  },
  activeSwitchOption: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  switchText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  activeSwitchText: {
    color: 'white',
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
    alignItems: 'center',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  attachButton: {
    padding: 8,
  },
  input: {
    flex: 1,
    marginHorizontal: 8,
    fontSize: 16,
    maxHeight: 100,
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