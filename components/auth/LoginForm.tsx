import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { Mail, Lock, LogIn } from 'lucide-react-native';

export default function LoginForm() {
  const router = useRouter();
  const { colors } = useTheme();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await login(email, password);
      router.replace('/(tabs)');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      {error ? (
        <View style={[styles.errorContainer, { backgroundColor: colors.error + '20' }]}>
          <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
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

      <TouchableOpacity style={styles.forgotPassword}>
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

      <View style={styles.dividerContainer}>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <Text style={[styles.dividerText, { color: colors.secondaryText }]}>
          Or login with
        </Text>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
      </View>

      <TouchableOpacity
        style={[styles.googleButton, { backgroundColor: colors.cardBackground }]}
      >
        <View style={styles.googleIconContainer}>
          {/* Replace with Google icon */}
          <Text style={styles.googleText}>G</Text>
        </View>
        <Text style={[styles.googleButtonText, { color: colors.text }]}>
          Continue with Google
        </Text>
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
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  googleButton: {
    flexDirection: 'row',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  googleIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#DB4437',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  googleText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
  },
  googleButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
});
