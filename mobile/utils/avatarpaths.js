/**
 * Util for getting profile picture name
 *
 * @author Albert Tikaiev
 */

const avatars = {
    "1.png" : require("../assets/1.png"),
    "2.png" : require("../assets/2.png"),
    "3.png" : require("../assets/3.png"),
    "4.png" : require("../assets/4.png"),
}

export default function getAvatarRequire(name){
    return avatars[name];
}