import getConnect from "./getConnect.js";

const debugMode = JSON.parse(import.meta.env.VITE_DEBUG_NETWORK);

export const API_URL_GET_STATUSES = (unit) => `/api/statuses/${unit}`;
export const API_URL_POST_STATUSES = (unit) => `/api/statuses/${unit}`;

export default {
    async getStatuses(unit, signal) {
        if (debugMode) console.log("start getStatuses(unit: " + unit + ")")
        let res = await getConnect.get(API_URL_GET_STATUSES(unit), signal);
        if (debugMode) console.log("stop getStatuses(unit: " + unit + ")", res)
        return res
    },
    async postStatuses(unit, statuses, signal) {
        if (debugMode) console.log("start postStatuses(unit: " + unit + ")", statuses)
        let res = await getConnect.post(API_URL_POST_STATUSES(unit), statuses, signal);
        if (debugMode) console.log("stop postStatuses(unit: " + unit + ")", res)
        return res
    },
};
