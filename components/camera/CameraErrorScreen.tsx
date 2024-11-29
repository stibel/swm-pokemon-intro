import { ThemedView } from '../ThemedView';
import { screenView } from '../styles/screen_view';
import { ThemedText } from '../ThemedText';
import { StyleSheet, View } from 'react-native';

interface IProps {
  text: string;
}

export const CameraErrorScreen = ({ text }: IProps) => {
  return (
    <ThemedView style={{ flex: 1 }}>
      <View style={screenView}>
        <ThemedText style={styles.text}>{text}</ThemedText>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  text: {
    paddingTop: 24,
    width: '100%',
    textAlign: 'center',
    fontSize: 24,
    lineHeight: 24,
  },
});
