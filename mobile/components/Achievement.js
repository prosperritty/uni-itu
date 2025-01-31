/**
 * File for component displaying achievement
 *
 * @author Albert Tikaiev
 */

import {View, StyleSheet, Text} from "react-native";
import config from "../config";

/**
 * @param achievement achievement object
 * @returns {JSX.Element}
 */
export default function Achievement({achievement}) {
    return (
        <View style={styles.container}>
            <Text style={styles.large_text}>{achievement.name}</Text>
            <Text style={styles.medium_text}>{achievement.description}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: config.colors.lighter_green,
        height: 80,
        width: '100%',
        borderRadius: 13,
        padding: 10,
        marginVertical: 5,
        justifyContent: 'space-between',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    large_text:{
        fontSize: 24,
    },
    medium_text:{
        fontSize: 14
    }
})