/**
 * File for component, which will add amount to Jar
 *
 * @author Albert Tikaiev
 */

import {View,  StyleSheet} from "react-native";
import config from "../config";
import {useState} from "react";
import axios from "axios";
import ATButton from "./ATButton";
import ATInput from "./ATInput";
import ErrorMessage from "./ErrorMessage";

/**
 * @param setOpenJarAdd Function for mode switching, that will change after successful operation
 * @param updateCallback Callback, that will update information about this jar
 * @param jarId Id of certain jar object
 * @returns {JSX.Element}
 */
export default function JarTransaction({setOpenJarAdd, updateCallback, jarId}) {
    //Data for post method
    const [postData, setPostData] = useState({
        amount: 0,
        isIncome:false,
        jarId: jarId,
        dtype: "Jar",
    });

    /**
     *  Function to add new transaction with jar id
     */
    async function postTransaction () {
        try {
            const request = await axios.post(config.api+"/transactions/add", {
                amount : postData.amount,
                isIncome: postData.isIncome,
                jarId: postData.jarId,
                dtype: postData.dtype,
            });
            updateCallback();
            setOpenJarAdd(false);
        } catch (error) {
            ErrorMessage("Failed to add amount to jar");
        }
    }

    /**
     * @param changeState New amount
     */
    function handleAmountChange (changeState) {
        setPostData(prevState => ({
            ...prevState,
            amount: changeState
        }))
    }

    return (
        <View style={{flex:1, width:'100%'}}>
            <ATInput placeholder={"Amount"} onChange={handleAmountChange} keyboardType={'decimal-pad'}/>
            <View style={styles.bottom_button}>
                <ATButton title={'Add'} callback={() => postTransaction()}/>
            </View>
        </View>
    );
}

const styles= StyleSheet.create({
    bottom_button:{
        width: '100%',
        height: 50,
    }
})