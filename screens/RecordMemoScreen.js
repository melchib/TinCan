import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
export default function RecordMemoScreen({ navigation, route }){
    const { groupID, groupName, groupMembers } = route.params;
    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#f16f6f', '#c40808']}
                style={styles.background}
            />
            <Text style={styles.title}>Send a pod to:</Text>
            <Text style={styles.subtitle}>{groupName}</Text>
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
        top: 100,
        color: 'white'
    },
    subtitle: {
        fontFamily: 'Inter',
        textAlign: 'center',
        fontSize: 22,
        top: 105,
        color: 'white'
    }
    })