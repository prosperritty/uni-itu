//@author Olha Tomylko

import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import config from "../config";
import React from 'react';

/**
 * A component that displays a future event on the home screen.
 */
export default function EventHome({ event, onLayout }) {
    return (
    <View style={styles.event}>
        <View style={styles.container} onLayout={onLayout}>
            <View style={styles.header}>
                <Text style={styles.headerText}>{"Future event"}</Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.eventName}>{event.name || "name"}</Text>
                <Text style={styles.timeText}>From: {event.starttime || "starttime"}</Text>
                <Text style={styles.timeText}>Until: {event.endtime || "endtime"}</Text>
            </View>
        </View>
    </View>
    );
}

const styles = StyleSheet.create({
    event: {
        marginBottom: 10,
        marginHorizontal: 5,
    },
    container: {
        flexDirection: 'row',
        width: 200,
        height: 190,
        backgroundColor: '#FEFAE0',
        borderRadius: 29,
        overflow: 'hidden',
        alignItems: 'tight',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    header: {
        position: 'absolute',
        top: 0,
        width: '100%',
        height: 60,
        backgroundColor: '#283618',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 29,
        borderTopRightRadius: 29,
    },
    headerText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 20,
    },
    eventName: {
        color: '#000000',
        fontWeight: 'bold',
        paddingBottom: 10,
        fontSize: 17,
    },

    content: {
        flex: 1,
        paddingTop: 45,
        paddingLeft: 16,
        justifyContent: 'center',
    },
    dataText: {
        color: '#606C38',
        fontSize: 14,
    },
    timeText: {
        color: '#A4A4A4',
        fontSize: 12,
    },

});
