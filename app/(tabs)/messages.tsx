import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { Search, Plus } from 'lucide-react-native';
import { TextInput } from 'react-native-gesture-handler';
import { subscribeToUserChats, getAllUsers, createOrGetChat, Chat } from '@/services/messageService';

export default function MessagesScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [chats, setChats] = useState<Chat[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [showUsers, setShowUsers] = useState(false);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeToUserChats(user.id, (userChats) => {
      setChats(userChats);
    });

    return unsubscribe;
  }, [user]);

  const loadUsers = async () => {
    if (!user) return;
    try {
      const allUsers = await getAllUsers(user.id);
      setUsers(allUsers);
      setShowUsers(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to load users');
    }
  };

  const startChat = async (otherUser: any) => {
    if (!user) return;
    try {
      const chatId = await createOrGetChat(
        user.id,
        otherUser.id,
        user.name,
        otherUser.name,
        user.profilePic,
        otherUser.profilePic
      );
      setShowUsers(false);
      router.push(`/chat?chatId=${chatId}&otherUserName=${otherUser.name}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to start chat');
    }
  };

  const renderChatItem = ({ item }: { item: Chat }) => {
    if (!user) return null;
    
    const otherUserId = item.participants.find(id => id !== user.id);
    const otherUserName = otherUserId ? item.participantNames[otherUserId] : 'Unknown';
    const otherUserAvatar = otherUserId ? item.participantAvatars[otherUserId] : '';
    const unreadCount = item.unreadCount?.[user.id] || 0;
    
    const formatTime = (timestamp: any) => {
      if (!timestamp) return '';
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      
      if (days === 0) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else if (days === 1) {
        return 'Yesterday';
      } else {
        return date.toLocaleDateString();
      }
    };

    return (
      <TouchableOpacity 
        style={styles.chatItem}
        onPress={() => router.push(`/chat?chatId=${item.id}&otherUserName=${otherUserName}`)}
      >
        <Image 
          source={{ 
            uri: otherUserAvatar || 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' 
          }} 
          style={styles.avatar} 
        />
        
        <View style={styles.chatDetails}>
          <View style={styles.chatHeader}>
            <Text style={[styles.chatName, { color: colors.text }]}>{otherUserName}</Text>
            <Text style={styles.chatTime}>{formatTime(item.lastMessageTime)}</Text>
          </View>
          
          <View style={styles.messageRow}>
            <Text 
              style={[
                styles.lastMessage, 
                { color: unreadCount > 0 ? colors.text : colors.secondaryText }
              ]}
              numberOfLines={1}
            >
              {item.lastMessage || 'Start a conversation'}
            </Text>
            
            {unreadCount > 0 && (
              <View style={[styles.unreadBadge, { backgroundColor: colors.primary }]}>
                <Text style={styles.unreadCount}>{unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderUserItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.chatItem}
      onPress={() => startChat(item)}
    >
      <Image 
        source={{ 
          uri: item.profilePic || 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' 
        }} 
        style={styles.avatar} 
      />
      
      <View style={styles.chatDetails}>
        <Text style={[styles.chatName, { color: colors.text }]}>{item.name}</Text>
        <Text style={[styles.lastMessage, { color: colors.secondaryText }]}>
          {item.country || 'Tap to start chatting'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (!user) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.center}>
          <Text style={[styles.errorText, { color: colors.text }]}>Please log in to view messages</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Messages</Text>
        <TouchableOpacity 
          style={[styles.newChatButton, { backgroundColor: colors.primary }]}
          onPress={showUsers ? () => setShowUsers(false) : loadUsers}
        >
          <Plus size={20} color="white" />
        </TouchableOpacity>
      </View>
      
      <View style={[styles.searchContainer, { backgroundColor: colors.inputBackground }]}>
        <Search size={20} color={colors.secondaryText} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder={showUsers ? "Search users..." : "Search conversations..."}
          placeholderTextColor={colors.secondaryText}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={showUsers ? users : chats}
        keyExtractor={(item) => item.id}
        renderItem={showUsers ? renderUserItem : renderChatItem}
        contentContainerStyle={styles.chatList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={[styles.emptyText, { color: colors.secondaryText }]}>
              {showUsers ? 'No users found' : 'No conversations yet'}
            </Text>
          </View>
        }
      />
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
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    flex: 1,
  },
  newChatButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 24,
    marginVertical: 16,
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 24,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  chatList: {
    paddingHorizontal: 24,
  },
  chatItem: {
    flexDirection: 'row',
    marginBottom: 24,
    alignItems: 'center',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  chatDetails: {
    flex: 1,
    marginLeft: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 16,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  chatTime: {
    fontSize: 12,
    color: '#9E9E9E',
    fontFamily: 'Poppins-Regular',
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lastMessage: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  unreadBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  unreadCount: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
  },
});