import getConnect from "./getConnect.js";

const debugMode = JSON.parse(import.meta.env.VITE_DEBUG_NETWORK);

export const API_URL_FETCH_SCHEDULES = (unit, dateFrom, dateTo) => `/api/schedule/unit/${unit}/${dateFrom}/${dateTo}`;
export const API_URL_SET_GROUP = (unit, dateFrom, dateTo) => `/api/schedule/group/${unit}/${dateFrom}/${dateTo}`;
export const API_URL_SET_EMPLOYEE = (employee_id, dateFrom, dateTo) => `/api/schedule/employee/${employee_id}/${dateFrom}/${dateTo}`;

export default {
    async getSchedules(unit, dateFrom, dateTo, signal) {
        if (debugMode) console.log("start getSchedules:", API_URL_FETCH_SCHEDULES(unit, dateFrom, dateTo))
        let res = await getConnect.get(API_URL_FETCH_SCHEDULES(unit, dateFrom, dateTo), signal);
        if (debugMode) console.log("stop getSchedules(unit: " + unit + ")", res)
        return res
    },
    async setGroup(unit, dateFrom, dateTo, data, signal) {
        if (debugMode) console.log("start setGroup:", API_URL_SET_GROUP(unit, dateFrom, dateTo), data)
        let res = await getConnect.post(API_URL_SET_GROUP(unit, dateFrom, dateTo), data, signal);
        if (debugMode) console.log("stop setGroup(unit: " + unit + ")", res)
        return res
    },
    async setEmployee(employee_id, dateFrom, dateTo, data, signal) {
        if (debugMode) console.log("start setEmployee(employeeId: " + API_URL_SET_EMPLOYEE(employee_id, dateFrom, dateTo), data)
        let res = await getConnect.post(API_URL_SET_EMPLOYEE(employee_id, dateFrom, dateTo), data, signal);
        if (debugMode) console.log("stop setEmployee(employeeId: " + employee_id + ")", res)
        return res
    },
};
