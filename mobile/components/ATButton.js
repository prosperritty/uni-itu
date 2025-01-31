/**
 * File for general button component
 *
 * @author Albert Tikaiev
 */

import {Text, TouchableOpacity, StyleSheet} from "react-native";
import config from "../config";

/**
 * @param title Text inside button
 * @param callback Callback
 * @param isActive Is button was pressed and some choice was made
 * @returns {JSX.Element}
 */
export default function ATButton({title, callback, isActive}) {
    return(
        <TouchableOpacity style={[styles.button,
            // Green or default color on choice buttons
            {backgroundColor: isActive ? config.colors.lighter_green : config.colors.orange }
        ]} onPress={callback}>
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button :{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 1,
        marginVertical: 5,
        padding:5,
        borderRadius:13,
    },
    buttonText :{
        fontSize:24,
    }
})