import getConnect from "./getConnect.js";

const debugMode = JSON.parse(import.meta.env.VITE_DEBUG_NETWORK);

export const API_URL_GET_UNITS = () => `/api/units`;
export const API_URL_POST_UNITS = () =>`/api/units`;

export default {
    async getUnits(signal) {
        if (debugMode) console.log("start getUnits()")
        let res = await getConnect.get(API_URL_GET_UNITS(), signal);
        if (debugMode) console.log("stop getUnits()", res)
        return res
    },
    async postUnits(units, signal) {
        if (debugMode) console.log("start postUnits()", units)
        let res = await getConnect.post(API_URL_POST_UNITS(), units, signal);
        if (debugMode) console.log("stop postUnits()", res)
        return res
    },
};
