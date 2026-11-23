import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { loadMessages } from '../services/messageService';
import { FlatList } from 'react-native';
import { getDisplayName } from '../services/userService';
import { useWindowDimensions } from 'react-native';
import usePlayback from '../components/usePlayback';
import { useFocusEffect } from '@react-navigation/native';
import ProfileIcon from '../components/ProfileIcon';
import { getGroupColors } from '../services/groupService';
import Octicons from '@expo/vector-icons/Octicons';
import { MaterialIcons } from '@expo/vector-icons';


export default function GroupInboxScreen({ navigation, route }) {
    const { groupID, groupName, groupMembers } = route.params;
    const { playRecording, stopPlayback, isPlaying, playingUri } = usePlayback();
    const [messages, setMessages] = useState([]);
    const [memberColors, setMemberColors] = useState({});
    const { width } = useWindowDimensions();
    const cardWidth = 330;
    const cardMargin = 8;

    const sidePadding = (width - cardWidth - cardMargin * 2) /2;
    
    useFocusEffect(
        useCallback(() => {
            let active = true;

            async function fetchGroupData() {
                try {
                    const [groupMessages, groupColors] = await Promise.all([
                        loadMessages(groupID),
                        getGroupColors(groupID)
                    ]);

                    if (active) {
                        setMessages(groupMessages);
                        setMemberColors(groupColors);
                    }
                } catch (error) {
                    console.error("Error loading group data:", error);
                }
            }

            fetchGroupData();
            
            return () => {
                active = false;
            };
        }, [groupID])
    );


    return (
        <View style={styles.container}>
            <TouchableOpacity 
            style={styles.settingsButton}
            onPress={() => navigation.navigate('GroupSettings', {groupID})}>
                <MaterialIcons name="settings" size={24} color="#3c78d8ff" />
            </TouchableOpacity>
            <Text style={styles.title}>
                {groupName}
            </Text>

            <FlatList 
                data={messages}
                keyExtractor={(item) => item.id}
                horizontal
                inverted
                snapToInterval={346}
                snapToAlignment='start'
                decelerationRate='fast'
                contentContainerStyle={{
                    paddingHorizontal: Math.max(0, sidePadding)
                }}
                renderItem={({ item }) => (
                    <View style={styles.messageCard}>
                        <View style={styles.profilePhotoSpot}>
                            <ProfileIcon
                                displayName={item.displayName}
                                color={memberColors[item.senderID]}
                                size={80}
                            />
                        </View>
                        <View style={styles.playButtonBg}>
                        <TouchableOpacity
                            onPress={() => playRecording(item.audioURL)}
                        >
                            {isPlaying && playingUri === item.audioURL ? (
                            <View style={styles.pauseSymbol} />
                            ) : (
                            <View style={styles.playIcon} />
                            )}
                        </TouchableOpacity>
                        
                        </View>
                        <Text style = {styles.lengthText}>{item.duration}s</Text>
                        <Text style = {styles.name}>{item.displayName}</Text>
                        <Text style = {styles.dateText}>{item.dateSent}</Text>
                        <Text>{item.timeSent}</Text>
                    </View>
                )}
            />
            <View style={styles.addButton}>
                <TouchableOpacity
                    onPress={() => navigation.navigate("RecordScreen", {
                        groupID,
                        groupName,
                        groupMembers
                    })}>
                    <Text style={{fontSize: 50, color:"#743f43"}}>
                        +
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={styles.backButton}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}>
                     <Octicons name="arrow-left" size={32} color="#743f43" />
                </TouchableOpacity>
            </View>
        </View>
        
    )}
    const styles= StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffada8',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    title: {
        fontFamily: 'Inter',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 35,
        top: 120,
        color: 'white'
    },
    messageCard: {
        backgroundColor: '#f8f4ee',
        top: 170,
        width: 330,
        height: 400,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginHorizontal: 8,
        padding: 20,
        gap: 5
    },
    addButton: {
        height: 85,
        width: 85,
        backgroundColor: '#ffd979',
        borderRadius: 45,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-end',
        right: 35,
        bottom: 60
    },
    name: {
        fontFamily: 'Inter',
        color: '#fb6058',
        fontSize: 30,
        fontWeight: 'bold'
    },
    lengthText: {
        fontFamily: 'Inter',
        color: '#810100',
        fontSize: 15,
        fontWeight: '400'
    },
    dateText: {
        fontFamily: 'Inter',
        color: '#625f5f',
        fontSize: 18,
        fontWeight: '900'
    },
    playButtonBg: {
        backgroundColor: 'white',
        top: -10,
        width: 100,
        height: 100,
        borderRadius: 70,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#b82d2d'
  },
playIcon: {
    width: 0,
    height: 0,
    borderTopWidth: 25,
    borderBottomWidth: 25,
    borderLeftWidth: 35,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'white',
    marginLeft: 12,
  },
  profilePhotoSpot: {
    top: -25,
  
  },
  pauseSymbol: {
    width: 40,
    height: 55,
    borderLeftWidth: 13,
    borderRightWidth: 13,
    borderColor: 'white',
},
    settingsButton: {
    backgroundColor: 'white',
    width: 45,
    height: 45,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    right: 150,
    zIndex: 300,
    top: 70
},
backButton: {
    position: 'absolute',
    bottom: 65,
    left: 30,
    height: 60,
    width: 60,
    backgroundColor: '#fb6058',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 300
},
    });