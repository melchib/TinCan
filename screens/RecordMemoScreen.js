import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';

import usePlayback from '../components/usePlayback';
import useRecording from '../components/useRecording';
import { writeMessage } from '../services/messageService';

export default function RecordMemoScreen({ navigation, route }){
    const { groupID, groupName, groupMembers } = route.params;
    const { recordingUri, recordingState, duration, durationMillis, startRecording,
        pauseRecording, resumeRecording, stopRecording, resetRecording } = useRecording();
    const { playRecording, stopPlayback, playingMessageID, isPlaying } = usePlayback();
    const [isSending, setIsSending] = useState(false);

    async function sendMessage() {
        if (isSending || !recordingUri) return;

        setIsSending(true);

        try {
            stopPlayback();

            await writeMessage(recordingUri, groupID, duration);
            resetRecording();
            navigation.goBack();

        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setIsSending(false);
        }
    }

    function deleteRecording() {
        stopPlayback();
        resetRecording();
    }

    
    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#f16f6f', '#c40808']}
                style={styles.background}
            
            />
    {recordingState !== 'stopped' && (
        <>
            <Text style={styles.title}>Record a pod for:</Text>
            <Text style={styles.subtitle}>{groupName}</Text>
        </>
    )}
            
        {/* // screen when state is idle */}
            {recordingState === 'idle' && (

                <TouchableOpacity onPress={(startRecording)}
                    style={styles.recordBtn}
                >
                <Image 
                    source={require('../icons/micBtn.png')}
                    style={styles.image}
                    resizeMode="contain"
                    />
            </TouchableOpacity>
            )}

        {/* screen when state is recording  */}
       {recordingState === 'recording' && (
        <View style={styles.recordingControls}>
            <Text style={styles.timer}>
                {Math.floor(durationMillis / 1000)}s
            </Text>

            <View style={styles.btnRow}>
                {/* <TouchableOpacity
                    onPress={pauseRecording}
                    style={styles.pauseBtn}
                >
                    <Text>Pause</Text>
                </TouchableOpacity> */}


                <TouchableOpacity onPress={stopRecording}>
                    <Image
                        source={require('../icons/stopBtn.png')}
                        style={styles.stopImage}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            </View>
        </View>
    )} 
        {/* Screen when state is paused */}
        {recordingState === 'paused' && (
            <View> 
                <Text style={styles.timer}>{Math.floor(durationMillis / 1000)}s</Text>

                <View style={styles.btnRow}>
                    <TouchableOpacity onPress={resumeRecording}>
                        <Text>Resume</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={stopRecording}>
                        <Text>
                            stop
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )}

        {/* screen when state is stopped */}
        {recordingState === 'stopped' && (
        <View style={styles.confirmationScreen}>
            <Text style={styles.confirmationTitle}>Recording complete!</Text>

            <TouchableOpacity
                style={styles.playButton}
                onPress={() => playRecording(recordingUri)}
                >
                    {isPlaying ? (
                        <View style={styles.pauseSymbol} />    
                    ) : (
                        <View style={styles.playTriangle} />
                    )}
            </TouchableOpacity>
            
            <View style={styles.confirmationButtons}> 
                <TouchableOpacity style={styles.deleteButton}
                    onPress={deleteRecording}
                    disabled={isSending}>
                    <Text style={styles.confirmationButtonText}>
                        Delete
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.sendButton}
                    onPress={sendMessage}
                    disabled={isSending}
                >
                    <Text style={styles.confirmationButtonText}>
                        {isSending ? 'Sending...' : 'Send'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )}


        </View>
    )}




    const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#b82d2d'
    },
    background: {
        position: 'absolute',
        left: -100,
        right: -100,
        top: -50,
        height:950
    },
    title: {
        fontFamily: 'Inter',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 35,
        top: 130,
        color: 'white'
    },
    subtitle: {
        fontFamily: 'Inter',
        textAlign: 'center',
        fontSize: 30,
        top: 140,
        color: 'white'
    },
    image: {
        height: 200,
        width: 400,
        top: 220,
    },
    pauseBtn: {
        backgroundColor: '#ffd979',
        height: 50,
        width: 90,
        alignItems:'center',
        justifyContent: 'center',
        borderRadius: 20,
    },
    recordingControls: {
        position: 'absolute',
        top: '50%',
        left: 0,
        right: 0,
        transform: [{ translateY: -80 }],
        alignItems: 'center',
        gap: 25,
    },
    timer: {
        fontFamily: 'Inter',
        fontSize: 35,
        color: '#ffd979',
        textAlign: 'center',
    },
    btnRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
    },
    stopImage: {
        width: 130,
        height: 130,
    },
    confirmationScreen: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
},

confirmationTitle: {
    position: 'absolute',
    top: 150,
    fontFamily: 'Inter',
    fontWeight: 'bold',
    fontSize: 30,
    color: 'white',
    textAlign: 'center',
},

playButton: {
    width: 160,
    height: 160,
    borderRadius: 80,
    top: 300,
    backgroundColor: '#ffda79',
    justifyContent: 'center',
    alignItems: 'center',
},

playTriangle: {
    width: 0,
    height: 0,
    borderTopWidth: 43,
    borderBottomWidth: 43,
    borderLeftWidth: 60,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'white',
    marginLeft: 12,
},

pauseSymbol: {
    width: 40,
    height: 55,
    borderLeftWidth: 13,
    borderRightWidth: 13,
    borderColor: 'white',
},

confirmationButtons: {
    position: 'absolute',
    bottom: -500,
    left: 25,
    right: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: -20,
},

deleteButton: {
    backgroundColor: '#ff5f5b',
    width: 145,
    height: 60,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
},

sendButton: {
    backgroundColor: '#900000',
    width: 145,
    height: 60,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
},

confirmationButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
},
    })