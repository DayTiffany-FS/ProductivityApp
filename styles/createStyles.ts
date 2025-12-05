import { StyleSheet, Platform, Dimensions } from 'react-native';

export const createStyles = () => {
  const { width } = Dimensions.get('window');

  // Base styles
  const baseStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
      ...(Platform.OS === 'web' && {
        maxWidth: 800,
        alignSelf: 'center',
        width: '100%',
      }),
    },

    taskItem: {
      backgroundColor: 'white',
      padding: Platform.OS === 'web' ? 12 : 16,
      marginBottom: 8,
      borderRadius: 8,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      ...(Platform.OS === 'web' && {
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }),
    },

    addButton: {
      backgroundColor: '#007AFF',
      margin: 16,
      padding: Platform.OS === 'web' ? 12 : 16,
      borderRadius: 8,
      alignItems: 'center',
      ...(Platform.OS === 'web' && {
        cursor: 'pointer',
      }),
    },
  });

  // Responsive overrides for web
  const responsiveStyles =
    Platform.OS === 'web'
      ? width > 768
        ? {
            container: { padding: 24, maxWidth: 1200 },
            columns: { flexDirection: 'row', flexWrap: 'wrap' },
          }
        : {
            container: { padding: 16 },
            columns: { flexDirection: 'column' },
          }
      : {};

  // Combine base and responsive styles
  return { ...baseStyles, ...responsiveStyles };
};
