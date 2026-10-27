
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Image, ImageBackground } from 'react-native';

export default function LandingScreen({ navigation }) {
  return (
    <View style={styles.container}>
        
      {/* Logo area */}
      <View style={styles.logoSection}>
        <Image 
            source={require('../icons/tincanlogo.png')}
             style={{ left: 15, top:-40, width: 350, height: 350 }}
            resizeMode="contain"
        />
      </View>

      {/* Buttons */}
      <View style={styles.buttonSection}>
        <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('SignIn')}
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('CreateAccount')}
        >
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>
        </View>
        </View>
      

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdf9fe',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    paddingTop: 140,
    paddingBottom: 50,
  },

  logoSection: {
    alignItems: 'center',
  },

  logo: {
    
  },

  tagline: {
    fontSize: 14,
    color: '#77715F',
    marginTop: 12,
  },

  buttonSection: {
    width: '100%',
    gap: 18,
    bottom: 270
  },

  button: {
    borderWidth: 2.5,
    borderColor: '#fcb02b',
    borderRadius: 28,
    paddingVertical: 15,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },

  buttonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#f68e2c',
  },
  spotlight: {
    color: 'white',
    
  }
});
