import {defineStore} from "pinia";
import {APP_CONSTANTS} from '../../constants.js';

const debugMode = JSON.parse(import.meta.env.VITE_DEBUG_STORE);

export const dateFormatter = (date) => date?.toISOString().split('T')[0];

export const useReportStore = defineStore('report', {
    state: () => {
        return {
            unit: null,
            dateFrom: null,
            dateTo: null,
            reportData: {},
            statusesList: [],
        }
    },
    actions: {
        setReport(data) {
            this.clearReport()

            if (data.unit) this.unit = Number(data.unit)
            if (data.dateFrom) this.dateFrom = new Date(data.dateFrom)
            if (data.dateTo) this.dateTo = new Date(data.dateTo)
            if (data.reportData) this.reportData = data.reportData

            const keySet = new Set();

            for (const key in this.reportData) {
                const inner = this.reportData[key];
                for (const innerKey in inner) {
                    keySet.add(Number(innerKey)); // додаємо числовий ключ
                }
            }

            this.statusesList = Array.from(keySet).sort((a, b) => a - b);

            if (debugMode) console.log("STORAGE setReport(unit: " + this.unit + ") dateFrom: ", dateFormatter(this.dateFrom))
            if (debugMode) console.log("STORAGE setReport(unit: " + this.unit + ") dateTo: ", dateFormatter(this.dateTo))
            if (debugMode) console.log("STORAGE setReport(unit: " + this.unit + ") reportData: ", this.reportData)
            if (debugMode) console.log("STORAGE setReport(unit: " + this.unit + ") statusesList: ", this.statusesList)
        },
        isEmptyReport(_unit, _dateFrom, _dateTo) {
            if (!this.dateFrom || !this.dateTo || !this.unit) return true
            if (!_unit || !_dateFrom || !_dateTo) return true

            const dateFrom = new Date(_dateFrom);
            const dateTo = new Date(_dateTo);

            return _unit !== this.unit || dateFrom.getTime() !== this.dateFrom.getTime() || dateTo.getTime() !== this.dateTo.getTime();
        },
        clearReport() {
            this.unit = null
            this.dateFrom = null
            this.dateTo = null
            this.reportData = {}
            this.statusesList = []
        }
    }
})

