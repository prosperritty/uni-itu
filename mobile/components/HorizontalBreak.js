/**
 * File for horizontal break component
 *
 * @author Albert Tikaiev
 */

import {StyleSheet, View} from "react-native";

export default function HorizontalBreak(){
    return (
        <View style={styles.hr}/>
    )
}

const styles = StyleSheet.create({
    hr: {
        width: '100%',
        marginVertical: 10,
        height: 1,
        backgroundColor: 'black',
    },
})