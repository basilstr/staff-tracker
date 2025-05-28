import {defineStore} from "pinia";

const debugMode = JSON.parse(import.meta.env.VITE_DEBUG_STORE);

export const useRanksStore = defineStore('ranks', {
    state: () => {
        return { ranks: [] }
    },
    actions: {
        setRanks(data) {
            this.ranks = data;
            if (debugMode) console.log('STORAGE setRanks(): ', this.ranks)
        },
        isEmptyRanks() {
            if (debugMode) console.log('STORAGE isEmptyRanks(): ', this.ranks.length === 0)
            return this.ranks.length === 0;
        },
    },
})

