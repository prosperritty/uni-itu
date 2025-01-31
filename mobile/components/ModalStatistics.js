/**
 * File for modal window displaying statistics for current month
 *
 * @author Albert Tikaiev
 */

import {Text, StyleSheet, View} from "react-native";
import config from "../config";
import {useEffect, useState} from "react";
import axios from "axios";
import ATModal from "./ATModal";
import ErrorMessage from "./ErrorMessage";

/**
 * @param openStatistics Modal open state
 * @param setOpenStatistics Function to change modal open state
 * @returns {JSX.Element}
 */
export default function ModalTransaction({openStatistics, setOpenStatistics}) {
    //Object holding all statistics
    const [stats, setStats] = useState({
        total: null,
        total_income: null,
        total_outcome: null,
    });

    /**
     * Function to get statistics for this month
     */
    async function getStats() {
        try{
            const request = await axios.get(config.api+"/budget/statistics");
            setStats(request.data);
        } catch (error) {
            ErrorMessage("Failed to get statistics");
        }
    }

    useEffect(() => {
        getStats();
    }, [openStatistics]);

    return (
        <ATModal title={"Statistics"} open={openStatistics} setOpen={setOpenStatistics}>

            <View style={styles.content}>
                <Text style={styles.text_large}>Total</Text>
                <Text style={styles.text_large}>{stats.total}</Text>
            </View>

            <View style={styles.content}>
                <Text style={[styles.text_large, {color : config.colors.lighter_green}]}>Total income</Text>
                <Text style={styles.text_large}>{stats.total_income}</Text>
            </View>

            <View style={styles.content}>
                <Text style={[styles.text_large, {color : config.colors.error}]}>Total outcome</Text>
                <Text style={styles.text_large}>{stats.total_outcome}</Text>
            </View>

        </ATModal>
    );
}

const styles = StyleSheet.create({
    text_large:{
        fontSize: 24,
    },
    content:{
        justifyContent:'center',
        alignItems:'center',
        marginBottom:20,
    }
})