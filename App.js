import { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAudioRecorder, AudioModule, RecordingPresets, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';

export default function App() {
  const [recordingUri, setRecordingUri] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 20 },
  button: { width: 100, height: 100, borderRadius: 50, backgroundColor: 'tomato', justifyContent: 'center', alignItems: 'center' },
  playButton: { backgroundColor: 'steelblue' },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});
