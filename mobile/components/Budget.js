/**
 * File for component displaying current budget on finance screen
 *
 * @author Albert Tikaiev
 */

import config from "../config";
import { ActivityIndicator, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import {useState} from "react";
import axios from "axios";
import ErrorMessage from "./ErrorMessage";

/**
 * @param amount Amount to be displayed
 * @param title Title on top of component
 * @param callback Callback to update budget info
 * @returns {JSX.Element}
 */
export default function Budget({amount, title, callback}){
    const [isEditing, setEditing] = useState(false);
    const [newAmount, setNewAmount] = useState("0");

    /**
     * Switch modes between inline editing and default
     */
    function inlineSwitch() {
        setNewAmount(String(amount));
        setEditing(prevState => !prevState);
    }

    /**
     * Function performs updating budget
     */
    async function updateBudget() {
        if(Number(newAmount) === amount || !isEditing) return;
        try{
            await axios.put(config.api + `/budget/update`, {amount: newAmount});
            callback();
        }catch (error) {
            ErrorMessage("Failed to get user information");
        }
    }

    return(
        <KeyboardAvoidingView behavior={'padding'}>
        <View style={styles.container}>
            <View style={styles.name_container}>
                <Text style={styles.mediumtext}>{title}</Text>
            </View>
            <View style={[styles.data_container, {backgroundColor: isEditing ? '#EEEAD0' : config.colors.main}]}>
                {amount !== null ?
                    isEditing ?
                        <TextInput
                            style={styles.inline_input}
                            inputMode={'numeric'}
                            value={newAmount}
                            onChangeText={setNewAmount}
                            onBlur={async () => {await updateBudget(); inlineSwitch();}}
                            onSubmitEditing={async () => {await updateBudget();}}
                            autoFocus={true}
                        />
                        :
                        <TouchableOpacity style={styles.data_container} onPress={inlineSwitch}>
                            <Text style={styles.largetext}>{amount}$</Text>
                        </TouchableOpacity>
                    :
                    <ActivityIndicator size='large'/>
                }
            </View>
        </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
        container: {
            flex: 1,
            marginVertical: 10,
            width: '100%',
            backgroundColor: '#eaeaea',
            justifyContent: 'center',
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            alignItems: 'center',
            borderRadius: 13,
        },
        name_container: {
            flex: 1,
            width: '100%',
            backgroundColor: '#283618',
            justifyContent: 'center',
            alignItems: 'center',
            borderTopLeftRadius: 13,
            borderTopRightRadius: 13,
        },
        data_container: {
            flex: 1,
            height: 150,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            borderBottomLeftRadius: 13,
            borderBottomRightRadius: 13,
        },
        largetext: {
            fontSize: 32,
            color: config.colors.light_green
        },
        mediumtext:{
            fontSize: 24,
            color: 'white'
        },
        inline_input:{
            fontSize: 32,
            color: config.colors.light_green,
        }
    }
);