/**
 * File for Jar component displaying on finance screen
 *
 * @author Albert Tikaiev
 */

import {Text, View, StyleSheet, TouchableOpacity, ActivityIndicator, Image} from "react-native";
import config from "../config";
import {useState} from "react";
import JarTransaction from "./JarTransaction";

/**
 * @param jar Jar object
 * @param navigatejar Callback, navigation to Jar details screen
 * @param updateCallback Callback, updates information on finance screen
 * @returns {JSX.Element}
 */
export default function JarFinance({jar, navigatejar, updateCallback}) {
    const [isAdding, setIsAdding] = useState(false);

    return (
        <View style={styles.container}>

            {/*Left side*/}
            <View style={styles.leftside}>
                <Image source={require("../assets/jar.png")}/>
                {jar.data ? <Text style={[styles.mediumtext, {color: 'white'}]}>{jar.percent}%</Text> : <ActivityIndicator size="large"/>}
            </View>

            {/*Middle*/}
            {isAdding ?
                //Mode to add amount
                <View style={[styles.center, {padding:10}]}>
                    <JarTransaction setOpenJarAdd={() => setIsAdding(prev => !prev)} jarId={jar.data.id} updateCallback={updateCallback}/>
                </View>
            :
                //Mode to see details
                <TouchableOpacity style={styles.center} onPress={navigatejar}>
                    {jar.data ?
                        <>
                            <Text style={styles.largetext}>{jar.data.target}</Text>
                            <Text style={styles.mediumtext}>{jar.data.currentamount}$ / {jar.data.totalamount}$</Text>
                        </>
                        :
                        <ActivityIndicator size="large"/>
                    }
                </TouchableOpacity>
            }

            {/*Left side*/}
            <TouchableOpacity style={styles.rightside} onPress={() => setIsAdding(prevState => !prevState)}>
                {isAdding ?
                    <Image source={require("../assets/back.png")} style={{width:25, height:25}}/>
                    :
                    <Text style={styles.largetext}>+</Text>
                }
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        minHeight: 130,
        marginVertical: 10,
        borderRadius: 13,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    leftside:{
        backgroundColor: config.colors.light_green,
        borderBottomLeftRadius: 13,
        borderTopLeftRadius: 13,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width:'20%',
    },
    center:{
        width:'60%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: config.colors.main,
    },
    rightside:{
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomRightRadius: 13,
        borderTopRightRadius: 13,
        backgroundColor: config.colors.orange,
        width:'20%'
    },
    mediumtext:{
        fontSize: 20,
    },
    largetext:{
        fontSize: 28,
    }
})