import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { Mail, Lock, LogIn } from 'lucide-react-native';

export default function LoginForm() {
  const router = useRouter();
  const { colors } = useTheme();
  const { login, resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [resetMessage, setResetMessage] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setError('');
      await login(email, password);
      router.replace('/(tabs)');
    } catch (err: any) {
      const errorCode = err.code;
      let errorMessage = 'Something went wrong. Please try again.';
      
      switch (errorCode) {
        case 'auth/user-not-found':
        case 'auth/invalid-email':
          errorMessage = 'No account found with this email address.';
          break;
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          errorMessage = 'Incorrect password. Please try again.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your connection.';
          break;
        default:
          errorMessage = 'Invalid email or password. Please try again.';
      }
      
      setError(errorMessage);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address first');
      return;
    }

    try {
      setError('');
      setResetMessage('');
      await resetPassword(email);
      setResetMessage('Password reset email sent! Check your inbox.');
    } catch (err: any) {
      const errorCode = err.code;
      let errorMessage = 'Failed to send reset email';
      
      switch (errorCode) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email address.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address.';
          break;
        default:
          errorMessage = 'Failed to send reset email. Please try again.';
      }
      
      setError(errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      {error ? (
        <View style={[styles.errorContainer, { backgroundColor: colors.error + '20' }]}>
          <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
        </View>
      ) : null}

      {resetMessage ? (
        <View style={[styles.successContainer, { backgroundColor: colors.primary + '20' }]}>
          <Text style={[styles.successText, { color: colors.primary }]}>{resetMessage}</Text>
        </View>
      ) : null}

      <View style={styles.inputGroup}>
        <View style={[styles.inputContainer, { backgroundColor: colors.inputBackground }]}>
          <Mail size={20} color={colors.secondaryText} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: colors.Entertext }]}
            placeholder="Email"
            placeholderTextColor={colors.secondaryText}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <View style={[styles.inputContainer, { backgroundColor: colors.inputBackground }]}>
          <Lock size={20} color={colors.secondaryText} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: colors.Entertext }]}
            placeholder="Password"
            placeholderTextColor={colors.secondaryText}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.forgotPassword} onPress={handleForgotPassword}>
        <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>
          Forgot Password?
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.loginButton, { backgroundColor: colors.primary }]}
        onPress={handleLogin}
      >
        <LogIn size={20} color="white" style={styles.buttonIcon} />
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  errorContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
  },
  successContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  successText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 56,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  loginButton: {
    flexDirection: 'row',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonIcon: {
    marginRight: 8,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },

});
