import getConnect from "./getConnect.js";

const debugMode = JSON.parse(import.meta.env.VITE_DEBUG_NETWORK);

export const API_URL_POST_LOGIN = () => `/api/login`;
export const API_URL_PUT_USER = () => `/api/user`; // оновлення даних користувача
export const API_URL_DELETE_USER = () => `/api/user`; // видалення користувача
export const API_URL_GET_INVITE = () => `/api/user/invite`; // отримання invite користувача
export const API_URL_POST_JOIN = () => `/api/user/join`; // приєднання по invite користувача

export default {
    async login(data, signal) {
        if (debugMode) console.log("start login()", data)
        let res = await getConnect.post(API_URL_POST_LOGIN(), data, signal);
        if (debugMode) console.log("stop login()", res)
        return res
    },
    async saveUser(data, signal) {
        if (debugMode) console.log("start saveUser()", data)
        let res = await getConnect.put(API_URL_PUT_USER(), data, signal);
        if (debugMode) console.log("stop saveUser()", res)
        return res
    },
    async deleteUser(signal) {
        if (debugMode) console.log("start deleteUser()")
        let res = await getConnect.delete(API_URL_DELETE_USER(), signal);
        if (debugMode) console.log("stop deleteUser()")
        return res
    },
    async getInvite(signal) {
        if (debugMode) console.log("start getInvite()")
        let res = await getConnect.get(API_URL_GET_INVITE(), signal);
        if (debugMode) console.log("stop getInvite()", res)
        return res
    },
    async sendInvite(data, signal) {
        if (debugMode) console.log("start sendInvite()", data)
        let res = await getConnect.post(API_URL_POST_JOIN(), data, signal);
        if (debugMode) console.log("stop sendInvite()", res)
        return res
    },
};
