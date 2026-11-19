import { View, Text, StyleSheet } from 'react-native';

export default function ProfileIcon({ displayName, color, size = 50 }) {
    const initial = displayName?.trim()?.charAt(0)?.toUpperCase() || '?';

    return (
        <View style={[
            styles.circle,
            {
                backgroundColor: color,
                width: size,
                height: size,
                borderRadius: size / 2,
            }
        ]}>
            <Text style={[
                styles.initial,
                { fontSize: size * 0.45 }
            ]}>
                {initial}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    circle: {
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    initial: {
        color: 'white',
        fontWeight: 'bold',
    },
});