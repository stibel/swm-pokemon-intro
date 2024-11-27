import { ThemedView } from "../ThemedView"
import { screenView } from "../styles/screen_view"
import { ThemedText } from "../ThemedText"
import { StyleSheet, View } from "react-native"

export const NoCameraPermission = () => {
    return (
        <ThemedView style={{ flex: 1 }}>
            <View style={screenView}>
                <ThemedText style={styles.text}>
                    Permission to use the camera was denied!
                </ThemedText>
            </View>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    text: {
        paddingTop: 24,
        width: '100%',
        textAlign: 'center',
        fontSize: 24,
        lineHeight: 24,
    }
})