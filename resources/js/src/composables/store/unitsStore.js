import {defineStore} from "pinia";

const debugMode = JSON.parse(import.meta.env.VITE_DEBUG_STORE);

export const useUnitsStore = defineStore('units', {
    state: () => {
        return {
            units: [],
            currentUnit: null,
        }
    },
    actions: {
        setUnits(data) {
            this.units = data;
            if (this.units.length) {
                if (this.currentUnit === null) {
                    this.currentUnit = data[0].id
                } else {
                    let unit = this.units.find(item => item.id === this.currentUnit)
                    if (!unit) {
                        this.currentUnit = data[0].id
                    }
                }
            } else {
                this.currentUnit = null
            }
            if (debugMode) console.log('STORAGE setUnits(): currentUnit: ' + this.currentUnit + '; data: ', data)
        },
        isEmptyUnits() {
            if (debugMode) console.log('STORAGE isEmptyUnits(): ', this.units.length === 0)
            return this.units.length === 0;
        },
        setCurrentUnitId(id) {
            this.currentUnit = isNaN(Number(id)) ? null : Number(id);
            if (debugMode) console.log('STORAGE setCurrentUnitId(' + this.currentUnit + ')')
        },
        getCurrentUnitId() {
            if (debugMode) console.log('STORAGE getCurrentUnitId(): ' + this.currentUnit)
            return this.currentUnit;
        },
        getCurrentUnit() {
            if (debugMode) console.log('STORAGE getCurrentUnit(unit: ' + this.currentUnit + '): ', this.units?.find(item => item.id === this.currentUnit))
            return this.units.find(item => item.id === this.currentUnit) ?? null;
        },
    },
})

