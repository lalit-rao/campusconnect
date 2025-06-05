import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { User, Mail, Lock, Flag } from 'lucide-react-native';

export default function SignupForm() {
  const router = useRouter();
  const { colors } = useTheme();
  const { signup } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [country, setCountry] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async () => {
    if (!fullName || !email || !password || !confirmPassword || !country) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await signup(email, password, { fullName, country });
      router.replace('/(tabs)');
    } catch (err) {
      setError('Sign up failed. Please try again.');
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
        <View style={[styles.inputContainer, { backgroundColor: '#F5F5F5' }]}>
          <User size={20} color={colors.secondaryText} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: colors.Entertext }]}
            placeholder="Full Name"
            placeholderTextColor={colors.secondaryText}
            value={fullName}
            onChangeText={setFullName}
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <View style={[styles.inputContainer, { backgroundColor: '#F5F5F5' }]}>
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
        <View style={[styles.inputContainer, { backgroundColor: '#F5F5F5' }]}>
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

      <View style={styles.inputGroup}>
        <View style={[styles.inputContainer, { backgroundColor: '#F5F5F5' }]}>
          <Lock size={20} color={colors.secondaryText} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: colors.Entertext }]}
            placeholder="Confirm Password"
            placeholderTextColor={colors.secondaryText}
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <View style={[styles.inputContainer, { backgroundColor: '#F5F5F5' }]}>
          <Flag size={20} color={colors.secondaryText} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: colors.Entertext }]}
            placeholder="Country of Origin"
            placeholderTextColor={colors.secondaryText}
            value={country}
            onChangeText={setCountry}
          />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.signupButton, { backgroundColor: colors.primary }]}
        onPress={handleSignup}
      >
        <Text style={styles.signupButtonText}>Sign Up</Text>
      </TouchableOpacity>

      <View style={styles.termsContainer}>
        <Text style={[styles.termsText, { color: colors.secondaryText }]}>
          By signing up, you agree to our
          <Text style={{ color: colors.primary }}> Terms of Service</Text> and
          <Text style={{ color: colors.primary }}> Privacy Policy</Text>
        </Text>
      </View>
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
  signupButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  signupButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  termsContainer: {
    marginBottom: 24,
  },
  termsText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    lineHeight: 18,
  },
});
