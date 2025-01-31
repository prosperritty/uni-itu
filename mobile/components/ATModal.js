/**
 * File for general modal component
 *
 * @author Albert Tikaiev
 */

import {Modal, StyleSheet, Text, TouchableOpacity, View, Image} from "react-native";
import config from "../config";

/**
 * @param title Top title
 * @param open If modal is open
 * @param setOpen Change open state
 * @param children Body of modal
 * @returns {JSX.Element}
 */
export default function ATModal({title, open, setOpen, children}){
    return(
        <Modal animationType="slide" visible={open} onRequestClose={() => setOpenStatistics(false)} transparent={true}>
            <View style={styles.overlay}>
                <View style={styles.modal_view}>
                    <View style={styles.modal_top}>
                        <Text style={styles.text_large}>{title}</Text>
                        <TouchableOpacity style={styles.modal_close} onPress={() => setOpen(false)}>
                            <Image source={require('../assets/cancel.png')}/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.modal_content}>
                        {children}
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modal_view: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal_content :{
        width: 300,
        borderBottomLeftRadius: 13,
        borderBottomRightRadius: 13,
        padding: 10,
        alignItems: 'center',
        backgroundColor: config.colors.main,
    },
    modal_close:{
        width: 30,
        height: 30,
        borderRadius:15,
        backgroundColor: config.colors.error,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modal_top:{
        width: 300,
        height: 50,
        padding: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: config.colors.lighter_green,
        borderTopRightRadius: 13,
        borderTopLeftRadius: 13
    },
    text_large:{
        fontSize: 24,
    }
})