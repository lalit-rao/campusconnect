import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { auth, db } from '@/config/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

type User = {
  id: string;
  name: string;
  email: string;
  profilePic?: string;
  country?: string;
  languages?: string[];
  interests?: string[];
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, userData: any) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          const userData = userDoc.data();
          
          const user = {
            id: firebaseUser.uid,
            name: userData?.name || firebaseUser.displayName || 'User',
            email: firebaseUser.email!,
            profilePic: userData?.profilePic || firebaseUser.photoURL,
            country: userData?.country,
            languages: userData?.languages || ['English'],
            interests: userData?.interests || [],
          };
          
          setUser(user);
          await AsyncStorage.setItem('user', JSON.stringify(user));
        } catch (error) {
          console.error('Error loading user data:', error);
        }
      } else {
        setUser(null);
        await AsyncStorage.removeItem('user');
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      const userData = userDoc.data();
      
      const user = {
        id: firebaseUser.uid,
        name: userData?.name || firebaseUser.displayName || 'User',
        email: firebaseUser.email!,
        profilePic: userData?.profilePic || firebaseUser.photoURL,
        country: userData?.country,
        languages: userData?.languages || ['English'],
        interests: userData?.interests || [],
      };
      
      setUser(user);
      await AsyncStorage.setItem('user', JSON.stringify(user));
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, userData: any) => {
    setIsLoading(true);
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Create user document in Firestore
      const newUser = {
        id: firebaseUser.uid,
        name: userData.fullName,
        email: firebaseUser.email!,
        profilePic: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        country: userData.country,
        languages: ['English'],
        interests: ['Music', 'Sports', 'Technology'],
        createdAt: new Date().toISOString(),
      };
      
      await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
      
      setUser(newUser);
      await AsyncStorage.setItem('user', JSON.stringify(newUser));
    } catch (error: any) {
      throw new Error(error.message || 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem('user');
      setUser(null);
      router.replace('/auth');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to send reset email');
    }
  };

  const updateUserProfile = async (data: Partial<User>) => {
    if (!user) return;
    
    try {
      const updatedUser = { ...user, ...data };
      
      // Update in Firestore
      await setDoc(doc(db, 'users', user.id), updatedUser, { merge: true });
      
      setUser(updatedUser);
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw new Error('Failed to update profile');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        resetPassword,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};