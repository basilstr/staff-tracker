import { describe, test, expect, vi, beforeEach } from 'vitest';
import { useCaseGetUnits } from '../../../../src/composables/usecases/unit/useCaseGetUnits';
import unitService from '../../../../src/composables/services/unitService';
import unitsStore from '../../../../src/composables/store/unitsStore';

vi.mock('../../../../src/composables/services/unitService', () => ({
    default: {
        getUnits: vi.fn(),
    },
}));

vi.mock('../../../../src/composables/store/unitsStore', () => ({
    default: {
        isEmptyUnits: vi.fn(() => true),
        setUnits: vi.fn(),
    },
}));

describe('useCaseGetUnits', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    test('початкові значення змінних ref()', () => {
        const { loading, error, authError } = useCaseGetUnits(unitsStore);

        expect(loading.value).toBe(false);
        expect(error.value).toBe(null);
        expect(authError.value).toBe(false);
    });

    test('отримує дані та зберігає їх у unitsStore', async () => {
        const { fetchUnits, loading, error } = useCaseGetUnits(unitsStore);

        const mockData = [
            {id: 7, sort: 7, name: "Група № 4", edited: false},
            {id: 1, sort: 1, name: "Група № 1", edited: false},
        ];
        unitService.getUnits.mockResolvedValue(mockData);

        await fetchUnits();

        expect(loading.value).toBe(false);
        expect(error.value).toBe(null);
        const returnData = [
            {id: 1, sort: 1, name: "Група № 1", edited: false},
            {id: 7, sort: 7, name: "Група № 4", edited: false},
        ];
        expect(unitsStore.setUnits).toHaveBeenCalledWith(returnData);
    });

    test('якщо unitsStore не порожній, не виконує запит', async () => {
        unitsStore.isEmptyUnits.mockReturnValue(false);

        const { fetchUnits, loading } = useCaseGetUnits(unitsStore);

        await fetchUnits();

        expect(unitService.getUnits).not.toHaveBeenCalled();
        expect(loading.value).toBe(false);
    });

    test('якщо сервер повертає помилку авторизації, встановлює authError', async () => {
        const { fetchUnits, authError } = useCaseGetUnits(unitsStore);

        unitService.getUnits.mockRejectedValue(new Error('AuthError'));

        await fetchUnits();

        expect(authError.value).toBe(true);
    });

    test('якщо сервер повертає іншу помилку, зберігає її у error', async () => {
        const { fetchUnits, error } = useCaseGetUnits(unitsStore);

        unitService.getUnits.mockRejectedValue(new Error('Server Error'));

        await fetchUnits();

        expect(error.value).toBe('Server Error');
    });

    test('скасовує запит через AbortController', async () => {
        const { fetchUnits, cancelRequest, loading } = useCaseGetUnits(unitsStore);

        unitService.getUnits.mockImplementation(() =>
            new Promise((_, reject) => setTimeout(() => reject(new Error('canceled')), 100))
        );

        fetchUnits();
        cancelRequest();

        expect(loading.value).toBe(false);
    });

    test('спроба скасувати запит через AbortController коли він завершений', async () => {
        const { fetchUnits, cancelRequest, loading } = useCaseGetUnits(unitsStore);

        unitService.getUnits.mockImplementation(() =>
            new Promise((_, reject) => setTimeout(() => reject(new Error('canceled')), 100))
        );

        fetchUnits();
        loading.value = false
        cancelRequest();
        expect(loading.value).toBe(false);
    });
});
