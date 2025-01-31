/**
 * File for general text input component
 *
 * @author Albert Tikaiev
 */

import {TextInput, StyleSheet} from "react-native";
import config from "../config";

/**
 * @param placeholder Text inside input element
 * @param onChange Callback to update value
 * @param keyboardType TextInput keyboard style
 * @returns {JSX.Element}
 */
export default function ATInput({placeholder, onChange, keyboardType}) {
    return (
        <TextInput placeholder={placeholder} style={styles.input} keyboardType={keyboardType}
                   onChangeText={(value) => onChange(value)} />
    )
}

const styles = StyleSheet.create({
    input:{
        width: '100%',
        height: 40,
        backgroundColor: config.colors.lighter_green,
        borderBottomColor: config.colors.dark_green,
        borderBottomWidth: 1,
        borderRadius:3,
        marginVertical:10
    },
})