/**
 * File for jar screen, which displaying all information about jar
 * Can be entered from finance screen
 *
 * @author Albert Tikaiev
 */

import {
    Text, View, StyleSheet, FlatList, TextInput, TouchableOpacity, TouchableWithoutFeedback} from "react-native";
import config from "../config";
import {useState} from "react";
import ATButton from "../components/ATButton";
import Transaction from "../components/Transaction";
import axios from "axios";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import JarTransaction from "../components/JarTransaction";
import ErrorMessage from "../components/ErrorMessage";
import HorizontalBreak from "../components/HorizontalBreak";

/**
 * @param navigation Navigation
 * @param route Route, for extracting jar information
 * @returns {JSX.Element}
 */
export default function Jar({ navigation, route }){
    //Jar object
    const [jar, setJar] = useState(route.params.jar);

    //Function to change modes
    const [isAdding, setIsAdding] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    //Date states
    const [newDate, setNewDate] = useState(new Date(Date.now()));
    const [datePicker, setDatePicker] = useState(false);

    const [updatingCurrent, setUpdatingCurrent] = useState(false);
    const [updatingTotal, setUpdatingTotal] = useState(false);
    const [amounts, setAmounts] = useState({
        totalamount: "0",
        currentamount: "0"
    });

    /**
     * Function performs deleting(finishing) jar
     */
    async function deleteJar(){
        try{
            await axios.delete(config.api + `/deljar/${jar.data.id}`);
            navigation.navigate("Finance");
        }catch (error) {
            ErrorMessage("Failed to finish jar");
        }
    }

    /**
     * Function performs updating jar information
     */
    async function updateJar(){
        try{
            const request = await axios.get(config.api + `/jar/${jar.data.id}`);
            setJar(request.data);
        } catch (error) {
            ErrorMessage("Failed to update jar information");
        }
    }

    /**
     * Function performs updating deadline date
     */
    async function putDeadline(){
        try{
            await axios.put(config.api + `/jars/${jar.data.id}/deadline`, {
                deadline: newDate.toISOString().split("T")[0]
            });
            await updateJar();
            setIsUpdating(false);
        }catch (error) {
            ErrorMessage("Failed to update deadline");
        }
    }

    /**
     * Function performs updating deadline date
     */
    async function putAmount(){
        if(!updatingCurrent && !updatingTotal) return;
        try{
            await axios.put(config.api + `/jars/${jar.data.id}/amount`, {
                totalamount: updatingTotal ? amounts.totalamount : jar.data.totalamount,
                currentamount: updatingCurrent ? amounts.currentamount : jar.data.currentamount
            });
            setUpdatingTotal(false);
            setUpdatingCurrent(false);
            await updateJar();
        }catch (error) {
            ErrorMessage("Failed to update amount");
        }
    }

    /**
     * Function performs updating post data for updating deadline
     * @param event DateTimePicker event
     * @param value New date value
     */
    function handleDateChange(event, value) {
        setDatePicker(false);
        setNewDate(value);
    }

    /**
     * Controls values for updating amounts
     * @param value New value
     */
    function handleAmountChange(value) {
        setAmounts((prevState) => ({
            totalamount: updatingTotal ? value : prevState.totalamount,
            currentamount: !updatingTotal ? value : prevState.currentamount,
        }));
    }

    /**
     * Function to update current state of amount before inline editing
     */
    function updateInputs() {
        setAmounts({currentamount: String(jar.data.currentamount), totalamount: String(jar.data.totalamount) })
    }

    return(
        <TouchableWithoutFeedback onPress={async () => {
            await putAmount();
        }}>
        <View style={styles.container}>
            {/*Jar info*/}
            <View style={styles.jar_target}>
                <Text style={styles.large_text}>{jar.data.target}</Text>
            </View>

            {/*Inline inputs*/}
            <View style={styles.jar_data}>
                <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
                {updatingTotal ?
                    <>
                    <Text style={styles.large_text}>Target amount: </Text>
                    <TextInput
                        style={styles.inline_input}
                        inputMode={'numeric'}
                        value={amounts.totalamount}
                        onChangeText={(value) => handleAmountChange(value)}
                        onBlur={async () => {await putAmount(); setUpdatingTotal(false);}}
                        onSubmitEditing={async () => {await putAmount();}}
                        autoFocus={true}
                    />
                    </>
                    :
                    <TouchableOpacity style={styles.data_container} onPress={() => {setUpdatingTotal(true); updateInputs();}}>
                        <Text style={styles.large_text}>Target amount: {jar.data.totalamount}$</Text>
                    </TouchableOpacity>
                }
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
                {updatingCurrent ?
                    <>
                    <Text style={styles.large_text}>Current amount: </Text>
                    <TextInput
                        style={styles.inline_input}
                        inputMode={'numeric'}
                        value={amounts.currentamount}
                        onChangeText={(value) => handleAmountChange(value)}
                        onBlur={async () => {await putAmount(); setUpdatingCurrent(false);}}
                        onSubmitEditing={async () => {await putAmount();}}
                        autoFocus={true}
                    />
                    </>
                    :
                    <TouchableOpacity style={styles.data_container} onPress={() => { setUpdatingCurrent(true); updateInputs();}}>
                        <Text style={styles.large_text}>Current amount: {jar.data.currentamount}$</Text>
                    </TouchableOpacity>
                }
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
                    <Text style={styles.large_text}>Deadline: {jar.data.deadline}</Text>
                </View>
            </View>

            {/*Buttons to switch modes and other manipulations*/}
            <HorizontalBreak/>
            <View style={{height:70, flexDirection:'row'}}>
                {!isUpdating && <ATButton title={'Update deadline'} callback={() => {
                    setIsUpdating(true);
                    setDatePicker(true);
                }}/>}
                {!isUpdating && <ATButton title={'Delete Jar'} callback={deleteJar}/>}
                {isUpdating && <ATButton title={'Update'} callback={putDeadline}/>}
                {isUpdating && <ATButton title={'Cancel'} callback={() => setIsUpdating(false)}/>}
                {datePicker &&
                    <RNDateTimePicker
                        value={new Date()}
                        mode="date"
                        display="default"
                        onChange={(event, value) => handleDateChange(event, value)}
                    />
                }
            </View>

            {/*Updating deadline, adding amount or return to history buttons*/}
            <View style={{height:70}}>
                {!isUpdating && <ATButton title={isAdding ? 'Back to history' : 'Add to amount'}
                                          callback={() => setIsAdding(prev => !prev)}/>}
                {isUpdating && <ATButton title={`New deadline will be: ${newDate.toLocaleDateString()}`}
                                         callback={() => setDatePicker(true)}/>}
            </View>

            {/*History or adding to jar*/}
            <HorizontalBreak/>
            <View style={{alignItems: 'center'}}>
                <Text style={styles.large_text}>{isAdding ? 'Add amount' : 'History'}</Text>
            </View>
            {isAdding ?
                <JarTransaction setOpenJarAdd={() => setIsAdding(prev => !prev)} jarId={jar.data.id} updateCallback={updateJar}/>
                :
                <FlatList data={jar.transactions} renderItem={({item}) => <Transaction transaction={item} last={false} updateTransactions={updateJar}/>}/>
            }
        </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    jar_data:{
        width: '100%',
        height:175,
        backgroundColor: config.colors.main,
        borderBottomRightRadius: 13,
        borderBottomLeftRadius: 13,
        justifyContent: 'space-evenly',
    },
    jar_target:{
        width: '100%',
        backgroundColor: config.colors.light_green,
        borderTopRightRadius: 13,
        borderTopLeftRadius: 13,
        padding:2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    large_text:{
        fontSize: 24,
    },
    inline_input:{
        fontSize: 24,
        color: config.colors.lighter_green,
    }
})