import getConnect from "./getConnect.js";

const debugMode = JSON.parse(import.meta.env.VITE_DEBUG_NETWORK);

export const API_URL_GET_EMPLOYEES = (unit) => `/api/employees/${unit}`; // список всіх Employees
export const API_URL_GET_EMPLOYEE = (id) => `/api/employee/${id}`; // список конкретного Employee
export const API_URL_PUT_EMPLOYEE = (id) => `/api/employee/${id}`; // оновлення даних Employee
export const API_URL_POST_EMPLOYEES = (unit) => `/api/employees/${unit}`; // створення Employee
export const API_URL_DELETE_EMPLOYEE = (id) => `/api/employee/${id}`; // видалення Employee
export const API_URL_GET_RANKS = () => `/api/ranks`; // отримання рангів для Employee
export const API_URL_GET_INVITE = (id) => `/api/employee/${id}/invite`; // отримання invite одного Employee

export default {
    async getEmployees(unit, signal) {
        if (debugMode) console.log("start getEmployees(unitId: "+unit+")")
        let res = await getConnect.get(API_URL_GET_EMPLOYEES(unit), signal);
        if (debugMode) console.log("stop getEmployees(unitId: "+unit+")", res)
        return res
    },
    async getEmployee(id, signal) {
        if (debugMode) console.log("start getEmployee(id: "+id+")")
        let res = await getConnect.get(API_URL_GET_EMPLOYEE(id), signal);
        if (debugMode) console.log("stop getEmployee(id: "+id+")", res)
        return res
    },
    async putEmployee(id, employee, signal) {
        if (debugMode) console.log("start putEmployee(id: " + id + ")", employee)
        let res = await getConnect.put(API_URL_PUT_EMPLOYEE(id), employee, signal);
        if (debugMode) console.log("stop putEmployee(id: " + id + ")", res)
        return res
    },
    async postEmployee(unit, data, signal) {
        if (debugMode) console.log("start postEmployee(unit: "+unit+")", data)
        let res = await getConnect.post(API_URL_POST_EMPLOYEES(unit), data, signal);
        if (debugMode) console.log("stop postEmployee(unit: "+unit+")", res)
        return res
    },
    async deleteEmployee(id, signal) {
        if (debugMode) console.log("start deleteEmployee(id: " + id + ")")
        let res = await getConnect.delete(API_URL_DELETE_EMPLOYEE(id), signal);
        if (debugMode) console.log("stop deleteEmployee(id: " + id + ")")
        return res
    },
    async getRanks(signal) {
        if (debugMode) console.log("start getRanks()")
        let res = await getConnect.get(API_URL_GET_RANKS(), signal);
        if (debugMode) console.log("stop getRanks()", res)
        return res
    },
    async getInvite(id, signal) {
        if (debugMode) console.log("start getInvite(id: " + id + ")")
        let res = await getConnect.get(API_URL_GET_INVITE(id), signal);
        if (debugMode) console.log("stop getInvite(id: " + id + ")", res)
        return res
    },
};
