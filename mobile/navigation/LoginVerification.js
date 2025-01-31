/**
 * File for login verification(component)
 *
 * @author Albert Tikaiev
 */

import {useUser} from "../userstate/UserContext";
import BottomBar from "./BottomBar";
import Login from "../screens/Login";

/**
 *  This component will decide what to render : application menu or login screen
 *  by checking on user context
 */
export default function LoginVerification() {
    const {user}=useUser();

    //If user is null that means he/she has to log in
    return(
        user ? <BottomBar/> : <Login/>
    )
}