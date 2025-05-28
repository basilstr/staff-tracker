import {createPinia, setActivePinia} from 'pinia'
import {beforeEach, describe, expect, test} from 'vitest'
import {useUnitsStore} from '../../../src/composables/store/unitsStore'

describe('UNIT STORE setUnits', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    test('set empty data on nullable store', () => {
        const data = []

        const unitsStore = useUnitsStore();
        unitsStore.setUnits(data);

        expect(unitsStore.units).toStrictEqual([])

        expect(unitsStore.currentUnit).toBe(null)
    })

    test('set data on nullable store', () => {
        const data = [
            {id: 7, sort: 7, name: "Група № 4", edited: false},
            {id: 1, sort: 1, name: "Група № 1", edited: false},
            {id: 5, sort: 5, name: "Група № 3", edited: false},
            {id: 3, sort: 3, name: "Група № 2", edited: true},
            {id: 9, sort: 9, name: "Група № 5", edited: true}
        ]

        const unitsStore = useUnitsStore();
        unitsStore.setUnits(data);

        expect(unitsStore.units).toStrictEqual([
            {id: 7, sort: 7, name: "Група № 4", edited: false},
            {id: 1, sort: 1, name: "Група № 1", edited: false},
            {id: 5, sort: 5, name: "Група № 3", edited: false},
            {id: 3, sort: 3, name: "Група № 2", edited: true},
            {id: 9, sort: 9, name: "Група № 5", edited: true}
        ])

        expect(unitsStore.currentUnit).toBe(7)
    })

    test('set empty data on non empty store', () => {
        const unitsStore = useUnitsStore();

        unitsStore.units = [
            {id: 17, sort: 17, name: "Група № 14", edited: true},
            {id: 11, sort: 11, name: "Група № 11", edited: false},
            {id: 15, sort: 15, name: "Група № 13", edited: true},
        ]
        unitsStore.currentUnit = 15

        const data = []
        unitsStore.setUnits(data);
        expect(unitsStore.units).toStrictEqual([])
        expect(unitsStore.currentUnit).toBe(null)
    })

    test('set data on non empty unit and currentUnit is null', () => {
        const unitsStore = useUnitsStore();

        unitsStore.units = [
            {id: 17, sort: 17, name: "Група № 14", edited: true},
            {id: 11, sort: 11, name: "Група № 11", edited: false},
            {id: 15, sort: 15, name: "Група № 13", edited: true},
        ]
        unitsStore.currentUnit = null

        const data = [
            {id: 7, sort: 7, name: "Група № 4", edited: false},
            {id: 1, sort: 1, name: "Група № 1", edited: false},
            {id: 5, sort: 5, name: "Група № 3", edited: false},
            {id: 3, sort: 3, name: "Група № 2", edited: true},
            {id: 9, sort: 9, name: "Група № 5", edited: true}
        ]

        unitsStore.setUnits(data);
        expect(unitsStore.units).toStrictEqual([
            {id: 7, sort: 7, name: "Група № 4", edited: false},
            {id: 1, sort: 1, name: "Група № 1", edited: false},
            {id: 5, sort: 5, name: "Група № 3", edited: false},
            {id: 3, sort: 3, name: "Група № 2", edited: true},
            {id: 9, sort: 9, name: "Група № 5", edited: true}
        ])
        expect(unitsStore.currentUnit).toBe(7)
    })

    test('set data on non empty unit and currentUnit is not null and does not exist in new data', () => {
        const unitsStore = useUnitsStore();

        unitsStore.units = [
            {id: 17, sort: 17, name: "Група № 14", edited: true},
            {id: 11, sort: 11, name: "Група № 11", edited: false},
            {id: 15, sort: 15, name: "Група № 13", edited: true},
        ]
        unitsStore.currentUnit = 15

        const data = [
            {id: 7, sort: 7, name: "Група № 4", edited: false},
            {id: 1, sort: 1, name: "Група № 1", edited: false},
            {id: 5, sort: 5, name: "Група № 3", edited: false},
            {id: 3, sort: 3, name: "Група № 2", edited: true},
            {id: 9, sort: 9, name: "Група № 5", edited: true}
        ]

        unitsStore.setUnits(data);
        expect(unitsStore.units).toStrictEqual([
            {id: 7, sort: 7, name: "Група № 4", edited: false},
            {id: 1, sort: 1, name: "Група № 1", edited: false},
            {id: 5, sort: 5, name: "Група № 3", edited: false},
            {id: 3, sort: 3, name: "Група № 2", edited: true},
            {id: 9, sort: 9, name: "Група № 5", edited: true}
        ])
        expect(unitsStore.currentUnit).toBe(7)
    })

    test('set data on non empty unit and currentUnit is not null and exist in new data', () => {
        const unitsStore = useUnitsStore();

        unitsStore.units = [
            {id: 17, sort: 17, name: "Група № 14", edited: true},
            {id: 5, sort: 5, name: "Група № 3", edited: false},
            {id: 15, sort: 15, name: "Група № 13", edited: true},
        ]
        unitsStore.currentUnit = 5

        const data = [
            {id: 7, sort: 7, name: "Група № 4", edited: false},
            {id: 1, sort: 1, name: "Група № 1", edited: false},
            {id: 5, sort: 5, name: "Група № 3", edited: false},
            {id: 3, sort: 3, name: "Група № 2", edited: true},
            {id: 9, sort: 9, name: "Група № 5", edited: true}
        ]

        unitsStore.setUnits(data);
        expect(unitsStore.units).toStrictEqual([
            {id: 7, sort: 7, name: "Група № 4", edited: false},
            {id: 1, sort: 1, name: "Група № 1", edited: false},
            {id: 5, sort: 5, name: "Група № 3", edited: false},
            {id: 3, sort: 3, name: "Група № 2", edited: true},
            {id: 9, sort: 9, name: "Група № 5", edited: true}
        ])
        expect(unitsStore.currentUnit).toBe(5)
    })
})

describe('UNIT STORE isEmptyUnits()', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    test('check on empty store', () => {
        const unitsStore = useUnitsStore();

        expect(unitsStore.isEmptyUnits()).toBe(true)
    })

    test('check on store', () => {
        const unitsStore = useUnitsStore();
        unitsStore.units = [{id:1, name: 'unit'}]
        expect(unitsStore.isEmptyUnits()).toBe(false)
    })
})

describe('UNIT STORE setCurrentUnitId()', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    test('set null value', () => {
        const unitsStore = useUnitsStore();
        unitsStore.setCurrentUnitId(null)
        expect(unitsStore.currentUnit).toBe(0)
    })

    test('set number value', () => {
        const unitsStore = useUnitsStore();
        unitsStore.setCurrentUnitId(3)
        expect(unitsStore.currentUnit).toBe(3)
    })

    test('set string number value', () => {
        const unitsStore = useUnitsStore();
        unitsStore.setCurrentUnitId('3')
        expect(unitsStore.currentUnit).toBe(3)
    })

    test('set not number value', () => {
        const unitsStore = useUnitsStore();
        unitsStore.setCurrentUnitId('d')
        expect(unitsStore.currentUnit).toBe(null)
    })
})

describe('UNIT STORE getCurrentUnitId()', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    test('get value on empty store', () => {
        const unitsStore = useUnitsStore();

        expect(unitsStore.getCurrentUnitId()).toBe(null)
    })

    test('get value on non empty store', () => {
        const unitsStore = useUnitsStore();
        unitsStore.currentUnit = 4
        expect(unitsStore.getCurrentUnitId()).toBe(4)
    })
})

describe('UNIT STORE getCurrentUnit()', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    test('get value on empty store', () => {
        const unitsStore = useUnitsStore();

        expect(unitsStore.getCurrentUnit()).toBe(null)
    })

    test('get value on non empty store', () => {
        const unitsStore = useUnitsStore();
        unitsStore.currentUnit = 3
        unitsStore.units = [{id:3, name: 'unit'}]
        expect(unitsStore.getCurrentUnit()).toStrictEqual({id:3, name: 'unit'})
    })
})
