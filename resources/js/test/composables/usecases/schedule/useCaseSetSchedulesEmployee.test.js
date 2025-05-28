import {describe, test, expect, vi, beforeEach} from 'vitest';
import {useCaseSetSchedulesEmployee} from '../../../../src/composables/usecases/schedule/useCaseSetSchedulesEmployee';
import scheduleService from '../../../../src/composables/services/scheduleService';
import schedulesStore from '../../../../src/composables/store/schedulesStore';

vi.mock('../../../../src/composables/services/scheduleService', () => ({
    default: {
        setEmployee: vi.fn(),
    },
}));

vi.mock('../../../../src/composables/store/schedulesStore', () => ({
    default: {
        isEmptyByDate: vi.fn(() => true),
        checkAndClearUnit: vi.fn(),
        setSchedules: vi.fn(),
        getRangeDates: vi.fn(),
        getDateByIndex: vi.fn(),
        getLeftDateStr: vi.fn(),
        getRightDateStr: vi.fn(),
    },
}));

describe('useCaseSetSchedulesEmployee', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    test('початкові значення змінних ref()', () => {
        const {loading, error, authError} = useCaseSetSchedulesEmployee(schedulesStore);

        expect(loading.value).toBe(false);
        expect(error.value).toBe(null);
        expect(authError.value).toBe(false);
    });

    test('отримує дані та зберігає їх у schedulesStore', async () => {
        const {setSchedulesEmployee, loading, error} = useCaseSetSchedulesEmployee(schedulesStore);

        const employee_id = 5
        const status = 2
        const dateFrom = '2025-12-10'
        const dateTo = '2025-12-11'
        const note = 'note'

        const data = { unit: 1,
            schedule: {
                '1001': 1,
                '1002': 1,
                '1003': 1,
            },
            note: {
                '1003': 'note for 1003',
                '1005': 'note for 1005',
            },
            log: {
                '1001': ['12.01.24 set status `busy` (user 001)','15.01.24 set status `sick` (user 005)'],
                '1002': ['12.01.24 set status `busy` (user 001)','15.01.24 set status `sick` (user 005)'],
            }
        }
        const mockData = [
            {'2025-12-10': data},
            {'2025-12-11': data},
        ]


        schedulesStore.getLeftDateStr.mockResolvedValue('2025-12-10');
        schedulesStore.getRightDateStr.mockResolvedValue('2025-12-11');
        scheduleService.setEmployee.mockResolvedValue(mockData);

        await setSchedulesEmployee(employee_id, status, dateFrom, dateTo, note);

        expect(loading.value).toBe(false);
        expect(error.value).toBe(null);
        expect(schedulesStore.setSchedules).toHaveBeenCalledWith(mockData);
    });

    test('отримує дані та зберігає їх у schedulesStore де note = null', async () => {
        const {setSchedulesEmployee, loading, error} = useCaseSetSchedulesEmployee(schedulesStore);

        const employee_id = 5
        const status = 2
        const dateFrom = '2025-12-10'
        const dateTo = '2025-12-11'

        const data = { unit: 1,
            schedule: {
                '1001': 1,
                '1002': 1,
                '1003': 1,
            },
            note: {
                '1003': 'note for 1003',
                '1005': 'note for 1005',
            },
            log: {
                '1001': ['12.01.24 set status `busy` (user 001)','15.01.24 set status `sick` (user 005)'],
                '1002': ['12.01.24 set status `busy` (user 001)','15.01.24 set status `sick` (user 005)'],
            }
        }
        const mockData = [
            {'2025-12-10': data},
            {'2025-12-11': data},
        ]


        schedulesStore.getLeftDateStr.mockResolvedValue('2025-12-10');
        schedulesStore.getRightDateStr.mockResolvedValue('2025-12-11');
        scheduleService.setEmployee.mockResolvedValue(mockData);

        await setSchedulesEmployee(employee_id, status, dateFrom, dateTo);

        expect(loading.value).toBe(false);
        expect(error.value).toBe(null);
        expect(schedulesStore.setSchedules).toHaveBeenCalledWith(mockData);
    });

    test('якщо сервер повертає помилку авторизації, встановлює authError', async () => {
        const {setSchedulesEmployee, authError} = useCaseSetSchedulesEmployee(schedulesStore);

        scheduleService.setEmployee.mockRejectedValue(new Error('AuthError'));

        const employee_id = 5
        const status = 2
        const dateFrom = '2025-12-10'
        const dateTo = '2025-12-11'
        const note = 'note'
        await setSchedulesEmployee(employee_id, status, dateFrom, dateTo, note);

        expect(authError.value).toBe(true);
    });

    test('якщо сервер повертає іншу помилку, зберігає її у error', async () => {
        const {setSchedulesEmployee, error} = useCaseSetSchedulesEmployee(schedulesStore);

        scheduleService.setEmployee.mockRejectedValue(new Error('Server Error'));

        const employee_id = 5
        const status = 2
        const dateFrom = '2025-12-10'
        const dateTo = '2025-12-11'
        const note = 'note'
        await setSchedulesEmployee(employee_id, status, dateFrom, dateTo, note);

        expect(error.value).toBe('Server Error');
    });

    test('скасовує запит через AbortController', async () => {
        const {setSchedulesEmployee, cancelRequest, loading} = useCaseSetSchedulesEmployee(schedulesStore);

        scheduleService.setEmployee.mockImplementation(() =>
            new Promise((_, reject) => setTimeout(() => reject(new Error('canceled')), 100))
        );

        const employee_id = 5
        const status = 2
        const dateFrom = '2025-12-10'
        const dateTo = '2025-12-11'
        const note = 'note'
        setSchedulesEmployee(employee_id, status, dateFrom, dateTo, note);

        cancelRequest();

        expect(loading.value).toBe(false);
    });

    test('спроба скасувати запит через AbortController коли він завершений', async () => {
        const {setSchedulesEmployee, cancelRequest, loading} = useCaseSetSchedulesEmployee(schedulesStore);

        scheduleService.setEmployee.mockImplementation(() =>
            new Promise((_, reject) => setTimeout(() => reject(new Error('canceled')), 100))
        );

        const employee_id = 5
        const status = 2
        const dateFrom = '2025-12-10'
        const dateTo = '2025-12-11'
        const note = 'note'
        setSchedulesEmployee(employee_id, status, dateFrom, dateTo, note);

        loading.value = false
        cancelRequest();
        expect(loading.value).toBe(false);
    });
});
