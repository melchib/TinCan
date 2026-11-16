import { useAudioRecorder, AudioModule, RecordingPresets, useAudioPlayer, useAudioRecorderState } from 'expo-audio';
import { useState } from 'react';

export default function useRecording() {
    const [recordingUri, setRecordingUri] = useState(null);
    const [recordingState, setRecordingState] = useState('idle');
    const [duration, setDuration] = useState(0);

    const recorder = useAudioRecorder({
  ...RecordingPresets.HIGH_QUALITY,
  directory: 'document',
  });

  const recorderStatus = useAudioRecorderState(recorder, 100);

  async function startRecording() {
    try{ 
        const permission = await AudioModule.requestRecordingPermissionsAsync();

        if (!permission.granted) {
            console.log('Microphone permission denied');
            return;
        }

        await AudioModule.setAudioModeAsync({ 
            allowsRecording: true, 
            playsInSilentMode: true 
        });

        setRecordingUri(null);
        setDuration(0); // << here
        
        await recorder.prepareToRecordAsync();
        recorder.record();

        setRecordingState('recording');

    } catch (error) {
        console.error('Error starting recording:', error);
    }
  }

  async function pauseRecording() {
        try {
            await recorder.pause();
            setRecordingState('paused');
        } catch (error) {
            console.error('Error pausing recording:', error);
        }
    }

    async function resumeRecording() {
        try {
            recorder.record();
            setRecordingState('recording');
        } catch (error) {
            console.error('Error resuming recording:', error);
        }
    }

    async function stopRecording() {
        try{
            const finalDuration = Math.round(recorder.currentTime);
            await recorder.stop();

            const uri = recorder.uri;

            if (!uri) {
                console.log("no URI available");
                return;
            }

        setDuration(finalDuration);
        setRecordingUri(uri);
        setRecordingState('stopped');

        } catch (error) {
            console.error("error stopping record: ", error)
        }
    
    // player.replace({ uri: src });
  }

   function resetRecording() {
    setRecordingUri(null);
    setDuration(0);
    setRecordingState('idle');
  }

  return {
    recordingUri,
    recordingState,
    duration,
    durationMillis: recorderStatus.durationMillis,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    resetRecording
  };
}