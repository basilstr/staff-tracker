import {defineStore} from "pinia";

const debugMode = JSON.parse(import.meta.env.VITE_DEBUG_STORE);

export const useStatusesStore = defineStore('statuses', {
    state: () => {
        return {
            unit: null,
            statuses: [],
        }
    },
    actions: {
        setStatuses(unit, data) {
            this.unit = unit;
            this.statuses = data;
            if (debugMode) console.log('STORAGE setStatuses(unit: ' + unit + '): ', this.statuses)
        },
        clearStatuses() {
            this.unit = null;
            this.statuses = [];
            if (debugMode) console.log('STORAGE clearStatuses()')
        },
        isEmptyStatuses(unit) {
            if (debugMode) console.log('STORAGE isEmptyStatuses(unit: ' + unit + '): ', this.statuses.length === 0 || this.unit !== unit)
            return this.statuses.length === 0 || this.unit !== unit;
        },
    },
})

