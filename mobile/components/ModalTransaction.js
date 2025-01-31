/**
 * File for modal, where user creates new transaction
 *
 * @author Albert Tikaiev
 */

import {View, Text, StyleSheet, Switch} from "react-native";
import config from "../config";
import {useState, useEffect} from "react";
import axios from "axios";
import ATButton from "./ATButton";
import DropDownPicker from "react-native-dropdown-picker";
import ATInput from "./ATInput";
import ATModal from "./ATModal";
import ErrorMessage from "./ErrorMessage";

/**
 * @param openTransaction Modal open state
 * @param setOpenTransaction Function to change modal open state
 * @param updateBudget Callback to update budget component
 * @param updateLastTransaction Callback to update last transaction budget component
 * @returns {JSX.Element}
 */
export default function ModalTransaction({openTransaction, setOpenTransaction, updateBudget, updateLastTransaction}) {
    //States for picker
    const [types, setTypes] = useState([]);
    const[openTranAdd, setOpenTranAdd] = useState(false);
    const[pickValue, setPickValue] = useState("Other");

    //State for creating new type/using old one
    const [newType, setNewType] = useState(false);

    //Object for post method
    const [postData, setPostData] = useState({
        amount: 0,
        isIncome:true,
        jarId: null,
        dtype: "Other",
    });

    /**
     * Function to get current list of transaction types
     */
    async function getTypes () {
        try{
            const request = await axios.get(config.api+"/type/transaction");
            setTypes(
                request.data.map(item => ({
                    label: item.name,
                    value: item.name
                }))
            );
        }catch (error) {
            ErrorMessage("Failed to get existing types of transactions");
        }
    }

    /**
     *  Function to add new transaction
     *  If user creating new type of transaction also add it
     *  Update states on Finance screen
     */
    async function postTransaction () {
        try {
            if (newType) {
                await axios.post(config.api + "/type/transaction/add ", {name: postData.dtype, relate: "transaction"});
                await getTypes();
            }
            await axios.post(config.api + "/transactions/add", {
                amount: postData.amount,
                isIncome: postData.isIncome,
                jarId: postData.jarId,
                dtype: newType ? postData.dtype : pickValue,
            });
            updateBudget();
            updateLastTransaction();
            setOpenTransaction(false);
        } catch (error) {
            ErrorMessage("Failed to create new transaction");
        }
    }

    /**
     * Controls buttons on top of modal
     * @param changeState previous state
     */
    function changeIsIncome(changeState) {
        setPostData(prevState => ({
            ...prevState,
            isIncome: changeState
        }));
    }

    /**
     * Controls if user wants to create new type or choose existing one
     */
    function changeNewType() {
        setNewType(prevState => !prevState);
    }

    /**
     * Updates amount of transaction in object for post method
     * @param changeState new amount
     */
    function handleAmountChange (changeState) {
        setPostData(prevState => ({
            ...prevState,
            amount: changeState
        }));
    }

    /**
     * Updates type of transaction in object for post method
     * @param changeState chosen type
     */
    function handleTypeChange (changeState) {
        setPostData(prevState => ({
            ...prevState,
            dtype: changeState
        }));
    }

    // Get types when component is mounting
    useEffect(() => {
        getTypes();
    }, []);

    return (
        <ATModal title={"Add transaction"} open={openTransaction} setOpen={setOpenTransaction}>

            {/*Buttons for choosing if transaction is income or not */}
            <View style={styles.modal_top_buttons}>
                <ATButton title={'Income'} callback={() =>changeIsIncome(true)} isActive={postData.isIncome}/>
                <ATButton title={'Outcome'} callback={() => changeIsIncome(false)} isActive={!postData.isIncome}/>
            </View>

            {/*Amount input*/}
            <ATInput  placeholder={"Amount"} onChange={handleAmountChange} keyboardType={'decimal-pad'}/>

            {/*Creating or choosing type of transaction*/}
            <View style={{flexDirection: 'row', marginVertical: 30}}>
                <Text style={{fontSize: 24}}>Create new category</Text>
                <Switch
                    onValueChange={changeNewType}
                    value={newType}
                />
            </View>
            {newType ?
                // Input for creating new type
                <ATInput  placeholder={"New category"} onChange={handleTypeChange} keyboardType={'default'}/>
                :
                // Picker for choosing existing type
                <View style={{alignItems:'center', marginVertical: 10}}>
                    <DropDownPicker
                        open={openTranAdd}
                        setOpen={setOpenTranAdd}
                        value={pickValue}
                        setValue={setPickValue}
                        items={types}
                        placeholder={"Pick category"}
                        style={{width: 270, height: 40}}
                    />
                </View>
            }

            <View style={styles.modal_bottom_button}>
                <ATButton title={'Add transaction'} callback={() => postTransaction()}/>
            </View>
        </ATModal>
    );
}

const styles = StyleSheet.create({
    modal_top_buttons:{
        width: 300,
        height: 50,
        paddingHorizontal: 5,
        flexDirection: 'row',
    },
    modal_bottom_button:{
        width: 270,
        height: 50,
        marginVertical: 10
    }
})