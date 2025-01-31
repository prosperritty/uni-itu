/**
 * File for transaction list screen
 * On this screen user can see all transactions and filter them
 * Can be entered from main finance screen
 *
 * @author Albert Tikaiev
 */

import {View, FlatList} from "react-native";
import Transaction from "../components/Transaction";
import {useEffect, useState} from "react";
import axios from "axios";
import config from "../config";
import ATButton from "../components/ATButton";
import DropDownPicker from "react-native-dropdown-picker";
import ErrorMessage from "../components/ErrorMessage";
import HorizontalBreak from "../components/HorizontalBreak";

export default function TransactionList() {
    //Transaction list state
    const [transactions, setTransactions] = useState([]);

    //States for picker
    const [types, setTypes] = useState([]);
    const[openTranFil, setOpenTranFil] = useState(false);

    //Filter states
    const [tranType, setTranType] = useState("all");
    const [filter, setFilter] = useState("");

    /**
     * Function to get current list of transaction types for filtering 'By type'
     * Also add value of 'No filter' and filter 'By amount'
     */
    async function getTypes () {
        const request = await axios.get(config.api+"/type/transaction");
        setTypes(
            [
                {label: 'No filter', value: ""},
                {label: 'By amount', value: "amount"},
                ...request.data.map(item => ({
                label: `By type: ${item.name}`,
                value: item.name
            }))
            ]
        )
    }

    /**
     * Function to get all transactions with filtration
     */
    async function getAllTransactions() {
        try{
            const request = await axios.get(config.api+`/transactions?trantype=${tranType}&filter=${filter}`);
            setTransactions(request.data);
        }catch (error) {
            ErrorMessage("Failed to get all transactions");
        }
    }

    useEffect(() => {
        getTypes();
    }, []);

    useEffect(() => {
        getAllTransactions();
    }, [tranType, filter]);


    return (
        <View style={{flex: 1}}>
            <View>

                {/*Transaction income/outcome filter buttons*/}
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <ATButton title={'All'} callback={() => setTranType("all")} isActive={tranType === "all"}/>
                    <ATButton title={'Income'} callback={() => setTranType("income")} isActive={tranType === "income"}/>
                    <ATButton title={'Outcome'} callback={() => setTranType("outcome")} isActive={tranType === "outcome"}/>
                </View>
                <HorizontalBreak/>

                {/*Transaction type filter picker*/}
                <DropDownPicker
                    open={openTranFil}
                    setOpen={setOpenTranFil}
                    value={filter}
                    setValue={setFilter}
                    items={types}
                    placeholder={"No filter"}
                />
                <HorizontalBreak/>

            </View>

            {/*Scrollable list of transactions*/}
            <FlatList data={transactions} renderItem={({item}) => <Transaction transaction={item} last={false} updateTransactions={getAllTransactions}/>}/>

        </View>
    );
}