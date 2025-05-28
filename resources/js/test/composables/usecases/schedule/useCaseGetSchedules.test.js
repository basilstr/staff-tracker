import {describe, test, expect, vi, beforeEach} from 'vitest';
import {useCaseGetSchedules} from '../../../../src/composables/usecases/schedule/useCaseGetSchedules';
import scheduleService from '../../../../src/composables/services/scheduleService';
import schedulesStore from '../../../../src/composables/store/schedulesStore';

vi.mock('../../../../src/composables/services/scheduleService', () => ({
    default: {
        getSchedules: vi.fn(),
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

describe('useCaseGetSchedules', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    test('початкові значення змінних ref()', () => {
        const {loading, error, authError} = useCaseGetSchedules(schedulesStore);

        expect(loading.value).toBe(false);
        expect(error.value).toBe(null);
        expect(authError.value).toBe(false);
    });

    test('отримує дані та зберігає їх у schedulesStore', async () => {
        const {fetchSchedules, loading, error, employee} = useCaseGetSchedules(schedulesStore);

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

        scheduleService.getSchedules.mockResolvedValue(mockData);

        const unit = 5
        const dateFrom = '2025-12-10'
        const dateTo = '2025-12-11'
        await fetchSchedules(unit, dateFrom, dateTo);

        expect(loading.value).toBe(false);
        expect(error.value).toBe(null);
        expect(schedulesStore.setSchedules).toHaveBeenCalledWith(mockData);
    });

    test('якщо сервер повертає помилку авторизації, встановлює authError', async () => {
        const {fetchSchedules, authError} = useCaseGetSchedules(schedulesStore);

        scheduleService.getSchedules.mockRejectedValue(new Error('AuthError'));

        const unit = 5
        const dateFrom = '2025-12-10'
        const dateTo = '2025-12-11'
        await fetchSchedules(unit, dateFrom, dateTo);

        expect(authError.value).toBe(true);
    });

    test('якщо сервер повертає іншу помилку, зберігає її у error', async () => {
        const {fetchSchedules, error} = useCaseGetSchedules(schedulesStore);

        scheduleService.getSchedules.mockRejectedValue(new Error('Server Error'));

        const unit = 5
        const dateFrom = '2025-12-10'
        const dateTo = '2025-12-11'
        await fetchSchedules(unit, dateFrom, dateTo);

        expect(error.value).toBe('Server Error');
    });

    test('скасовує запит через AbortController', async () => {
        const {fetchSchedules, cancelRequest, loading} = useCaseGetSchedules(schedulesStore);

        scheduleService.getSchedules.mockImplementation(() =>
            new Promise((_, reject) => setTimeout(() => reject(new Error('canceled')), 100))
        );

        const unit = 5
        const dateFrom = '2025-12-10'
        const dateTo = '2025-12-11'
        fetchSchedules(unit, dateFrom, dateTo);
        cancelRequest();

        expect(loading.value).toBe(false);
    });

    test('спроба скасувати запит через AbortController коли він завершений', async () => {
        const {fetchSchedules, cancelRequest, loading} = useCaseGetSchedules(schedulesStore);

        scheduleService.getSchedules.mockImplementation(() =>
            new Promise((_, reject) => setTimeout(() => reject(new Error('canceled')), 100))
        );

        const unit = 5
        const dateFrom = '2025-12-10'
        const dateTo = '2025-12-11'
        fetchSchedules(unit, dateFrom, dateTo);
        loading.value = false
        cancelRequest();
        expect(loading.value).toBe(false);
    });
});
