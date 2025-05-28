import {createPinia, setActivePinia} from 'pinia'
import {beforeEach, describe, expect, test} from 'vitest'
import {useSchedulesStore, dateFormatter} from '../../../src/composables/store/schedulesStore'
import {APP_CONSTANTS} from '../../../src/constants.js';

describe('SCHEDULES STORE', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    // checkAndClearUnit
    test('check and clear on nullable store', () => {
        const schedulesStore = useSchedulesStore();

        schedulesStore.checkAndClearUnit(null)
        expect(schedulesStore.leftDate).toBe(null)
        expect(schedulesStore.rightDate).toBe(null)
        expect(schedulesStore.unit).toBe(null)
        expect(schedulesStore.indexes).toStrictEqual([])
        expect(schedulesStore.schedules).toStrictEqual({})
        expect(schedulesStore.notes).toStrictEqual({})
        expect(schedulesStore.logs).toStrictEqual({})
        expect(schedulesStore.statusesList).toStrictEqual([])
    })

    test('check and clear on store where units are equal', () => {
        const schedulesStore = useSchedulesStore();

        schedulesStore.leftDate = new Date('2025-12-25')
        schedulesStore.rightDate = new Date('2025-12-29')
        schedulesStore.unit = 3
        schedulesStore.indexes = ['2025-12-25', '2025-12-26', '2025-12-27', '2025-12-28', '2025-12-29']
        schedulesStore.schedules = {
            '2025-12-25': {1001: 1, 1002: 2, 1003: 3},
            '2025-12-26': {1001: 2, 1002: 3, 1003: 4},
            '2025-12-27': {1001: 3, 1002: 4, 1003: 5},
            '2025-12-28': {1001: 4, 1002: 5, 1003: 1},
            '2025-12-29': {1001: 5, 1002: 1, 1003: 2},
        }
        schedulesStore.notes = {
            '2025-12-25': {1001: '1123', 1002: 'gf2'},
            '2025-12-26': {1001: '2asdf', 1002: 'fg3'},
            '2025-12-27': {1001: '3asd', 1002: 'ggf4'},
            '2025-12-28': {1001: '4ss', 1002: 'gfg5'},
            '2025-12-29': {1001: '5dd', 1002: 'g1'},
        }
        schedulesStore.logs = {
            '2025-12-25': {1001: ['1123', 'gf2']},
            '2025-12-26': {1001: ['2asdf', 'fg3']},
            '2025-12-27': {1001: ['3asd', 'ggf4']},
            '2025-12-28': {1001: ['4ss', 'gfg5']},
            '2025-12-29': {1001: ['5dd', 'g1']},
        }
        schedulesStore.statusesList = [1, 2, 3, 4, 5]

        schedulesStore.checkAndClearUnit(3)

        expect(schedulesStore.leftDate).toStrictEqual(new Date('2025-12-25'))
        expect(schedulesStore.rightDate).toStrictEqual(new Date('2025-12-29'))
        expect(schedulesStore.unit).toBe(3)
        expect(schedulesStore.indexes).toStrictEqual(['2025-12-25', '2025-12-26', '2025-12-27', '2025-12-28', '2025-12-29'])
        expect(schedulesStore.schedules).toStrictEqual({
            '2025-12-25': {1001: 1, 1002: 2, 1003: 3},
            '2025-12-26': {1001: 2, 1002: 3, 1003: 4},
            '2025-12-27': {1001: 3, 1002: 4, 1003: 5},
            '2025-12-28': {1001: 4, 1002: 5, 1003: 1},
            '2025-12-29': {1001: 5, 1002: 1, 1003: 2},
        })
        expect(schedulesStore.notes).toStrictEqual({
            '2025-12-25': {1001: '1123', 1002: 'gf2'},
            '2025-12-26': {1001: '2asdf', 1002: 'fg3'},
            '2025-12-27': {1001: '3asd', 1002: 'ggf4'},
            '2025-12-28': {1001: '4ss', 1002: 'gfg5'},
            '2025-12-29': {1001: '5dd', 1002: 'g1'},
        })
        expect(schedulesStore.logs).toStrictEqual({
            '2025-12-25': {1001: ['1123', 'gf2']},
            '2025-12-26': {1001: ['2asdf', 'fg3']},
            '2025-12-27': {1001: ['3asd', 'ggf4']},
            '2025-12-28': {1001: ['4ss', 'gfg5']},
            '2025-12-29': {1001: ['5dd', 'g1']},
        })
        expect(schedulesStore.statusesList).toStrictEqual([1, 2, 3, 4, 5])
    })

    test('check and clear on store where units are not equal', () => {
        const schedulesStore = useSchedulesStore();

        schedulesStore.leftDate = new Date('2025-12-25')
        schedulesStore.rightDate = new Date('2025-12-29')
        schedulesStore.unit = 3
        schedulesStore.indexes = ['2025-12-25', '2025-12-26', '2025-12-27', '2025-12-28', '2025-12-29']
        schedulesStore.schedules = {
            '2025-12-25': {1001: 1, 1002: 2, 1003: 3},
            '2025-12-26': {1001: 2, 1002: 3, 1003: 4},
            '2025-12-27': {1001: 3, 1002: 4, 1003: 5},
            '2025-12-28': {1001: 4, 1002: 5, 1003: 1},
            '2025-12-29': {1001: 5, 1002: 1, 1003: 2},
        }
        schedulesStore.notes = {
            '2025-12-25': {1001: '1123', 1002: 'gf2'},
            '2025-12-26': {1001: '2asdf', 1002: 'fg3'},
            '2025-12-27': {1001: '3asd', 1002: 'ggf4'},
            '2025-12-28': {1001: '4ss', 1002: 'gfg5'},
            '2025-12-29': {1001: '5dd', 1002: 'g1'},
        }
        schedulesStore.logs = {
            '2025-12-25': {1001: ['1123', 'gf2']},
            '2025-12-26': {1001: ['2asdf', 'fg3']},
            '2025-12-27': {1001: ['3asd', 'ggf4']},
            '2025-12-28': {1001: ['4ss', 'gfg5']},
            '2025-12-29': {1001: ['5dd', 'g1']},
        }
        schedulesStore.statusesList = [1, 2, 3, 4, 5]

        schedulesStore.checkAndClearUnit(5)

        expect(schedulesStore.leftDate).toBe(null)
        expect(schedulesStore.rightDate).toBe(null)
        expect(schedulesStore.unit).toBe(null)
        expect(schedulesStore.indexes).toStrictEqual([])
        expect(schedulesStore.schedules).toStrictEqual({})
        expect(schedulesStore.notes).toStrictEqual({})
        expect(schedulesStore.logs).toStrictEqual({})
        expect(schedulesStore.statusesList).toStrictEqual([])
    })

    // setSchedules
    test('set null data on empty store', () => {
        const schedulesStore = useSchedulesStore();

        schedulesStore.setSchedules(null)
        expect(schedulesStore.leftDate).toBe(null)
        expect(schedulesStore.rightDate).toBe(null)
        expect(schedulesStore.unit).toBe(null)
        expect(schedulesStore.indexes).toStrictEqual([])
        expect(schedulesStore.schedules).toStrictEqual({})
        expect(schedulesStore.notes).toStrictEqual({})
        expect(schedulesStore.logs).toStrictEqual({})
        expect(schedulesStore.statusesList).toStrictEqual([])
    })

    test('set null data on non empty store', () => {
        const schedulesStore = useSchedulesStore();

        schedulesStore.leftDate = new Date('2025-12-25')
        schedulesStore.rightDate = new Date('2025-12-29')
        schedulesStore.unit = 3
        schedulesStore.indexes = ['2025-12-25', '2025-12-26', '2025-12-27', '2025-12-28', '2025-12-29']
        schedulesStore.schedules = {
            '2025-12-25': {1001: 1, 1002: 2, 1003: 3},
            '2025-12-26': {1001: 2, 1002: 3, 1003: 4},
            '2025-12-27': {1001: 3, 1002: 4, 1003: 5},
            '2025-12-28': {1001: 4, 1002: 5, 1003: 1},
            '2025-12-29': {1001: 5, 1002: 1, 1003: 2},
        }
        schedulesStore.notes = {
            '2025-12-25': {1001: '1123', 1002: 'gf2'},
            '2025-12-26': {1001: '2asdf', 1002: 'fg3'},
            '2025-12-27': {1001: '3asd', 1002: 'ggf4'},
            '2025-12-28': {1001: '4ss', 1002: 'gfg5'},
            '2025-12-29': {1001: '5dd', 1002: 'g1'},
        }
        schedulesStore.logs = {
            '2025-12-25': {1001: ['1123', 'gf2']},
            '2025-12-26': {1001: ['2asdf', 'fg3']},
            '2025-12-27': {1001: ['3asd', 'ggf4']},
            '2025-12-28': {1001: ['4ss', 'gfg5']},
            '2025-12-29': {1001: ['5dd', 'g1']},
        }
        schedulesStore.statusesList = [1, 2, 3, 4, 5]

        schedulesStore.setSchedules(null)

        expect(schedulesStore.leftDate).toStrictEqual(new Date('2025-12-25'))
        expect(schedulesStore.rightDate).toStrictEqual(new Date('2025-12-29'))
        expect(schedulesStore.unit).toBe(3)
        expect(schedulesStore.indexes).toStrictEqual(['2025-12-25', '2025-12-26', '2025-12-27', '2025-12-28', '2025-12-29'])
        expect(schedulesStore.schedules).toStrictEqual({
            '2025-12-25': {1001: 1, 1002: 2, 1003: 3},
            '2025-12-26': {1001: 2, 1002: 3, 1003: 4},
            '2025-12-27': {1001: 3, 1002: 4, 1003: 5},
            '2025-12-28': {1001: 4, 1002: 5, 1003: 1},
            '2025-12-29': {1001: 5, 1002: 1, 1003: 2},
        })
        expect(schedulesStore.notes).toStrictEqual({
            '2025-12-25': {1001: '1123', 1002: 'gf2'},
            '2025-12-26': {1001: '2asdf', 1002: 'fg3'},
            '2025-12-27': {1001: '3asd', 1002: 'ggf4'},
            '2025-12-28': {1001: '4ss', 1002: 'gfg5'},
            '2025-12-29': {1001: '5dd', 1002: 'g1'},
        })
        expect(schedulesStore.logs).toStrictEqual({
            '2025-12-25': {1001: ['1123', 'gf2']},
            '2025-12-26': {1001: ['2asdf', 'fg3']},
            '2025-12-27': {1001: ['3asd', 'ggf4']},
            '2025-12-28': {1001: ['4ss', 'gfg5']},
            '2025-12-29': {1001: ['5dd', 'g1']},
        })
        expect(schedulesStore.statusesList).toStrictEqual([1, 2, 3, 4, 5])
    })

    test('set data on empty store', () => {
        const data = {
            '2025-12-26': {
                unit: 3,
                schedule: {
                    '1001': 1,
                    '1002': 2,
                    '1003': 3,
                },
                note: {
                    '1001': 'note for 1005',
                },
                log: {
                    '1001': ['12.01.24 set status `busy` (user 001)', '15.01.24 set status `sick` (user 005)'],
                }
            },
            '2025-12-25': {
                unit: 3,
                schedule: {
                    '1001': 1,
                    '1002': 2,
                    '1003': 3,
                },
                note: {
                    '1003': 'note for 1003',
                    '1005': 'note for 1005',
                },
                log: {}
            },
        }

        const schedulesStore = useSchedulesStore();

        schedulesStore.setSchedules(data)

        expect(schedulesStore.leftDate).toStrictEqual(new Date('2025-12-25'))
        expect(schedulesStore.rightDate).toStrictEqual(new Date('2025-12-26'))
        expect(schedulesStore.unit).toBe(3)
        expect(schedulesStore.indexes).toStrictEqual(['2025-12-25', '2025-12-26'])
        expect(schedulesStore.schedules).toStrictEqual({
            '2025-12-25': {1001: 1, 1002: 2, 1003: 3},
            '2025-12-26': {1001: 1, 1002: 2, 1003: 3},
        })
        expect(schedulesStore.notes).toStrictEqual({
            '2025-12-25': {1003: 'note for 1003', 1005: 'note for 1005'},
            '2025-12-26': {1001: 'note for 1005'},
        })
        expect(schedulesStore.logs).toStrictEqual({
            '2025-12-25': {},
            '2025-12-26': {1001: ['12.01.24 set status `busy` (user 001)', '15.01.24 set status `sick` (user 005)']},
        })
        expect(schedulesStore.statusesList).toStrictEqual([1, 2, 3])
    })

    test('set data on store', () => {
        const data = {
            '2025-12-25': {
                unit: 3,
                schedule: {
                    '1001': 1,
                    '1002': 2,
                    '1003': 7,
                },
                note: {
                    '1003': 'note for 1003',
                    '1005': 'note for 1005',
                },
                log: {}
            },
            '2025-12-26': {
                unit: 3,
                schedule: {
                    '1001': 1,
                    '1002': 2,
                    '1003': 8,
                },
                note: {
                    '1001': 'note for 1005',
                },
                log: {
                    '1001': ['12.01.24 set status `busy` (user 001)', '15.01.24 set status `sick` (user 005)'],
                }
            },
        }

        const schedulesStore = useSchedulesStore();

        schedulesStore.leftDate = new Date('2025-12-25')
        schedulesStore.rightDate = new Date('2025-12-29')
        schedulesStore.unit = 3
        schedulesStore.indexes = ['2025-12-25', '2025-12-26', '2025-12-27', '2025-12-28', '2025-12-29']
        schedulesStore.schedules = {
            '2025-12-25': {1001: 1, 1002: 2, 1003: 3},
            '2025-12-26': {1001: 2, 1002: 3, 1003: 4},
            '2025-12-27': {1001: 3, 1002: 4, 1003: 5},
            '2025-12-28': {1001: 4, 1002: 5, 1003: 1},
            '2025-12-29': {1001: 5, 1002: 1, 1003: 2},
        }
        schedulesStore.notes = {
            '2025-12-25': {1001: '1123', 1002: 'gf2'},
            '2025-12-26': {1001: '2asdf', 1002: 'fg3'},
            '2025-12-27': {1001: '3asd', 1002: 'ggf4'},
            '2025-12-28': {1001: '4ss', 1002: 'gfg5'},
            '2025-12-29': {1001: '5dd', 1002: 'g1'},
        }
        schedulesStore.logs = {
            '2025-12-25': {1001: ['1123', 'gf2']},
            '2025-12-26': {1001: ['2asdf', 'fg3']},
            '2025-12-27': {1001: ['3asd', 'ggf4']},
            '2025-12-28': {1001: ['4ss', 'gfg5']},
            '2025-12-29': {1001: ['5dd', 'g1']},
        }
        schedulesStore.statusesList = [1, 2, 3, 4, 5]

        schedulesStore.setSchedules(data)

        expect(schedulesStore.leftDate).toStrictEqual(new Date('2025-12-25'))
        expect(schedulesStore.rightDate).toStrictEqual(new Date('2025-12-29'))
        expect(schedulesStore.unit).toBe(3)
        expect(schedulesStore.indexes).toStrictEqual(['2025-12-25', '2025-12-26', '2025-12-27', '2025-12-28', '2025-12-29'])
        expect(schedulesStore.schedules).toStrictEqual({
            '2025-12-25': {1001: 1, 1002: 2, 1003: 7},
            '2025-12-26': {1001: 1, 1002: 2, 1003: 8},
            '2025-12-27': {1001: 3, 1002: 4, 1003: 5},
            '2025-12-28': {1001: 4, 1002: 5, 1003: 1},
            '2025-12-29': {1001: 5, 1002: 1, 1003: 2},
        })
        expect(schedulesStore.notes).toStrictEqual({
            '2025-12-25': {1003: 'note for 1003', 1005: 'note for 1005'},
            '2025-12-26': {1001: 'note for 1005'},
            '2025-12-27': {1001: '3asd', 1002: 'ggf4'},
            '2025-12-28': {1001: '4ss', 1002: 'gfg5'},
            '2025-12-29': {1001: '5dd', 1002: 'g1'},
        })
        expect(schedulesStore.logs).toStrictEqual({
            '2025-12-25': {},
            '2025-12-26': {1001: ['12.01.24 set status `busy` (user 001)', '15.01.24 set status `sick` (user 005)']},
            '2025-12-27': {1001: ['3asd', 'ggf4']},
            '2025-12-28': {1001: ['4ss', 'gfg5']},
            '2025-12-29': {1001: ['5dd', 'g1']},
        })
        expect(schedulesStore.statusesList).toStrictEqual([1, 2, 3, 4, 5, 7, 8])
    })

    test('set data on store with another unit', () => {
        const data = {
            '2025-12-25': {
                unit: 2,
                schedule: {
                    '1001': 1,
                    '1002': 2,
                    '1003': 7,
                },
                note: {
                    '1003': 'note for 1003',
                    '1005': 'note for 1005',
                },
                log: {}
            },
            '2025-12-26': {
                unit: 2,
                schedule: {
                    '1001': 1,
                    '1002': 2,
                    '1003': 8,
                },
                note: {
                    '1001': 'note for 1005',
                },
                log: {
                    '1001': ['12.01.24 set status `busy` (user 001)', '15.01.24 set status `sick` (user 005)'],
                }
            },
        }

        const schedulesStore = useSchedulesStore();

        schedulesStore.leftDate = new Date('2025-12-25')
        schedulesStore.rightDate = new Date('2025-12-29')
        schedulesStore.unit = 3
        schedulesStore.indexes = ['2025-12-25', '2025-12-26', '2025-12-27', '2025-12-28', '2025-12-29']
        schedulesStore.schedules = {
            '2025-12-25': {1001: 1, 1002: 2, 1003: 3},
            '2025-12-26': {1001: 2, 1002: 3, 1003: 4},
            '2025-12-27': {1001: 3, 1002: 4, 1003: 5},
            '2025-12-28': {1001: 4, 1002: 5, 1003: 1},
            '2025-12-29': {1001: 5, 1002: 1, 1003: 2},
        }
        schedulesStore.notes = {
            '2025-12-25': {1001: '1123', 1002: 'gf2'},
            '2025-12-26': {1001: '2asdf', 1002: 'fg3'},
            '2025-12-27': {1001: '3asd', 1002: 'ggf4'},
            '2025-12-28': {1001: '4ss', 1002: 'gfg5'},
            '2025-12-29': {1001: '5dd', 1002: 'g1'},
        }
        schedulesStore.logs = {
            '2025-12-25': {1001: ['1123', 'gf2']},
            '2025-12-26': {1001: ['2asdf', 'fg3']},
            '2025-12-27': {1001: ['3asd', 'ggf4']},
            '2025-12-28': {1001: ['4ss', 'gfg5']},
            '2025-12-29': {1001: ['5dd', 'g1']},
        }
        schedulesStore.statusesList = [1, 2, 3, 4, 5]

        schedulesStore.setSchedules(data)

        expect(schedulesStore.leftDate).toStrictEqual(new Date('2025-12-25'))
        expect(schedulesStore.rightDate).toStrictEqual(new Date('2025-12-26'))
        expect(schedulesStore.unit).toBe(2)
        expect(schedulesStore.indexes).toStrictEqual(['2025-12-25', '2025-12-26'])
        expect(schedulesStore.schedules).toStrictEqual({
            '2025-12-25': {1001: 1, 1002: 2, 1003: 7},
            '2025-12-26': {1001: 1, 1002: 2, 1003: 8},
        })
        expect(schedulesStore.notes).toStrictEqual({
            '2025-12-25': {1003: 'note for 1003', 1005: 'note for 1005'},
            '2025-12-26': {1001: 'note for 1005'},
        })
        expect(schedulesStore.logs).toStrictEqual({
            '2025-12-25': {},
            '2025-12-26': {1001: ['12.01.24 set status `busy` (user 001)', '15.01.24 set status `sick` (user 005)']},
        })
        expect(schedulesStore.statusesList).toStrictEqual([1, 2, 7, 8])
    })

    // isEmptyByDate
    test('is empty by date on empty store 1', () => {
        const schedulesStore = useSchedulesStore();

        expect(schedulesStore.isEmptyByDate(null, null)).toBe(true)
        expect(schedulesStore.leftDate).toBe(null)
        expect(schedulesStore.rightDate).toBe(null)
        expect(schedulesStore.unit).toBe(null)
        expect(schedulesStore.indexes).toStrictEqual([])
        expect(schedulesStore.schedules).toStrictEqual({})
        expect(schedulesStore.notes).toStrictEqual({})
        expect(schedulesStore.logs).toStrictEqual({})
        expect(schedulesStore.statusesList).toStrictEqual([])
    })

    test('is empty by date on empty store 2', () => {
        const schedulesStore = useSchedulesStore();

        expect(schedulesStore.isEmptyByDate(null, '2025-12-25')).toBe(true)
        expect(schedulesStore.leftDate).toBe(null)
        expect(schedulesStore.rightDate).toBe(null)
        expect(schedulesStore.unit).toBe(null)
        expect(schedulesStore.indexes).toStrictEqual([])
        expect(schedulesStore.schedules).toStrictEqual({})
        expect(schedulesStore.notes).toStrictEqual({})
        expect(schedulesStore.logs).toStrictEqual({})
        expect(schedulesStore.statusesList).toStrictEqual([])
    })


    test('is empty by date on empty store 2', () => {
        const schedulesStore = useSchedulesStore();

        expect(schedulesStore.isEmptyByDate(3, null)).toBe(true)
        expect(schedulesStore.leftDate).toBe(null)
        expect(schedulesStore.rightDate).toBe(null)
        expect(schedulesStore.unit).toBe(null)
        expect(schedulesStore.indexes).toStrictEqual([])
        expect(schedulesStore.schedules).toStrictEqual({})
        expect(schedulesStore.notes).toStrictEqual({})
        expect(schedulesStore.logs).toStrictEqual({})
        expect(schedulesStore.statusesList).toStrictEqual([])
    })

    test('is empty by date on store 1', () => {
        const schedulesStore = useSchedulesStore();

        schedulesStore.leftDate = new Date('2025-12-25')
        schedulesStore.rightDate = new Date('2025-12-29')
        schedulesStore.unit = 3
        schedulesStore.indexes = ['2025-12-25', '2025-12-26', '2025-12-27', '2025-12-28', '2025-12-29']
        schedulesStore.schedules = {
            '2025-12-25': {1001: 1, 1002: 2, 1003: 3},
            '2025-12-26': {1001: 2, 1002: 3, 1003: 4},
            '2025-12-27': {1001: 3, 1002: 4, 1003: 5},
            '2025-12-28': {1001: 4, 1002: 5, 1003: 1},
            '2025-12-29': {1001: 5, 1002: 1, 1003: 2},
        }
        schedulesStore.notes = {
            '2025-12-25': {1001: '1123', 1002: 'gf2'},
            '2025-12-26': {1001: '2asdf', 1002: 'fg3'},
            '2025-12-27': {1001: '3asd', 1002: 'ggf4'},
            '2025-12-28': {1001: '4ss', 1002: 'gfg5'},
            '2025-12-29': {1001: '5dd', 1002: 'g1'},
        }
        schedulesStore.logs = {
            '2025-12-25': {1001: ['1123', 'gf2']},
            '2025-12-26': {1001: ['2asdf', 'fg3']},
            '2025-12-27': {1001: ['3asd', 'ggf4']},
            '2025-12-28': {1001: ['4ss', 'gfg5']},
            '2025-12-29': {1001: ['5dd', 'g1']},
        }
        schedulesStore.statusesList = [1, 2, 3, 4, 5]

        expect(schedulesStore.isEmptyByDate(null, null)).toBe(true)
        expect(schedulesStore.leftDate).toBe(null)
        expect(schedulesStore.rightDate).toBe(null)
        expect(schedulesStore.unit).toBe(null)
        expect(schedulesStore.indexes).toStrictEqual([])
        expect(schedulesStore.schedules).toStrictEqual({})
        expect(schedulesStore.notes).toStrictEqual({})
        expect(schedulesStore.logs).toStrictEqual({})
        expect(schedulesStore.statusesList).toStrictEqual([])
    })

    test('is empty by date on store 2', () => {
        const schedulesStore = useSchedulesStore();

        schedulesStore.leftDate = new Date('2025-12-25')
        schedulesStore.rightDate = new Date('2025-12-29')
        schedulesStore.unit = 3
        schedulesStore.indexes = ['2025-12-25', '2025-12-26', '2025-12-27', '2025-12-28', '2025-12-29']
        schedulesStore.schedules = {
            '2025-12-25': {1001: 1, 1002: 2, 1003: 3},
            '2025-12-26': {1001: 2, 1002: 3, 1003: 4},
            '2025-12-27': {1001: 3, 1002: 4, 1003: 5},
            '2025-12-28': {1001: 4, 1002: 5, 1003: 1},
            '2025-12-29': {1001: 5, 1002: 1, 1003: 2},
        }
        schedulesStore.notes = {
            '2025-12-25': {1001: '1123', 1002: 'gf2'},
            '2025-12-26': {1001: '2asdf', 1002: 'fg3'},
            '2025-12-27': {1001: '3asd', 1002: 'ggf4'},
            '2025-12-28': {1001: '4ss', 1002: 'gfg5'},
            '2025-12-29': {1001: '5dd', 1002: 'g1'},
        }
        schedulesStore.logs = {
            '2025-12-25': {1001: ['1123', 'gf2']},
            '2025-12-26': {1001: ['2asdf', 'fg3']},
            '2025-12-27': {1001: ['3asd', 'ggf4']},
            '2025-12-28': {1001: ['4ss', 'gfg5']},
            '2025-12-29': {1001: ['5dd', 'g1']},
        }
        schedulesStore.statusesList = [1, 2, 3, 4, 5]

        expect(schedulesStore.isEmptyByDate(null, '2025-12-25')).toBe(true)
        expect(schedulesStore.leftDate).toBe(null)
        expect(schedulesStore.rightDate).toBe(null)
        expect(schedulesStore.unit).toBe(null)
        expect(schedulesStore.indexes).toStrictEqual([])
        expect(schedulesStore.schedules).toStrictEqual({})
        expect(schedulesStore.notes).toStrictEqual({})
        expect(schedulesStore.logs).toStrictEqual({})
        expect(schedulesStore.statusesList).toStrictEqual([])
    })


    test('is empty by date on store 3', () => {
        const schedulesStore = useSchedulesStore();

        schedulesStore.leftDate = new Date('2025-12-25')
        schedulesStore.rightDate = new Date('2025-12-29')
        schedulesStore.unit = 3
        schedulesStore.indexes = ['2025-12-25', '2025-12-26', '2025-12-27', '2025-12-28', '2025-12-29']
        schedulesStore.schedules = {
            '2025-12-25': {1001: 1, 1002: 2, 1003: 3},
            '2025-12-26': {1001: 2, 1002: 3, 1003: 4},
            '2025-12-27': {1001: 3, 1002: 4, 1003: 5},
            '2025-12-28': {1001: 4, 1002: 5, 1003: 1},
            '2025-12-29': {1001: 5, 1002: 1, 1003: 2},
        }
        schedulesStore.notes = {
            '2025-12-25': {1001: '1123', 1002: 'gf2'},
            '2025-12-26': {1001: '2asdf', 1002: 'fg3'},
            '2025-12-27': {1001: '3asd', 1002: 'ggf4'},
            '2025-12-28': {1001: '4ss', 1002: 'gfg5'},
            '2025-12-29': {1001: '5dd', 1002: 'g1'},
        }
        schedulesStore.logs = {
            '2025-12-25': {1001: ['1123', 'gf2']},
            '2025-12-26': {1001: ['2asdf', 'fg3']},
            '2025-12-27': {1001: ['3asd', 'ggf4']},
            '2025-12-28': {1001: ['4ss', 'gfg5']},
            '2025-12-29': {1001: ['5dd', 'g1']},
        }
        schedulesStore.statusesList = [1, 2, 3, 4, 5]

        expect(schedulesStore.isEmptyByDate(3, null)).toBe(true)
        expect(schedulesStore.leftDate).toStrictEqual(new Date('2025-12-25'))
        expect(schedulesStore.rightDate).toStrictEqual(new Date('2025-12-29'))
        expect(schedulesStore.unit).toBe(3)
        expect(schedulesStore.indexes).toStrictEqual(['2025-12-25', '2025-12-26', '2025-12-27', '2025-12-28', '2025-12-29'])
        expect(schedulesStore.schedules).toStrictEqual({
            '2025-12-25': {1001: 1, 1002: 2, 1003: 3},
            '2025-12-26': {1001: 2, 1002: 3, 1003: 4},
            '2025-12-27': {1001: 3, 1002: 4, 1003: 5},
            '2025-12-28': {1001: 4, 1002: 5, 1003: 1},
            '2025-12-29': {1001: 5, 1002: 1, 1003: 2},
        })
        expect(schedulesStore.notes).toStrictEqual({
            '2025-12-25': {1001: '1123', 1002: 'gf2'},
            '2025-12-26': {1001: '2asdf', 1002: 'fg3'},
            '2025-12-27': {1001: '3asd', 1002: 'ggf4'},
            '2025-12-28': {1001: '4ss', 1002: 'gfg5'},
            '2025-12-29': {1001: '5dd', 1002: 'g1'},
        })
        expect(schedulesStore.logs).toStrictEqual({
            '2025-12-25': {1001: ['1123', 'gf2']},
            '2025-12-26': {1001: ['2asdf', 'fg3']},
            '2025-12-27': {1001: ['3asd', 'ggf4']},
            '2025-12-28': {1001: ['4ss', 'gfg5']},
            '2025-12-29': {1001: ['5dd', 'g1']},
        })
        expect(schedulesStore.statusesList).toStrictEqual([1, 2, 3, 4, 5])
    })

    test('is empty by date on store 4', () => {
        const schedulesStore = useSchedulesStore();

        schedulesStore.leftDate = new Date('2025-12-25')
        schedulesStore.rightDate = new Date('2025-12-29')
        schedulesStore.unit = 3
        schedulesStore.indexes = ['2025-12-25', '2025-12-26', '2025-12-27', '2025-12-28', '2025-12-29']
        schedulesStore.schedules = {
            '2025-12-25': {1001: 1, 1002: 2, 1003: 3},
            '2025-12-26': {1001: 2, 1002: 3, 1003: 4},
            '2025-12-27': {1001: 3, 1002: 4, 1003: 5},
            '2025-12-28': {1001: 4, 1002: 5, 1003: 1},
            '2025-12-29': {1001: 5, 1002: 1, 1003: 2},
        }
        schedulesStore.notes = {
            '2025-12-25': {1001: '1123', 1002: 'gf2'},
            '2025-12-26': {1001: '2asdf', 1002: 'fg3'},
            '2025-12-27': {1001: '3asd', 1002: 'ggf4'},
            '2025-12-28': {1001: '4ss', 1002: 'gfg5'},
            '2025-12-29': {1001: '5dd', 1002: 'g1'},
        }
        schedulesStore.logs = {
            '2025-12-25': {1001: ['1123', 'gf2']},
            '2025-12-26': {1001: ['2asdf', 'fg3']},
            '2025-12-27': {1001: ['3asd', 'ggf4']},
            '2025-12-28': {1001: ['4ss', 'gfg5']},
            '2025-12-29': {1001: ['5dd', 'g1']},
        }
        schedulesStore.statusesList = [1, 2, 3, 4, 5]

        expect(schedulesStore.isEmptyByDate(4, '2025-12-25')).toBe(true)
        expect(schedulesStore.leftDate).toBe(null)
        expect(schedulesStore.rightDate).toBe(null)
        expect(schedulesStore.unit).toBe(null)
        expect(schedulesStore.indexes).toStrictEqual([])
        expect(schedulesStore.schedules).toStrictEqual({})
        expect(schedulesStore.notes).toStrictEqual({})
        expect(schedulesStore.logs).toStrictEqual({})
        expect(schedulesStore.statusesList).toStrictEqual([])
    })

    test('is empty by date on store 4', () => {
        const schedulesStore = useSchedulesStore();

        schedulesStore.leftDate = null
        schedulesStore.rightDate = null
        schedulesStore.unit = 3
        schedulesStore.indexes = ['2025-12-25', '2025-12-26', '2025-12-27', '2025-12-28', '2025-12-29']
        schedulesStore.schedules = {
            '2025-12-25': {1001: 1, 1002: 2, 1003: 3},
            '2025-12-26': {1001: 2, 1002: 3, 1003: 4},
            '2025-12-27': {1001: 3, 1002: 4, 1003: 5},
            '2025-12-28': {1001: 4, 1002: 5, 1003: 1},
            '2025-12-29': {1001: 5, 1002: 1, 1003: 2},
        }
        schedulesStore.notes = {
            '2025-12-25': {1001: '1123', 1002: 'gf2'},
            '2025-12-26': {1001: '2asdf', 1002: 'fg3'},
            '2025-12-27': {1001: '3asd', 1002: 'ggf4'},
            '2025-12-28': {1001: '4ss', 1002: 'gfg5'},
            '2025-12-29': {1001: '5dd', 1002: 'g1'},
        }
        schedulesStore.logs = {
            '2025-12-25': {1001: ['1123', 'gf2']},
            '2025-12-26': {1001: ['2asdf', 'fg3']},
            '2025-12-27': {1001: ['3asd', 'ggf4']},
            '2025-12-28': {1001: ['4ss', 'gfg5']},
            '2025-12-29': {1001: ['5dd', 'g1']},
        }
        schedulesStore.statusesList = [1, 2, 3, 4, 5]

        expect(schedulesStore.isEmptyByDate(3, '2025-12-25')).toBe(true)
        expect(schedulesStore.leftDate).toBe(null)
        expect(schedulesStore.rightDate).toBe(null)
        expect(schedulesStore.unit).toBe(3)
        expect(schedulesStore.indexes).toStrictEqual(['2025-12-25', '2025-12-26', '2025-12-27', '2025-12-28', '2025-12-29'])
        expect(schedulesStore.schedules).toStrictEqual({
            '2025-12-25': {1001: 1, 1002: 2, 1003: 3},
            '2025-12-26': {1001: 2, 1002: 3, 1003: 4},
            '2025-12-27': {1001: 3, 1002: 4, 1003: 5},
            '2025-12-28': {1001: 4, 1002: 5, 1003: 1},
            '2025-12-29': {1001: 5, 1002: 1, 1003: 2},
        })
        expect(schedulesStore.notes).toStrictEqual({
            '2025-12-25': {1001: '1123', 1002: 'gf2'},
            '2025-12-26': {1001: '2asdf', 1002: 'fg3'},
            '2025-12-27': {1001: '3asd', 1002: 'ggf4'},
            '2025-12-28': {1001: '4ss', 1002: 'gfg5'},
            '2025-12-29': {1001: '5dd', 1002: 'g1'},
        })
        expect(schedulesStore.logs).toStrictEqual({
            '2025-12-25': {1001: ['1123', 'gf2']},
            '2025-12-26': {1001: ['2asdf', 'fg3']},
            '2025-12-27': {1001: ['3asd', 'ggf4']},
            '2025-12-28': {1001: ['4ss', 'gfg5']},
            '2025-12-29': {1001: ['5dd', 'g1']},
        })
        expect(schedulesStore.statusesList).toStrictEqual([1, 2, 3, 4, 5])
    })

    test('is empty by date on store 5', () => {
        const schedulesStore = useSchedulesStore();

        schedulesStore.leftDate = new Date('2025-12-25')
        schedulesStore.rightDate = new Date('2025-12-29')
        schedulesStore.unit = 3
        schedulesStore.indexes = ['2025-12-25', '2025-12-26', '2025-12-27', '2025-12-28', '2025-12-29']
        schedulesStore.schedules = {
            '2025-12-25': {1001: 1, 1002: 2, 1003: 3},
            '2025-12-26': {1001: 2, 1002: 3, 1003: 4},
            '2025-12-27': {1001: 3, 1002: 4, 1003: 5},
            '2025-12-28': {1001: 4, 1002: 5, 1003: 1},
            '2025-12-29': {1001: 5, 1002: 1, 1003: 2},
        }
        schedulesStore.notes = {
            '2025-12-25': {1001: '1123', 1002: 'gf2'},
            '2025-12-26': {1001: '2asdf', 1002: 'fg3'},
            '2025-12-27': {1001: '3asd', 1002: 'ggf4'},
            '2025-12-28': {1001: '4ss', 1002: 'gfg5'},
            '2025-12-29': {1001: '5dd', 1002: 'g1'},
        }
        schedulesStore.logs = {
            '2025-12-25': {1001: ['1123', 'gf2']},
            '2025-12-26': {1001: ['2asdf', 'fg3']},
            '2025-12-27': {1001: ['3asd', 'ggf4']},
            '2025-12-28': {1001: ['4ss', 'gfg5']},
            '2025-12-29': {1001: ['5dd', 'g1']},
        }
        schedulesStore.statusesList = [1, 2, 3, 4, 5]

        expect(schedulesStore.isEmptyByDate(3, '2025-12-15')).toBe(true)
        expect(schedulesStore.leftDate).toStrictEqual(new Date('2025-12-25'))
        expect(schedulesStore.rightDate).toStrictEqual(new Date('2025-12-29'))
        expect(schedulesStore.unit).toBe(3)
        expect(schedulesStore.indexes).toStrictEqual(['2025-12-25', '2025-12-26', '2025-12-27', '2025-12-28', '2025-12-29'])
        expect(schedulesStore.schedules).toStrictEqual({
            '2025-12-25': {1001: 1, 1002: 2, 1003: 3},
            '2025-12-26': {1001: 2, 1002: 3, 1003: 4},
            '2025-12-27': {1001: 3, 1002: 4, 1003: 5},
            '2025-12-28': {1001: 4, 1002: 5, 1003: 1},
            '2025-12-29': {1001: 5, 1002: 1, 1003: 2},
        })
        expect(schedulesStore.notes).toStrictEqual({
            '2025-12-25': {1001: '1123', 1002: 'gf2'},
            '2025-12-26': {1001: '2asdf', 1002: 'fg3'},
            '2025-12-27': {1001: '3asd', 1002: 'ggf4'},
            '2025-12-28': {1001: '4ss', 1002: 'gfg5'},
            '2025-12-29': {1001: '5dd', 1002: 'g1'},
        })
        expect(schedulesStore.logs).toStrictEqual({
            '2025-12-25': {1001: ['1123', 'gf2']},
            '2025-12-26': {1001: ['2asdf', 'fg3']},
            '2025-12-27': {1001: ['3asd', 'ggf4']},
            '2025-12-28': {1001: ['4ss', 'gfg5']},
            '2025-12-29': {1001: ['5dd', 'g1']},
        })
        expect(schedulesStore.statusesList).toStrictEqual([1, 2, 3, 4, 5])
    })

    test('is empty by date on store 6', () => {
        const schedulesStore = useSchedulesStore();

        schedulesStore.leftDate = new Date('2025-12-01')
        schedulesStore.rightDate = new Date('2025-12-31')
        schedulesStore.unit = 3
        schedulesStore.indexes = ['2025-12-25', '2025-12-26', '2025-12-27', '2025-12-28', '2025-12-29']
        schedulesStore.schedules = {
            '2025-12-25': {1001: 1, 1002: 2, 1003: 3},
            '2025-12-26': {1001: 2, 1002: 3, 1003: 4},
            '2025-12-27': {1001: 3, 1002: 4, 1003: 5},
            '2025-12-28': {1001: 4, 1002: 5, 1003: 1},
            '2025-12-29': {1001: 5, 1002: 1, 1003: 2},
        }
        schedulesStore.notes = {
            '2025-12-25': {1001: '1123', 1002: 'gf2'},
            '2025-12-26': {1001: '2asdf', 1002: 'fg3'},
            '2025-12-27': {1001: '3asd', 1002: 'ggf4'},
            '2025-12-28': {1001: '4ss', 1002: 'gfg5'},
            '2025-12-29': {1001: '5dd', 1002: 'g1'},
        }
        schedulesStore.logs = {
            '2025-12-25': {1001: ['1123', 'gf2']},
            '2025-12-26': {1001: ['2asdf', 'fg3']},
            '2025-12-27': {1001: ['3asd', 'ggf4']},
            '2025-12-28': {1001: ['4ss', 'gfg5']},
            '2025-12-29': {1001: ['5dd', 'g1']},
        }
        schedulesStore.statusesList = [1, 2, 3, 4, 5]

        expect(schedulesStore.isEmptyByDate(3, '2025-12-02')).toBe(true)
        expect(schedulesStore.leftDate).toStrictEqual(new Date('2025-12-01'))
        expect(schedulesStore.rightDate).toStrictEqual(new Date('2025-12-31'))
        expect(schedulesStore.unit).toBe(3)
        expect(schedulesStore.indexes).toStrictEqual(['2025-12-25', '2025-12-26', '2025-12-27', '2025-12-28', '2025-12-29'])
        expect(schedulesStore.schedules).toStrictEqual({
            '2025-12-25': {1001: 1, 1002: 2, 1003: 3},
            '2025-12-26': {1001: 2, 1002: 3, 1003: 4},
            '2025-12-27': {1001: 3, 1002: 4, 1003: 5},
            '2025-12-28': {1001: 4, 1002: 5, 1003: 1},
            '2025-12-29': {1001: 5, 1002: 1, 1003: 2},
        })
        expect(schedulesStore.notes).toStrictEqual({
            '2025-12-25': {1001: '1123', 1002: 'gf2'},
            '2025-12-26': {1001: '2asdf', 1002: 'fg3'},
            '2025-12-27': {1001: '3asd', 1002: 'ggf4'},
            '2025-12-28': {1001: '4ss', 1002: 'gfg5'},
            '2025-12-29': {1001: '5dd', 1002: 'g1'},
        })
        expect(schedulesStore.logs).toStrictEqual({
            '2025-12-25': {1001: ['1123', 'gf2']},
            '2025-12-26': {1001: ['2asdf', 'fg3']},
            '2025-12-27': {1001: ['3asd', 'ggf4']},
            '2025-12-28': {1001: ['4ss', 'gfg5']},
            '2025-12-29': {1001: ['5dd', 'g1']},
        })
        expect(schedulesStore.statusesList).toStrictEqual([1, 2, 3, 4, 5])
    })

    test('is empty by date on store 7', () => {
        const schedulesStore = useSchedulesStore();

        schedulesStore.leftDate = new Date('2025-12-01')
        schedulesStore.rightDate = new Date('2025-12-31')
        schedulesStore.unit = 3
        schedulesStore.indexes = ['2025-12-25', '2025-12-26', '2025-12-27', '2025-12-28', '2025-12-29']
        schedulesStore.schedules = {
            '2025-12-25': {1001: 1, 1002: 2, 1003: 3},
            '2025-12-26': {1001: 2, 1002: 3, 1003: 4},
            '2025-12-27': {1001: 3, 1002: 4, 1003: 5},
            '2025-12-28': {1001: 4, 1002: 5, 1003: 1},
            '2025-12-29': {1001: 5, 1002: 1, 1003: 2},
        }
        schedulesStore.notes = {
            '2025-12-25': {1001: '1123', 1002: 'gf2'},
            '2025-12-26': {1001: '2asdf', 1002: 'fg3'},
            '2025-12-27': {1001: '3asd', 1002: 'ggf4'},
            '2025-12-28': {1001: '4ss', 1002: 'gfg5'},
            '2025-12-29': {1001: '5dd', 1002: 'g1'},
        }
        schedulesStore.logs = {
            '2025-12-25': {1001: ['1123', 'gf2']},
            '2025-12-26': {1001: ['2asdf', 'fg3']},
            '2025-12-27': {1001: ['3asd', 'ggf4']},
            '2025-12-28': {1001: ['4ss', 'gfg5']},
            '2025-12-29': {1001: ['5dd', 'g1']},
        }
        schedulesStore.statusesList = [1, 2, 3, 4, 5]

        expect(schedulesStore.isEmptyByDate(3, '2025-12-30')).toBe(true)
        expect(schedulesStore.leftDate).toStrictEqual(new Date('2025-12-01'))
        expect(schedulesStore.rightDate).toStrictEqual(new Date('2025-12-31'))
        expect(schedulesStore.unit).toBe(3)
        expect(schedulesStore.indexes).toStrictEqual(['2025-12-25', '2025-12-26', '2025-12-27', '2025-12-28', '2025-12-29'])
        expect(schedulesStore.schedules).toStrictEqual({
            '2025-12-25': {1001: 1, 1002: 2, 1003: 3},
            '2025-12-26': {1001: 2, 1002: 3, 1003: 4},
            '2025-12-27': {1001: 3, 1002: 4, 1003: 5},
            '2025-12-28': {1001: 4, 1002: 5, 1003: 1},
            '2025-12-29': {1001: 5, 1002: 1, 1003: 2},
        })
        expect(schedulesStore.notes).toStrictEqual({
            '2025-12-25': {1001: '1123', 1002: 'gf2'},
            '2025-12-26': {1001: '2asdf', 1002: 'fg3'},
            '2025-12-27': {1001: '3asd', 1002: 'ggf4'},
            '2025-12-28': {1001: '4ss', 1002: 'gfg5'},
            '2025-12-29': {1001: '5dd', 1002: 'g1'},
        })
        expect(schedulesStore.logs).toStrictEqual({
            '2025-12-25': {1001: ['1123', 'gf2']},
            '2025-12-26': {1001: ['2asdf', 'fg3']},
            '2025-12-27': {1001: ['3asd', 'ggf4']},
            '2025-12-28': {1001: ['4ss', 'gfg5']},
            '2025-12-29': {1001: ['5dd', 'g1']},
        })
        expect(schedulesStore.statusesList).toStrictEqual([1, 2, 3, 4, 5])
    })

    // getRangeDates
    test('get range date on empty store and nullable params', () => {
        const schedulesStore = useSchedulesStore();
        expect(schedulesStore.getRangeDates(null, null)).toStrictEqual(
            {
                unit: null,
                dateFrom: null,
                dateTo: null,
            })
    })

    test('get range date on empty store', () => {
        const schedulesStore = useSchedulesStore();
        const _date = '2025-12-12'
        const lDate = new Date(_date);
        const rDate = new Date(_date);
        lDate.setDate(lDate.getDate() - APP_CONSTANTS.FETCH_PERIOD_DAY)
        rDate.setDate(rDate.getDate() + 2 * APP_CONSTANTS.FETCH_PERIOD_DAY)
        const lDateStr = dateFormatter(lDate)
        const rDateStr = dateFormatter(rDate)
        expect(schedulesStore.getRangeDates(1, '2025-12-12')).toStrictEqual(
            {
                unit: 1,
                dateFrom: lDateStr,
                dateTo: rDateStr,
            })
    })

    test('get range date on store 1', () => {
        const schedulesStore = useSchedulesStore();

        schedulesStore.leftDate = new Date('2025-12-01')
        schedulesStore.rightDate = new Date('2026-01-01')

        const lDate = new Date('2025-12-01');
        lDate.setDate(lDate.getDate() - APP_CONSTANTS.FETCH_PERIOD_DAY)
        const lDateStr = dateFormatter(lDate)

        expect(schedulesStore.getRangeDates(3, '2025-12-02')).toStrictEqual(
            {
                unit: 3,
                dateFrom: lDateStr,
                dateTo: '2025-11-30',
            })
    })

    test('get range date on store 2', () => {
        const schedulesStore = useSchedulesStore();

        schedulesStore.leftDate = new Date('2025-12-01')
        schedulesStore.rightDate = new Date('2026-01-07')

        const rDate = new Date('2026-01-07');
        rDate.setDate(rDate.getDate() + APP_CONSTANTS.FETCH_PERIOD_DAY)
        const rDateStr = dateFormatter(rDate)

        expect(schedulesStore.getRangeDates(3, '2026-01-05')).toStrictEqual(
            {
                unit: 3,
                dateFrom: '2026-01-08',
                dateTo: rDateStr,
            })
    })

    //getDateByIndex
    test('get date by index on empty store', () => {
        const schedulesStore = useSchedulesStore();

        schedulesStore.indexes = []

        expect(schedulesStore.getDateByIndex(1)).toBe(null)
    })

    test('get date by index on  store', () => {
        const schedulesStore = useSchedulesStore();

        schedulesStore.indexes = ['2025-12-25', '2025-12-26', '2025-12-27', '2025-12-28', '2025-12-29']

        expect(schedulesStore.getDateByIndex(1)).toBe('2025-12-26')
    })

    // getLeftDateStr
    test('get left date str by empty store', () => {
        const schedulesStore = useSchedulesStore();

        expect(schedulesStore.getLeftDateStr()).toBe(null)
    })

    test('get left date str by store', () => {
        const schedulesStore = useSchedulesStore();

        schedulesStore.leftDate = new Date('2025-12-15')

        expect(schedulesStore.getLeftDateStr()).toBe('2025-12-15')
    })

    // getRightDateStr
    test('get right date str by empty store', () => {
        const schedulesStore = useSchedulesStore();

        expect(schedulesStore.getRightDateStr()).toBe(null)
    })

    test('get right date str by store', () => {
        const schedulesStore = useSchedulesStore();

        schedulesStore.rightDate = new Date('2025-12-15')

        expect(schedulesStore.getRightDateStr()).toBe('2025-12-15')
    })
})
