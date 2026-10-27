import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput } from 'react-native';
import { useState } from 'react';
import { signIn } from '../services/userService';

export default function SignInScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  async function handleSignIn() {
    setErrorMessage('');

    if (!email.trim() || !password) {
      setErrorMessage('Please enter your email and password');
      return;
    }

    try {
    setIsLoading(true);

    await signIn(email, password);

    setTimeout(() => {
      navigation.replace('Inbox');
    }, 2000);

  } catch (error) {
    console.log('Sign in error:', error.code);
    setErrorMessage('Incorrect email or password');
    setIsLoading(false);
  }
  }
    
    return(
    
      <View style={styles.background}>
        <View style={styles.logoSection}>
            <Image 
              source={require('../icons/tincanlogo.png')}
              style={{ left: 15, top:-40, width: 250, height: 250 }}
              resizeMode="contain"
              />
          </View>

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize='none'
            />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            />
            
            {errorMessage !== '' && (
              <Text style={styles.errorText}>
                {errorMessage}
              </Text>
            )}
                    
          <View style={styles.buttonSection}>
            <TouchableOpacity 
            style={styles.button}
            onPress={handleSignIn}
            disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'Signing in..' : 'Sign In'}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('Landing')}
            >
              <Text style = {styles.buttonText}>Back</Text>
            </TouchableOpacity>
            </View>
      </View>
    
    )
}

const styles = StyleSheet.create({
    background: {
    flex: 1,
    backgroundColor: '#fdf9fe',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 140,
    paddingBottom: 50,
  },
  logoSection: {
    top: -50,
    alignItems: 'center',
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
    buttonSection: {
    width: '100%',
    gap: 18,
    bottom: -5
  },

  button: {
    borderWidth: 2.5,
    borderColor: '#fcb02b',
    borderRadius: 28,
    paddingVertical: 15,
    alignItems: 'center',
    backgroundColor: '#ec6b6b',
  },
    buttonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#f7f2ee',
  },
  errorText: {
  color: '#c0392b',
  marginBottom: 12,
  textAlign: 'center',
},
  
})