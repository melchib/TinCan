import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { Image } from 'react-native';
import { useEffect, useState } from 'react';
import { loadMessages } from '../services/messageService';
import { FlatList } from 'react-native';
import { getDisplayName } from '../services/userService';

export default function GroupInboxScreen({ navigation, route }) {
    const { groupID, groupName, groupMembers } = route.params;
    const [messages, setMessages] = useState([]);
    
    useEffect(() => {
        async function fetchMessages() {
            try {
                const groupMessages = await loadMessages(groupID);
                setMessages(groupMessages);
            } catch (error) {
                console.error("error loading messages", error);
            }
        }

        fetchMessages();
    }, [groupID]);


    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                {groupName}
            </Text>

            <FlatList 
                data={messages}
                keyExtractor={(item) => item.id}
                horizontal
                inverted
                renderItem={({ item }) => (
                    <View style={styles.messageCard}>
                        <Text>{item.displayName}</Text>
                        <Text>{item.duration}s</Text>
                        <Text>{item.dateSent}</Text>
                        <Text>{item.timeSent}</Text>
                    </View>
                )}
            />
            <View style={styles.addButton}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('TestScreen')}>
                    <Text style={{fontSize: 40}}>
                        +
                    </Text>
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
        top: 90,
        color: 'white'
    },
    messageCard: {
        backgroundColor: '#f8f4ee',
        top: 200,
        width: 330,
        right: 10,
        height: 400,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginHorizontal: 8,
        padding: 20,
        gap: 5
    },
    addButton: {
        height: 75,
        width: 75,
        backgroundColor: 'yellow',
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-end',
        right: 35,
        bottom: 60
    }
    });