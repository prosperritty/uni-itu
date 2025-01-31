/**
 * File for Transaction component for finance screen
 *
 * @author Albert Tikaiev
 */
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import config from "../config";
import axios from "axios";
import ErrorMessage from "./ErrorMessage";

/**
 * @param transaction Transaction object
 * @param last If component will be displaying as last transaction or on list
 * @param updateTransactions Callback for updating list of transactions after deleting transaction
 * @returns {JSX.Element}
 */
export default function Transaction({transaction, last, updateTransactions}) {

    /**
     * Function that perform delete transaction and updates list of transactions
     */
    async function deleteTransaction() {
        try {
            await axios.delete(config.api +`/deltransaction/${transaction.id}`);
            if(!last) await updateTransactions();
        } catch (error){
            ErrorMessage("Failed to delete transaction");
        }
    }

    return(
        // Display if not null
        transaction ?
            <View style={[styles.data_container, last ? {} : {borderTopLeftRadius: 13, borderTopRightRadius: 13, marginVertical: 5}]}>

                {/*Red or green block*/}
                <View
                    style={[styles.left_bar,
                        transaction.isIncome ? {backgroundColor: config.colors.lighter_green} : {backgroundColor: config.colors.error},
                        last ? {} : {borderTopLeftRadius: 13}]}>
                </View>

                {/*Type and amount*/}
                <View style={styles.data_left}>
                    <Text style={styles.largetext}>{transaction.dtype}</Text>
                    <Text style={styles.largetext}>{transaction.amount}$</Text>
                </View>

                {/*Time*/}
                <View style={styles.data_mid}>
                        <Text style={styles.largetext}>{transaction.datecreation ? transaction.datecreation.slice(0, 10) : ''}{"\n"}</Text>
                        <Text style={styles.largetext}>{transaction.datecreation ? transaction.datecreation.slice(10, 16) : ''}</Text>
                </View>

                {/*Delete button, displays only on lists*/}
                {!last &&
                    <View style={styles.data_right}>
                        <TouchableOpacity style={styles.button_right} onPress={() => deleteTransaction()}>
                            <Text style={styles.largetext}>X</Text>
                        </TouchableOpacity>
                    </View>
                }
            </View>
            :
            <View style={styles.data_container}>
                <Text>No transaction available😞</Text>
            </View>
    )
}

const styles = StyleSheet.create({
    data_container: {
        flex: 1,
        flexDirection: 'row',
        minHeight: 90,
        width: '100%',
        backgroundColor: '#FEFAE0',
        alignItems: 'center',
        borderBottomLeftRadius: 13,
        borderBottomRightRadius: 13,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    data_left:{
        justifyContent: 'space-evenly',
        marginLeft: 5,
        height: '100%',
        width: '40%'
    },
    data_mid:{
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width: '30%'
    },
    data_right:{
        justifyContent: 'center',
        alignItems: 'center',
        width: '30%'
    },
    left_bar: {
        height: '100%',
        width: 24,
        borderBottomLeftRadius: 13,
    },
    mediumtext:{
        fontSize: 18,
    },
    button_right : {
        width: 50,
        height: 50,
        borderRadius:25,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:config.colors.error
    },
    largetext:{
        fontSize: 20,
    },
})