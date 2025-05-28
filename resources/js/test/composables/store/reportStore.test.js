import {createPinia, setActivePinia} from 'pinia'
import {beforeEach, describe, expect, test} from 'vitest'
import {useReportStore, dateFormatter} from '../../../src/composables/store/reportStore'

describe('REPORT STORE', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    test('init data store', () => {
        const reportStore = useReportStore();

        expect(reportStore.unit).toBe(null)
        expect(reportStore.dateFrom).toBe(null)
        expect(reportStore.dateTo).toBe(null)
        expect(reportStore.reportData).toStrictEqual({})
        expect(reportStore.statusesList).toStrictEqual([])
    })

    test('set empty data on nullable store', () => {
        const data = []

        const reportStore = useReportStore();
        reportStore.setReport(data);

        expect(reportStore.unit).toBe(null)
        expect(reportStore.dateFrom).toBe(null)
        expect(reportStore.dateTo).toBe(null)
        expect(reportStore.reportData).toStrictEqual({})
        expect(reportStore.statusesList).toStrictEqual([])
    })

    test('set data on nullable store', () => {
        const data = {
            unit: 1,
            dateFrom: '2025-12-12',
            dateTo: '2025-12-15',
            reportData: {
                '1001': {8: [1, 1, 1], 9: [1, 1, 1], 3: [1, 2, 3], 6: [2, 3, 4]},
                '1002': {2: [1, 1, 1], 1: [1, 1, 1], 3: [1, 2, 3], 6: [2, 3, 4]},
                '1003': {2: [1, 1, 1], 1: [1, 1, 1], 3: [1, 2, 3], 6: [2, 3, 4]},
                '1004': {5: [1, 1, 1], 7: [1, 1, 1], 3: [1, 2, 3], 6: [2, 3, 4]},
                '1005': {5: [1, 1, 1], 7: [1, 1, 1], 3: [1, 2, 3], 4: [2, 3, 4]},
                '1006': {2: [1, 1, 1], 1: [1, 1, 1], 3: [1, 2, 3], 4: [2, 3, 4]},
                '1007': {2: [1, 1, 1], 1: [1, 1, 1], 3: [1, 2, 3], 4: [2, 3, 4]},
            }
        }

        const reportStore = useReportStore();
        reportStore.setReport(data);

        expect(reportStore.unit).toBe(1)
        expect(reportStore.dateFrom).toStrictEqual(new Date('2025-12-12'))
        expect(reportStore.dateTo).toStrictEqual(new Date('2025-12-15'))
        expect(reportStore.reportData).toStrictEqual({
            '1001': {8: [1, 1, 1], 9: [1, 1, 1], 3: [1, 2, 3], 6: [2, 3, 4]},
            '1002': {2: [1, 1, 1], 1: [1, 1, 1], 3: [1, 2, 3], 6: [2, 3, 4]},
            '1003': {2: [1, 1, 1], 1: [1, 1, 1], 3: [1, 2, 3], 6: [2, 3, 4]},
            '1004': {5: [1, 1, 1], 7: [1, 1, 1], 3: [1, 2, 3], 6: [2, 3, 4]},
            '1005': {5: [1, 1, 1], 7: [1, 1, 1], 3: [1, 2, 3], 4: [2, 3, 4]},
            '1006': {2: [1, 1, 1], 1: [1, 1, 1], 3: [1, 2, 3], 4: [2, 3, 4]},
            '1007': {2: [1, 1, 1], 1: [1, 1, 1], 3: [1, 2, 3], 4: [2, 3, 4]},
        })
        expect(reportStore.statusesList).toStrictEqual([1, 2, 3, 4, 5, 6, 7, 8, 9])
    })
})

describe('REPORT STORE dateFormatter', () => {
    test('dateFormatter', () => {
        expect(dateFormatter(new Date('2025-12-12'))).toBe('2025-12-12')
    })

    test('dateFormatter nullable data', () => {
        expect(dateFormatter(null)).toBe(undefined)
    })
})

describe('REPORT STORE isEmptyReport', () => {
    test('isEmptyReport on empty data', () => {
        const reportStore = useReportStore();
        reportStore.clearReport()
        expect(reportStore.unit).toBe(null)
        expect(reportStore.dateFrom).toBe(null)
        expect(reportStore.dateTo).toBe(null)
        expect(reportStore.reportData).toStrictEqual({})
        expect(reportStore.statusesList).toStrictEqual([])

        expect(reportStore.isEmptyReport(1, '2025-12-12', '2025-12-15')).toBe(true)
        expect(reportStore.isEmptyReport(1, '2025-12-13', '2025-12-15')).toBe(true)
        expect(reportStore.isEmptyReport(1, '2025-12-12', '2025-12-14')).toBe(true)

        expect(reportStore.isEmptyReport(2, '2025-12-12', '2025-12-15')).toBe(true)
        expect(reportStore.isEmptyReport(2, '2025-12-13', '2025-12-15')).toBe(true)
        expect(reportStore.isEmptyReport(2, '2025-12-12', '2025-12-14')).toBe(true)
    })

    test('isEmptyReport on correct data', () => {
        const reportStore = useReportStore();
        reportStore.unit = 1
        reportStore.dateFrom = new Date('2025-12-12')
        reportStore.dateTo = new Date('2025-12-15')
        reportStore.reportData = {
            '1001': {8: [1, 1, 1], 9: [1, 1, 1], 3: [1, 2, 3], 6: [2, 3, 4]},
            '1002': {2: [1, 1, 1], 1: [1, 1, 1], 3: [1, 2, 3], 6: [2, 3, 4]},
            '1003': {2: [1, 1, 1], 1: [1, 1, 1], 3: [1, 2, 3], 6: [2, 3, 4]},
            '1004': {5: [1, 1, 1], 7: [1, 1, 1], 3: [1, 2, 3], 6: [2, 3, 4]},
            '1005': {5: [1, 1, 1], 7: [1, 1, 1], 3: [1, 2, 3], 4: [2, 3, 4]},
            '1006': {2: [1, 1, 1], 1: [1, 1, 1], 3: [1, 2, 3], 4: [2, 3, 4]},
            '1007': {2: [1, 1, 1], 1: [1, 1, 1], 3: [1, 2, 3], 4: [2, 3, 4]},
        }
        reportStore.statusesList = [1, 2, 3, 4, 5, 6, 7, 8, 9]

        expect(reportStore.isEmptyReport(1, '2025-12-12', null)).toBe(true)
        expect(reportStore.isEmptyReport(1, null, '2025-12-15')).toBe(true)
        expect(reportStore.isEmptyReport(null, '2025-12-12', '2025-12-14')).toBe(true)
        expect(reportStore.isEmptyReport(1, null, null)).toBe(true)
        expect(reportStore.isEmptyReport(null, '2025-12-13', null)).toBe(true)
        expect(reportStore.isEmptyReport(null, null, '2025-12-14')).toBe(true)
        expect(reportStore.isEmptyReport(null, null, null)).toBe(true)
    })


    test('isEmptyReport on correct data', () => {
        const reportStore = useReportStore();
        reportStore.unit = 1
        reportStore.dateFrom = new Date('2025-12-12')
        reportStore.dateTo = new Date('2025-12-15')
        reportStore.reportData = {
            '1001': {8: [1, 1, 1], 9: [1, 1, 1], 3: [1, 2, 3], 6: [2, 3, 4]},
            '1002': {2: [1, 1, 1], 1: [1, 1, 1], 3: [1, 2, 3], 6: [2, 3, 4]},
            '1003': {2: [1, 1, 1], 1: [1, 1, 1], 3: [1, 2, 3], 6: [2, 3, 4]},
            '1004': {5: [1, 1, 1], 7: [1, 1, 1], 3: [1, 2, 3], 6: [2, 3, 4]},
            '1005': {5: [1, 1, 1], 7: [1, 1, 1], 3: [1, 2, 3], 4: [2, 3, 4]},
            '1006': {2: [1, 1, 1], 1: [1, 1, 1], 3: [1, 2, 3], 4: [2, 3, 4]},
            '1007': {2: [1, 1, 1], 1: [1, 1, 1], 3: [1, 2, 3], 4: [2, 3, 4]},
        }
        reportStore.statusesList = [1, 2, 3, 4, 5, 6, 7, 8, 9]

        expect(reportStore.isEmptyReport(1, '2025-12-12', '2025-12-15')).toBe(false)
        expect(reportStore.isEmptyReport(1, '2025-12-13', '2025-12-15')).toBe(true)
        expect(reportStore.isEmptyReport(1, '2025-12-12', '2025-12-14')).toBe(true)

        expect(reportStore.isEmptyReport(2, '2025-12-12', '2025-12-15')).toBe(true)
        expect(reportStore.isEmptyReport(2, '2025-12-13', '2025-12-15')).toBe(true)
        expect(reportStore.isEmptyReport(2, '2025-12-12', '2025-12-14')).toBe(true)
    })
})

describe('REPORT STORE clearReport', () => {
    test('clearReport on correct data', () => {
        const reportStore = useReportStore();
        reportStore.unit = 1
        reportStore.dateFrom = new Date('2025-12-12')
        reportStore.dateTo = new Date('2025-12-15')
        reportStore.reportData = {
            '1001': {8: [1, 1, 1], 9: [1, 1, 1], 3: [1, 2, 3], 6: [2, 3, 4]},
            '1002': {2: [1, 1, 1], 1: [1, 1, 1], 3: [1, 2, 3], 6: [2, 3, 4]},
            '1003': {2: [1, 1, 1], 1: [1, 1, 1], 3: [1, 2, 3], 6: [2, 3, 4]},
            '1004': {5: [1, 1, 1], 7: [1, 1, 1], 3: [1, 2, 3], 6: [2, 3, 4]},
            '1005': {5: [1, 1, 1], 7: [1, 1, 1], 3: [1, 2, 3], 4: [2, 3, 4]},
            '1006': {2: [1, 1, 1], 1: [1, 1, 1], 3: [1, 2, 3], 4: [2, 3, 4]},
            '1007': {2: [1, 1, 1], 1: [1, 1, 1], 3: [1, 2, 3], 4: [2, 3, 4]},
        }
        reportStore.statusesList = [1, 2, 3, 4, 5, 6, 7, 8, 9]

        reportStore.clearReport()

        expect(reportStore.unit).toBe(null)
        expect(reportStore.dateFrom).toBe(null)
        expect(reportStore.dateTo).toBe(null)
        expect(reportStore.reportData).toStrictEqual({})
        expect(reportStore.statusesList).toStrictEqual([])
    })
})
