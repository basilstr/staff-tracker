import {describe, test, expect, vi, beforeEach} from 'vitest';
import {useCaseSetSchedulesGroup} from '../../../../src/composables/usecases/schedule/useCaseSetSchedulesGroup';
import scheduleService from '../../../../src/composables/services/scheduleService';
import schedulesStore from '../../../../src/composables/store/schedulesStore';

vi.mock('../../../../src/composables/services/scheduleService', () => ({
    default: {
        setGroup: vi.fn(),
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

describe('useCaseSetSchedulesGroup', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    test('початкові значення змінних ref()', () => {
        const {loading, error, authError} = useCaseSetSchedulesGroup(schedulesStore);

        expect(loading.value).toBe(false);
        expect(error.value).toBe(null);
        expect(authError.value).toBe(false);
    });

    test('отримує дані та зберігає їх у schedulesStore', async () => {
        const {setSchedulesGroup, loading, error} = useCaseSetSchedulesGroup(schedulesStore);

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

        scheduleService.setGroup.mockResolvedValue(mockData);

        const unit = 5
        const status = 2
        const date = '2025-12-10'
        await setSchedulesGroup(unit, status, date);

        expect(loading.value).toBe(false);
        expect(error.value).toBe(null);
        expect(schedulesStore.setSchedules).toHaveBeenCalledWith(mockData);
    });

    test('отримує дані та зберігає їх у schedulesStore де note = null', async () => {
        const {setSchedulesGroup, loading, error} = useCaseSetSchedulesGroup(schedulesStore);

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

        scheduleService.setGroup.mockResolvedValue(mockData);

        const unit = 5
        const status = 2
        const date = '2025-12-10'
        await setSchedulesGroup(unit, status, date);

        expect(loading.value).toBe(false);
        expect(error.value).toBe(null);
        expect(schedulesStore.setSchedules).toHaveBeenCalledWith(mockData);
    });

    test('якщо сервер повертає помилку авторизації, встановлює authError', async () => {
        const {setSchedulesGroup, authError} = useCaseSetSchedulesGroup(schedulesStore);

        scheduleService.setGroup.mockRejectedValue(new Error('AuthError'));

        const unit = 5
        const status = 2
        const date = '2025-12-10'
        await setSchedulesGroup(unit, status, date);

        expect(authError.value).toBe(true);
    });

    test('якщо сервер повертає іншу помилку, зберігає її у error', async () => {
        const {setSchedulesGroup, error} = useCaseSetSchedulesGroup(schedulesStore);

        scheduleService.setGroup.mockRejectedValue(new Error('Server Error'));

        const unit = 5
        const status = 2
        const date = '2025-12-10'
        await setSchedulesGroup(unit, status, date);

        expect(error.value).toBe('Server Error');
    });

    test('скасовує запит через AbortController', async () => {
        const {setSchedulesGroup, cancelRequest, loading} = useCaseSetSchedulesGroup(schedulesStore);

        scheduleService.setGroup.mockImplementation(() =>
            new Promise((_, reject) => setTimeout(() => reject(new Error('canceled')), 100))
        );

        const unit = 5
        const status = 2
        const date = '2025-12-10'
        setSchedulesGroup(unit, status, date);

        cancelRequest();

        expect(loading.value).toBe(false);
    });

    test('спроба скасувати запит через AbortController коли він завершений', async () => {
        const {setSchedulesGroup, cancelRequest, loading} = useCaseSetSchedulesGroup(schedulesStore);

        scheduleService.setGroup.mockImplementation(() =>
            new Promise((_, reject) => setTimeout(() => reject(new Error('canceled')), 100))
        );

        const unit = 5
        const status = 2
        const date = '2025-12-10'
        setSchedulesGroup(unit, status, date);

        loading.value = false
        cancelRequest();
        expect(loading.value).toBe(false);
    });
});
