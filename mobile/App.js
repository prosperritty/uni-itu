/**
 * Main file of application and main entry of application
 *
 * @author Albert Tikaiev
 * @author Olha Tomylko
 */

import Toast from 'react-native-toast-message';
import {NavigationContainer} from "@react-navigation/native";
import {UserContextProvider} from "./userstate/UserContext";
import LoginVerification from "./navigation/LoginVerification";
import {toastConfig} from "./components/ErrorMessage";

export default function App() {

  return (
      <UserContextProvider>
            <NavigationContainer>
              <LoginVerification/>
                <Toast config={toastConfig}/>
            </NavigationContainer>
      </UserContextProvider>
  );
}
