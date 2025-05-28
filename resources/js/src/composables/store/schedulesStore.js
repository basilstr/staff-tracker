import {defineStore} from "pinia";
import {APP_CONSTANTS} from '../../constants.js';

const debugMode = JSON.parse(import.meta.env.VITE_DEBUG_STORE);

export const dateFormatter = (date) => date?.toISOString().split('T')[0];

export const useSchedulesStore = defineStore('schedules', {
    state: () => {
        return {
            leftDate: null,
            rightDate: null,
            unit: null,
            indexes: [],
            schedules: {},
            notes: {},
            logs: {},
            statusesList: [],
        }
    },
    actions: {
        checkAndClearUnit(unit) {
            if (!unit || this.unit !== unit) {
                if (debugMode) console.log("STORAGE clear checkAndClearUnit(" + this.unit + " != " + unit + "): ", true)
                this.leftDate = null // ліва дата завантажених даних
                this.rightDate = null // права дата завантажених даних
                this.unit = null // юніт завантажених даних
                this.indexes = [] // масив дат завантажених даних
                this.schedules = {} // статуси в форматі {employeeId: statusId}
                this.notes = {} // примітки в форматі {employeeId: 'note'}
                this.logs = {} // хронологія змін в форматі {employeeId: ['log 1', 'log 2']...}
                this.statusesList = [] // наявні статуси в завантажених даних
                return true
            }
            return false
        },
        setSchedules(data) {
            for (const key in data) {
                this.checkAndClearUnit(Number(data[key].unit))

                let currentDate = new Date(key)
                if (!this.leftDate) this.leftDate = new Date(key)
                if (!this.rightDate) this.rightDate = new Date(key)

                if (this.leftDate.getTime() > currentDate.getTime()) this.leftDate = currentDate
                if (this.rightDate.getTime() < currentDate.getTime()) this.rightDate = currentDate

                this.unit = Number(data[key].unit)
                if(this.indexes.indexOf(key) < 0) this.indexes.push(key)
                this.schedules[key] = data[key].schedule
                Object.values(this.schedules[key]).forEach(value => {
                    this.statusesList.push(value);
                });
                this.notes[key] = data[key].note
                this.logs[key] = data[key].log
            }

            if(this.indexes.length) this.indexes.sort((a, b) => (new Date(a)).getTime() - (new Date(b)).getTime())
            this.statusesList = [...new Set(this.statusesList)]; // видалення дубляжів статусів з масиву всіх статусів

            if (debugMode) console.log("STORAGE setSchedules(unit: " + this.unit + ") leftDate: ", dateFormatter(this.leftDate))
            if (debugMode) console.log("STORAGE setSchedules(unit: " + this.unit + ") rightDate: ", dateFormatter(this.rightDate))
            if (debugMode) console.log("STORAGE setSchedules(unit: " + this.unit + ") indexes: ", this.indexes)
            if (debugMode) console.log("STORAGE setSchedules(unit: " + this.unit + ") schedules: ", this.schedules)
            if (debugMode) console.log("STORAGE setSchedules(unit: " + this.unit + ") note: ", this.notes)
            if (debugMode) console.log("STORAGE setSchedules(unit: " + this.unit + ") log: ", this.logs)
            if (debugMode) console.log("STORAGE setSchedules(unit: " + this.unit + ") statusesList: ", this.statusesList)
        },
        isEmptyByDate(unit, _date) {
            if (this.checkAndClearUnit(unit)) return true
            if (!this.leftDate || !this.rightDate) return true
            if(!_date)  return true

            const date = new Date(_date);
            date.setDate(date.getDate() - APP_CONSTANTS.FETCH_PERIOD_CHECK_DAY);
            if (date.getTime() < this.leftDate.getTime()) {
                return true
            }

            date.setDate(date.getDate() + 2 * APP_CONSTANTS.FETCH_PERIOD_CHECK_DAY);
            return date.getTime() > this.rightDate.getTime();
        },
        getRangeDates(unit, _date) {
            if(!_date || !unit) {
                return {
                    unit: null,
                    dateFrom: null,
                    dateTo: null,
                }
            }

            const lDate = new Date(_date);
            const rDate = new Date(_date);

            if (!this.leftDate || !this.rightDate) {
                lDate.setDate(lDate.getDate() - APP_CONSTANTS.FETCH_PERIOD_DAY)
                rDate.setDate(rDate.getDate() + 2 * APP_CONSTANTS.FETCH_PERIOD_DAY)
                return {
                    unit: unit,
                    dateFrom: dateFormatter(lDate),
                    dateTo: dateFormatter(rDate),
                }
            }

            lDate.setDate(lDate.getDate() - APP_CONSTANTS.FETCH_PERIOD_DAY)
            if (lDate.getTime() < this.leftDate.getTime()) {
                lDate.setTime(this.leftDate.getTime())
                rDate.setTime(this.leftDate.getTime())
                lDate.setDate(lDate.getDate() - APP_CONSTANTS.FETCH_PERIOD_DAY)
                rDate.setDate(rDate.getDate() - 1);
            } else {
                lDate.setTime(this.rightDate.getTime())
                rDate.setTime(this.rightDate.getTime())
                lDate.setDate(lDate.getDate() + 1);
                rDate.setDate(rDate.getDate() + APP_CONSTANTS.FETCH_PERIOD_DAY);
            }
            return {
                unit: unit,
                dateFrom: dateFormatter(lDate),
                dateTo: dateFormatter(rDate),
            }
        },
        getDateByIndex(index) {
            return this.indexes[index] ?? null
        },
        getLeftDateStr() {
            return dateFormatter(this.leftDate) ?? null
        },
        getRightDateStr() {
            return dateFormatter(this.rightDate) ?? null
        },
    }
})

