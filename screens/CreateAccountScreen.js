
import { use, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { signUp } from '../services/userService';

export default function CreateAccountScreen({ navigation }) {
    const[displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

  async function handleSignUp() {
    setErrorMessage('');
    setSuccessMessage('');

    if (!email.trim() || !password || !confirmPassword || !displayName) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    try {
      setIsLoading(true);

      await signUp(displayName, email, password);
      setSuccessMessage('Account successfully created, redirecting to sign in...');
      setTimeout(() => {
        navigation.replace('SignIn');
      }, 2000)

    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setErrorMessage('An account already exists for this email.');
      } else if (error.code === 'auth/invalid-email') {
        setErrorMessage('Please enter a valid email address.');
      } else if (error.code === 'auth/weak-password') {
        setErrorMessage('Please choose a stronger password.');
      } else {
        console.log('Sign-up error:', error.code, error.message);
        setErrorMessage('Unable to create your account. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
        
    <TextInput
        style={styles.input}
        placeholder="Display Name"
        value={displayName}
        onChangeText={setDisplayName}
        keyboardType="default"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      {errorMessage !== '' && (
        <Text style={styles.error}>{errorMessage}</Text>
      )}
      {successMessage !== '' && (
        <Text style={styles.success}>{successMessage}</Text>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={handleSignUp}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Text>
      </TouchableOpacity>
       <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.navigate('Landing')}
        >
        <Text style={styles.buttonText}>
        Back
        </Text>
                  </TouchableOpacity>

    
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdf9fe',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 140,
    paddingBottom: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 28,
    color: '#f68e2c',
  },
  input: {
    width: '100%',
    height: 52,
    borderWidth: 2,
    borderColor: '#fcb02b',
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 18,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
  },
  button: {
   borderWidth: 2.5,
    borderColor: '#fcb02b',
    borderRadius: 28,
    paddingVertical: 15,
    paddingHorizontal: 15,
    alignItems: 'center',
    backgroundColor: '#ec6b6b',
    marginBottom: 10
  },
  backBtn: {
  borderWidth: 2.5,
    borderColor: '#35456a',
    borderRadius: 28,
    paddingVertical: 15,
    paddingHorizontal: 15,
    alignItems: 'center',
    backgroundColor: '#6697a1',
    marginBottom: 10
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  error: {
    color: '#b42318',
    marginBottom: 12,
    textAlign: 'center',
  },
  success: {
  color: '#218838',
  marginBottom: 12,
  textAlign: 'center',
},
  link: {
    textAlign: 'center',
    marginTop: 22,
    color: '#8a5010',
  },
});
