/**
 * File for creation jar screen
 * Can be entered from finance screen or home screen modal
 *
 * @author Albert Tikaiev
 */

import {View, Text, StyleSheet} from "react-native";
import {useState} from "react";
import config from "../config";
import ATButton from "../components/ATButton";
import axios from "axios";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import ATInput from "../components/ATInput";
import ErrorMessage from "../components/ErrorMessage";

/**
 * @param navigation Navigation
 * @returns {JSX.Element}
 */
export default function JarCreation({ navigation }) {
    //Data for post method
    const [postData, setPostData] = useState({
        target: "",
        totalamount: 0,
    });

    //Deadline date states
    const [deadline, setDeadline] = useState(new Date(Date.now()));
    const [datePicker, setDatePicker] = useState(false);

    /**
     * Function updating data for post method
     * @param value New target name value
     */
    function updateTarget(value) {
        setPostData(prevState => ({...prevState, target: value}));
    }

    /**
     * Function updating data for post method
     * @param value New target amount value
     */
    function updateTargetAmount(value) {
        setPostData(prevState => ({...prevState, totalamount: value}));
    }

    /**
     * @param event DateTimePicker event
     * @param value New deadline date value
     */
    function updateDeadline(event, value) {
        setDeadline(value);
        setDatePicker(false);
    }

    /**
     * Function performs post method of creating new jar
     */
    async function postJar() {
        try{
            await axios.post(config.api+"/jars/add", {
                target: postData.target,
                totalamount: postData.totalamount,
                deadline: deadline.toISOString().split("T")[0]
            })
            navigation.pop();
        }catch (error) {
            if(error.response && error.response.data){
                const serverError = error.response.data;
                if(serverError.detail) ErrorMessage(serverError.detail.message);
                else ErrorMessage("Failed to create new jar");
            }
            else{
                ErrorMessage("Failed to create new jar");
            }
        }
    }

    return (
        <View style={styles.container}>


            <View style={styles.shadowed}>
            {/*Top title*/}
            <View style={styles.top}>
                <Text style={styles.large_text}>Create new jar</Text>
            </View>

            {/*Inputs*/}
            <View style={styles.mid}>
                <ATInput placeholder={"Target name"} onChange={updateTarget} keyboardType={'default'}/>
                <ATInput placeholder={"Target amount"} onChange={updateTargetAmount} keyboardType={'decimal-pad'}/>
                <Text style={styles.medium_text}>Picked date: {deadline.toLocaleDateString()}</Text>
                {datePicker &&
                    <RNDateTimePicker
                        value={new Date()}
                        mode="date"
                        display="default"
                        onChange={(event, value) => updateDeadline(event, value)}
                    />
                }
                {/*Open date modal*/}
                <View style={styles.mid_button}>
                    <ATButton title={"Pick date"} callback={() => setDatePicker(true)}/>
                </View>
            </View>
            </View>

            {/*Create new jar button*/}
            <View style={styles.bottom}>
                <ATButton title={"Create jar"} callback={postJar}/>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        padding: 10,
    },
    shadowed:{
        width: '100%',
        borderRadius: 13,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    top : {
        backgroundColor: config.colors.lighter_green,
        width:'100%',
        alignItems: "center",
        justifyContent: "center",
        borderTopLeftRadius : 13,
        borderTopRightRadius : 13,
    },
    large_text: {
        fontSize: 24,
        margin: 10,
    },
    medium_text: {
        fontSize: 16,
    },
    mid :{
        backgroundColor: config.colors.main,
        width:'100%',
        alignItems: "center",
        padding: 10,
        borderBottomLeftRadius: 13,
        borderBottomRightRadius: 13,
    },
    mid_button: {
        height:60,
        width:'100%'
    },
    bottom: {
        height:60,
        width:'100%'
    }
})