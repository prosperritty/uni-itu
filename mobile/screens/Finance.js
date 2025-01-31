/**
 * File for main finance screen
 *
 * @author Albert Tikaiev
 */

import {View, Text, ScrollView, StyleSheet} from "react-native";
import {useEffect, useState} from "react";
import axios from "axios";
import config from "../config";
import Budget from "../components/Budget";
import Transaction from "../components/Transaction";
import JarFinance from "../components/JarFinance";
import ATButton from "../components/ATButton";
import ModalTransaction from "../components/ModalTransaction";
import ModalStatistics from "../components/ModalStatistics";
import ErrorMessage from "../components/ErrorMessage";
import HorizontalBreak from "../components/HorizontalBreak";

/**
 * Main screen for finance part of application
 * @param navigation from stack navigator
 */
export default function Finance({navigation}) {
    //Data states
    const [transaction, setTransaction] = useState({});
    const [jars, setJars] = useState([{}]);
    const [budget, setBudget] = useState();

    //Modal open states
    const [openTransaction, setOpenTransaction] = useState(false);
    const [openStatistics, setOpenStatistics] = useState(false);

    /**
     * Function to get current budget
     */
    async function getBudget() {
        try {
            const request = await axios.get(config.api + "/budget")
            setBudget(request.data.amount);
        }catch (error) {
            ErrorMessage("Failed to get budget amount");
        }
    }

    /**
     * Function to get last transaction
     */
    async function getLastTransaction() {
        try {
            const request = await axios.get(config.api + "/transaction_last");
            setTransaction(request.data);
        } catch (error) {
            ErrorMessage("Failed to get last transaction");
        }
    }

    /**
     * Function to get list of jars
     */
    async function getJars() {
        try {
            const request = await axios.get(config.api+"/jars");
            await setJars(request.data);
        } catch (error) {
            ErrorMessage("Failed to get jars");
        }
    }

    /**
     * Function to update all information on screen after adding amount ot jar
     */
    async function updateAddJar() {
        await getBudget();
        await getLastTransaction();
        await getJars();
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getBudget();
            getLastTransaction();
            getJars();
        });

        return unsubscribe;
    }, [navigation]);

    return (
        <ScrollView>
            <View style={styles.container}>
                {/*Budget component ot top*/}
                <View style={{width:'100%'}}>
                    <Budget amount={budget} title={"Current budget"} callback={getBudget} />
                </View>

                {/*Last transaction with component of transaction*/}
                <View style={styles.name_container}>
                    <Text style={{color: '#ffffff', fontSize: 20}}>Last transaction</Text>
                </View>
                <View style={{width:'100%'}}>
                    <Transaction transaction={transaction} last={true}/>
                </View>

                {/*Transactions and budget buttons*/}
                <View style={styles.middle_buttons}>
                    <View style={styles.left_buttons}>
                        <ATButton title={'See all history'} callback={() => navigation.navigate("TransactionList")}/>
                        <ATButton title={'See statistics'} callback={() => setOpenStatistics(true)}/>
                    </View>
                    <View style={styles.right_buttons}>
                        <ATButton title={'Add'} callback={() => setOpenTransaction(true)}/>
                    </View>
                </View>
                <ModalTransaction openTransaction={openTransaction} setOpenTransaction={setOpenTransaction}
                    updateBudget={getBudget} updateLastTransaction={getLastTransaction}/>
                <ModalStatistics openStatistics={openStatistics} setOpenStatistics={setOpenStatistics}/>

                <HorizontalBreak/>

                {/*Jar list*/}
                {jars ?
                    <View style={{width:'100%'}}>
                        {jars.map((jar, index) =>
                            <JarFinance jar={jar} key={index}
                                        navigatejar={() => navigation.navigate("Jar", {jar : jar,})}
                                        updateCallback={updateAddJar}
                            />
                        )}
                    </View>
                    :
                    <Text style={{fontSize: 24}}>No jars available</Text>
                }

                {/*Button for creation Jar*/}
                <View style={{width:'100%'}}>
                    <ATButton title={'Create jar'} callback={() => navigation.navigate("JarCreation")} />
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
        container: {
            flex: 1,
            padding: 11,
            justifyContent: 'center',
            alignItems: 'center',
        },
        name_container: {
            flex: 1,
            width: '100%',
            backgroundColor: '#283618',
            justifyContent: 'center',
            padding: 5,
            borderTopLeftRadius: 13,
            borderTopRightRadius: 13,
        },
        data_container: {
            flex: 1,
            height: 150,
            width: '100%',
            backgroundColor: '#FEFAE0',
            justifyContent: 'center',
            alignItems: 'center',
            borderBottomLeftRadius: 13,
            borderBottomRightRadius: 13,
        },
        middle_buttons:{
            flex:1,
            flexDirection: 'row',
        },
        left_buttons: {
            flex:0.7,
        },
        right_buttons: {
            flex:0.3,
        },
    }
);