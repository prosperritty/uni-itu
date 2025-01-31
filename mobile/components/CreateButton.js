//@author Olha Tomylko

import { StyleSheet, Text, View, TouchableOpacity, Modal, TouchableWithoutFeedback} from "react-native";
import React, { useState } from 'react';

/**
 * PlusButton component displays a floating button that opens a modal to create a new task, event, or jar.
 */
export default function PlusButton({navigation, userInfo}) {
    const [modalVisible, setModalVisible] = useState(false);

    //Opens the modal by setting `modalVisible` to true.
    const openModal = () => setModalVisible(true);
    //Closes the modal by setting `modalVisible` to false.
    const closeModal = () => setModalVisible(false);

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={openModal}>
                <Text style={styles.plus}>+</Text>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal}
            >
            <TouchableWithoutFeedback onPress={closeModal}>
                    <View style={styles.modalContainer}>
                        <TouchableWithoutFeedback>
                            <View style={styles.modalContent}>
                                <TouchableOpacity onPress={() => { closeModal(); navigation.navigate("TaskCreation", { userInfo }); }} style={styles.createSomethingButton}>
                                    <Text style={styles.ButtonText}>Create new task</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => { closeModal(); navigation.navigate("EventCreation", { userInfo }); }} style={styles.createSomethingButton}>
                                    <Text style={styles.ButtonText}>Create new event</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => { closeModal(); navigation.navigate("JarCreation"); }} style={styles.createSomethingButton}>
                                    <Text style={styles.ButtonText}>Create new jar</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 30,
        right: 30,
    },
    button: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#283618',
        justifyContent: 'center',
        alignItems: 'center',
    },
    plus: {
        fontSize: 45,
        color: '#fff',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: 300,
        height: 250,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalText: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
    },
    closeButton: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#34A853',
        borderRadius: 5,
    },
    createSomethingButton: {
        width: 250,
        height: 50,
        margin: 8,
        backgroundColor: '#DDA15E',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',

    },
    ButtonText: {
        color: '#fff',
        fontSize: 22,
    },
});
