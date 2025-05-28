import getConnect from "./getConnect.js";

const debugMode = JSON.parse(import.meta.env.VITE_DEBUG_NETWORK);

export const API_URL_GET_REPORT = (unit, dateFrom, dateTo) => `/api/report/statuses/${unit}/${dateFrom}/${dateTo}`;

export default {
    async getReport(unit, dateFrom, dateTo, signal) {
        if (debugMode) console.log("start getReport(unit: " + unit + ")")
        let res = await getConnect.get(API_URL_GET_REPORT(unit, dateFrom, dateTo), signal);
        if (debugMode) console.log("stop getReport(unit: " + unit + ")", res)
        return res
    },
};
