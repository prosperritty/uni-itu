/**
 * File for Jar component displaying on home screen
 *
 * @author Albert Tikaiev
 */

import {View, Text, StyleSheet, Image} from "react-native";
import config from "../config";

/**
 * @param jar Jar object
 * @returns {JSX.Element}
 */
export default function JarHome({jar}) {
    return(
        <View style={styles.container}>
            <View style={styles.top}>
                <Text style={styles.headerText}>Jar</Text>
            </View>
            <View style={styles.content}>
                {jar && jar.data?
                    <View style={{alignItems: 'center'}}>
                        <Image source={require("../assets/jar.png")}/>
                        <Text style={styles.content_text}>{jar.data.target}</Text>
                        <Text style={styles.content_text}>{jar.percent}%</Text>
                    </View>
                    :
                    <Text>No jar available😞</Text>
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        height: 190,

    },
    top: {
        height: 60,
        backgroundColor: '#283618',
        borderTopRightRadius: 29,
        borderTopLeftRadius: 29,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 20,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: config.colors.main,
        borderBottomRightRadius: 29,
        borderBottomLeftRadius: 29,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    content_text: {
        fontWeight: 'bold',
        fontSize: 17
    }
})