import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput } from 'react-native';
import { useState } from 'react';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
    
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
          <View style={styles.buttonSection}>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Sign In</Text>
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
  
})