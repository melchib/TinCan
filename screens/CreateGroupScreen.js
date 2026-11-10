import { StyleSheet, Text, View, TouchableOpacity, SafeAreaViewBase, Pressable, TextInput } from 'react-native';
import { Image, ImageBackground } from 'react-native';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Alert } from 'react-native';
import { getAuth, onAuthStateChanged, setPersistence } from 'firebase/auth';
import { generateInviteCode, writeNewGroup } from '../services/groupService';
import * as Clipboard from 'expo-clipboard';

export default function CreateGroupScreen( {navigation} ) {
    const [groupName, setGroupName] = useState("");
    const [isPresented, setIsPresented] = useState(false);
    const [inviteCode, setInviteCode] = useState("");
    
    const isInputEmpty = groupName.trim().length === 0;
    const auth = getAuth();
    const userID = auth.currentUser?.uid;
    const copyToClipboard = async () => {
      await Clipboard.setStringAsync(inviteCode);
      Alert.alert("Copied!", "Invite code copied to clipboard");
    }


    async function handleGroupCreate() {
      try{
        const code = generateInviteCode();
        const groupID = await writeNewGroup(userID, groupName, code )
        if (!groupID) {
          Alert.alert("Error", "Unable to create group");
          return;
        }

        setInviteCode(code);
        setIsPresented(true);
      } catch (error) {
        console.log("Error creating group", error);
      }
    }

    function confirmCreation() {
      Alert.alert(
        `Confirm creation of group: "${groupName.trim()}"`, 
        "Note: this action will add a new group to your group home screen",
        [
          {
            text: "Create",
            onPress: handleGroupCreate
          },
          {
            text:"Cancel",
            style: "cancel"
          }
        ]
      );
    }

    return(
      <View style={styles.container}>
        <LinearGradient
          colors={['#f6e1a2', '#d15a39']}
            style={styles.background}
        />
        <View style={styles.logoSection}>
           <Image 
              source={require('../icons/tincanlogo.png')}
              style={{ left: 15, top:-50, width: 250, height: 350 }}
              resizeMode="contain"
          />
        </View>
          <View style={[styles.createGroupSpotlight, isPresented && {opacity: 0.5}]}>
             <Text style={styles.title}>Create a Group</Text>
              
              <TextInput
                style={styles.input}
                placeholder="Group Name"
                value={groupName}
                onChangeText={setGroupName}
                keyboardType="default"
                autoCapitalize='none'
                editable={!isPresented}
              />
            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={[styles.button, isInputEmpty && styles.disabledButton]}
                onPress={confirmCreation}
                disabled={isInputEmpty || isPresented}
              >
                <Text style={[{color: 'white'}, isInputEmpty && {color:'#696666'}]}>Create Group</Text>
              </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('HomeScreen')}>
                    <Text>Back</Text>
                  </TouchableOpacity>
            </View>
          </View>

              {isPresented && (
                <View style={styles.inviteCodeContainer}>
                  <Text style={styles.inviteCodeLabel}>
                    Your Invite Code:
                  </Text>
                  <Text style={styles.inviteCodeText}>
                    {inviteCode}
                  </Text>
                  <Text style={styles.subtitle}>Send this code to your friends and have them enter the code to join your group</Text>
                  <View style={styles.buttonRow}>
                  <TouchableOpacity style={styles.button} onPress={copyToClipboard}>
                    <Text>Copy code</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('HomeScreen')}>
                    <Text>Back</Text>
                  </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>


)}

const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: '#fdf9fe',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  disabledOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'red',
    borderRadius: 35,
    zIndex: 999,
  }, 
  title: {
    fontFamily: 'Inter',
    fontWeight: 'bold',
    fontSize: 40,
    color: '#c31919',
    top: 20,

  },
  backButton: {
    fontFamily: 'Inter',
  },
    background: {
    position: 'absolute',
    left: -100,
    right: -100,
    top: -50,
    height:950
  },
  createGroupSpotlight: {
    position: 'relative',
    backgroundColor: '#fbb689',
    top:-130,
    height:250,
    width:350,
    borderRadius: 35,
    alignContent: 'center',
    alignItems: 'center'
  },
  input: {
    width: '90%',
    height: 52,
    borderWidth: 2,
    borderColor: '#fcb02b',
    borderRadius: 16,
    top: 40,
    paddingHorizontal: 16,
    marginBottom: 55,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
  },
    button: {
    borderRadius: 28,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: '#ec6b6b',
    top: 0,
    marginTop: 6
  },
  disabledButton: {
    backgroundColor: '#e0e0e0'
  },
  inviteCodeContainer: {
    marginTop: -90,
    alignItems: 'center',
    backgroundColor: '#fbb689',
    padding: 30,
    borderRadius: 35,
    width: '90%',
},
inviteCodeLabel: {
    marginTop: -0,
    fontSize: 30,
    fontWeight: 'bold',
    color: '#743f43',
    marginBottom: 6
},
inviteCodeText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#c31919',
    marginBottom: 6
},
subtitle: {
  fontFamily: 'Inter',
  fontSize: 15,
  textAlign: 'center',
},
buttonRow: {
  flexDirection:'row',
  gap:10
}
});