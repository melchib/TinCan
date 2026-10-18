import { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, FlatList } from 'react-native';
import { useAudioRecorder, AudioModule, RecordingPresets, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { collection, doc, setDoc, getDoc, getDocs, query, where, orderBy, serverTimestamp } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from './firebaseConfig';
import { auth } from "./firebaseConfig";
import { signInAnonymously } from 'firebase/auth';




export default function App() {
  const [recordingUri, setRecordingUri] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [playingMessageID, setPlayingMessageID] = useState(false);
  const [duration, setDuration] = useState(0);
  const [messages, setMessages] = useState([]);

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
    const duration = Math.round(recorder.currentTime);
    
    await recorder.stop();
    console.log("Recording duration:", duration);
    setDuration(duration);
    
    const recordingStatus = recorder.getStatus();

    const src = recorder.uri;
    if (!src) {
      console.log('No recording URI available');
      return; //t
    };
  
    setRecordingUri(src);
    player.replace({ uri: src });
    setIsRecording(false);

    
  }

  async function  playRecording(recordingUri, messageID) {
    setPlayingMessageID(messageID);
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
    setPlayingMessageID(null)
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
      dateSent: dateSent,
      createdAt: serverTimestamp()
    });

    console.log("firestore write successful");
    await loadMessages();
  } catch(error) {
    console.error("Firestore error:", error.code, error.message);
  }
}

async function loadMessages() {
  try {
    await createUser();

    const messageQuery = query(
    collection(db, 'messages'),
    where('groupID', '==', groupID),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(messageQuery);

  const messageList = snapshot.docs.map((document) => ({
    id: document.id,
    ...document.data()
  }));

  setMessages(messageList);
} catch (error) {
  console.error('Error loading messages:', error.code, error.message)
}
}

  useEffect(() => {
    loadMessages();
  }, []);

  // useEffect(() => {
  //   if (status.didJustFinish) {
  //     setIsPlaying(false);
  //   }
  // }, [status.didJustFinish]);

  return (
  <View style={styles.container}>
    <View style={styles.recordingSection}>
    
    {/* Recording button */}
    <TouchableOpacity
      style={styles.roundButton}
      onPress={isRecording ? stopRecording : startRecording}
    >
      <Text style={styles.buttonText}>
        {isRecording ? 'Stop' : 'Record'}
      </Text>
    </TouchableOpacity>

    {/* Play and Send buttons */}
    {recordingUri && (
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.bottomButtons]}
          onPress={() => playRecording(recordingUri)}
        >
          <Text style={styles.buttonText}>Play</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.bottomButtons]}
          onPress={() => writeMessage(recordingUri, groupID, duration)}
        >
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
      </View>
    )}
    </View>
    
    {/* Saved memos list */}
    <View style={styles.playbackArea}>
      <Text style={styles.headerText}>Memos</Text>

      <FlatList
        style={styles.flatList}
        data={messages}
        keyExtractor={(item) => item.id}
        extraData={playingMessageID}
        renderItem={({ item }) => (
          <View style = {styles.messagesBubble}>
            <View style={styles.playButtonBg}>
              <TouchableOpacity 
                style={playingMessageID === item.id 
                  ? styles.pauseIcon 
                  : styles.playIcon}
                onPress={() => playRecording(item.audioURL, item.messageID)}
                >
                
              </TouchableOpacity>

            </View>
            <Text> {item.dateSent} {item.timeSent} {item.duration}s</Text>
          </View>
        )}
        />
    </View>
  </View>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'pink',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  recordingSection: {
    backgroundColor: 'white',
    paddingHorizontal: 50,
    paddingVertical: 30,
    borderRadius: 40,
    alignItems: 'center',
    gap: 20,
    transform: [{ translateY: -150 }],
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  roundButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'tomato',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomButtons: {
    width: 100,
    height: 60,
    borderRadius: 12,
    backgroundColor: 'steelblue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  playbackArea:{
    position: 'absolute',
    top: 430,
    left: 20,
    right: 20,
    bottom: 0
  },
  headerText: {
    fontFamily: 'Arial',
    fontSize: 30,
  },
  messagesBubble: {
    backgroundColor: 'gray',
    color: 'white',
    padding: 15,
    width: 325,
    borderRadius: 10,
    margin: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 10,
  },
  playButtonBg: {
    backgroundColor: 'white',
    width: 45,
    height: 45,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
playIcon: {
    width: 0,
    height: 0,
    borderTopWidth: 10,
    borderBottomWidth: 10,
    borderLeftWidth: 16,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'black',
    borderRightWidth: 0,
    marginLeft: 3,
  },
  
  pauseIcon: {
    height: 20,
    width: 20,
    borderRadius: 3,
    backgroundColor: 'black'
  },
  flatList: {
    flex: 1 
  },
});
