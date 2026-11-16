
import { useState } from 'react';
import {
  useAudioPlayer,
  useAudioPlayerStatus,
  AudioModule
} from 'expo-audio';

export default function usePlayback() {
  const player = useAudioPlayer(null);
  const playerStatus = useAudioPlayerStatus(player);

  const [playingUri, setPlayingUri] = useState(null);

  async function playRecording(audioUri) {
    if (!audioUri) return;

    try {
      await AudioModule.setAudioModeAsync({
        allowsRecording: false,
        playsInSilentMode: true
      });

      // Same audio is currently playing: pause it
      if (playerStatus.playing && playingUri === audioUri) {
        player.pause();
        return;
      }

      // Same audio is paused: resume it
      if (playingUri === audioUri) {
        // If it reached the end, restart
        if (playerStatus.didJustFinish ||
            playerStatus.currentTime >= playerStatus.duration &&
            playerStatus.duration > 0) {
          await player.seekTo(0);
        }

        player.play();
        return;
      }

      // Different audio: replace the source
      player.pause();
      player.replace({ uri: audioUri });
      setPlayingUri(audioUri);
      player.play();

    } catch (error) {
      console.error('Error playing recording:', error);
    }
  }

  function stopPlayback() {
    player.pause();
    setPlayingUri(null);
  }

  return {
    playRecording,
    stopPlayback,
    isPlaying: playerStatus.playing,
    playingUri
  };
}
