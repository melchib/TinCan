import { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAudioRecorder, AudioModule, RecordingPresets, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { collection, doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from './firebaseConfig';
import { auth } from "./firebaseConfig";
import { signInAnonymously } from 'firebase/auth';

export default function App() {
  const [recordingUri, setRecordingUri] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);

  //HARDCODED GROUP AND SENDER VALUES
  const groupID = "group0001";

  const recorder = useAudioRecorder({
  ...RecordingPresets.HIGH_QUALITY,
  directory: 'document',
  });

  const player = useAudioPlayer(null);
  const status = useAudioPlayerStatus(player);
  
  async function startRecording() {
    await AudioModule.requestRecordingPermissionsAsync();
    await AudioModule.setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
    
    await recorder.prepareToRecordAsync();
    recorder.record();
    setIsRecording(true);
  }

  async function stopRecording() {
    await recorder.stop();

    const recordingStatus = recorder.getStatus();
    const duration = Math.round(recordingStatus.durationMillis / 1000);
    setDuration(duration);

    const src = recorder.uri;
    if (!src) {
      console.log('No recording URI available');
      return; //t
    };
  
    setRecordingUri(src);
    player.replace({ uri: src });
    setIsRecording(false);

    
  }

  async function  playRecording() {
    if(!recordingUri) {
      console.log('No recording to play');
      return;
    }
    await AudioModule.setAudioModeAsync({ 
      allowsRecording: false, 
      playsInSilentMode: true 
    });

    player.replace({ uri: recordingUri });

    player.play();    
  }

async function createUser() {
  if (!auth.currentUser) {
    await signInAnonymously(auth);
  }

  const user = auth.currentUser;

  if (!user) {
    throw new Error("User authentication failed");
  }

  const userRef = doc(db, "users", user.uid);
  const userSnapshot = await getDoc(userRef);

  if (!userSnapshot.exists()) {
    await setDoc(userRef, {
      createdAt: new Date(),
      displayName: "Test User",
    });
  }

  return user.uid;
}




  async function writeMessage(recordingUri, groupID, duration) {
    
    const senderID = await createUser();

    const time = new Date();
    const timeSent = time.toLocaleTimeString();

    const dateSent = time.toLocaleDateString();
    
    const messageRef = doc(collection(db, "messages")) ;
    const messageID = messageRef.id;
    
    const storagePath = `voice-messages/${groupID}/${messageID}.m4a`;
    const audioRef = ref(storage, storagePath);

    const response = await fetch(recordingUri);
    const blob = await response.blob();
    
    await uploadBytes(audioRef, blob, {
      contentType: "audio/mp4",
    });
    
    const audioURL = await getDownloadURL(audioRef);

    console.log("audio uploaded, about to write to firestore...");
    console.log("Document path:", messageRef.path);

    try{
    await setDoc(messageRef, {
      audioURL: audioURL,
      duration: duration,
      groupID: groupID,
      senderID: senderID,
      timeSent: timeSent,
      dateSent: dateSent
    });

    console.log("firestore write successful");
  } catch(error) {
    console.error("Firestore error:", error.code, error.message);
  }
}
  

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={isRecording ? stopRecording : startRecording}>
        <Text style={styles.buttonText}>{isRecording ? 'Stop' : 'Record'}</Text>
      </TouchableOpacity>
      {recordingUri && (
        <TouchableOpacity style={[styles.button, styles.playButton]} onPress={playRecording}>
          <Text style={styles.buttonText}>Play</Text>
        </TouchableOpacity>
      )}
        {recordingUri && (
        <TouchableOpacity style={[styles.button, styles.playButton]} 
        onPress={() => writeMessage(recordingUri, groupID, duration)}>
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
  

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 20 },
  button: { width: 100, height: 100, borderRadius: 50, backgroundColor: 'tomato', justifyContent: 'center', alignItems: 'center' },
  playButton: { backgroundColor: 'steelblue' },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
})
