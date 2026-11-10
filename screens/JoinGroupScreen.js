import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'react-native';
import { useState } from 'react';
import { joinGroup } from '../services/groupService';
import { Alert } from 'react-native';

export default function JoinGroupScreen({ navigation }) {
    const [joinCode, setJoinCode] = useState("");

    async function handleJoinGroup(inviteCode) {
        try {
            const result = await joinGroup(inviteCode);

            if (result === "success") {
                Alert.alert("Success!")
                navigation.navigate('HomeScreen');
            } else if (result === "invalidCode"){;
                Alert.alert("Invalid invite code", "Double check if you have the correct code.")
            } else if (result === "alreadyMember"){
                Alert.alert("You are already a member of this group!")
            }
        } catch (error) {
            console.error("Error joining group:", error)
        }
    }
 return (
    <View style={styles.container}>
        <LinearGradient
            colors={['#a2c8f6', '#396cd1']}
            style={styles.background}
        />
        <View style={styles.logoSection}>
            <Image 
                source={require('../icons/tincanlogo.png')}
                style={{ left: 15, top:-50, width: 250, height: 350 }}
                resizeMode="contain"
            />
        </View>
        <View style={styles.joinGroupSpotlight}>
        <Text style={styles.title}>Enter invite code</Text>
        <Text style={styles.subtitle}>If you don't have a code, ask group author for a code or create a new group</Text>
              <TextInput
                style={styles.input}
                placeholder="Group Code"
                value={joinCode}
                onChangeText={setJoinCode}
                keyboardType='default'
                autoCapitalize='characters'
              />

            <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.button}
                onPress={() => handleJoinGroup(joinCode)}>
                <Text style={styles.buttonText}>Join</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
                style={styles.button}
                onPress={() => navigation.navigate('HomeScreen')}
            >
                <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
            </View>
        </View>
    </View>
    
)}
const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: '#fdf9fe',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
   background: {
    position: 'absolute',
    left: -100,
    right: -100,
    top: -50,
    height:950
  },
  joinGroupSpotlight: {
    position: 'relative',
    backgroundColor: '#bac7f6',
    top:-130,
    height:250,
    width:350,
    borderRadius: 35,
    alignContent: 'center',
    alignItems: 'center'
  },
    title: {
    fontFamily: 'Inter',
    fontWeight: 'bold',
    fontSize: 40,
    color: '#0a0e55',
    top: 20,
    width: '90%',
    textAlign: 'center',

  },
    input: {
    width: '90%',
    height: 52,
    borderWidth: 2,
    borderRadius: 16,
    top: 40,
    paddingHorizontal: 16,
    marginBottom: 55,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    borderColor: '#252ba5'
  },
  subtitle: {
    fontFamily: 'Inter',
    width: '80%',
    top: 25,
    color: '#252ba5',
    textAlign:'center'
  },
   button: {
    borderRadius: 28,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: '#467bed',
    top: 0,
    marginTop: 6
  },
buttonRow: {
  flexDirection:'row',
  gap:10
},
buttonText: {
    color: 'white'
}
  });