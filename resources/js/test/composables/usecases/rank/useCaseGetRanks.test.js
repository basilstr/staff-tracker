import { describe, test, expect, vi, beforeEach } from 'vitest';
import { useCaseGetRanks } from '../../../../src/composables/usecases/rank/useCaseGetRanks';
import employeeService from '../../../../src/composables/services/employeeService';
import ranksStore from '../../../../src/composables/store/ranksStore';

vi.mock('../../../../src/composables/services/employeeService', () => ({
    default: {
        getRanks: vi.fn(),
    },
}));

vi.mock('../../../../src/composables/store/ranksStore', () => ({
    default: {
        isEmptyRanks: vi.fn(() => true),
        setRanks: vi.fn(),
    },
}));

describe('useCaseGetRanks', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    test('початкові значення змінних ref()', () => {
        const { loading, error, authError } = useCaseGetRanks(ranksStore);

        expect(loading.value).toBe(false);
        expect(error.value).toBe(null);
        expect(authError.value).toBe(false);
    });

    test('отримує дані та зберігає їх у unitsStore', async () => {
        const { fetchRanks, loading, error } = useCaseGetRanks(ranksStore);

        const mockData = [
            {id: 10, name: 'заборона перегляду статусів'},
            {id: 20, name: 'можливість перегляду статусів'},
            {id: 30, name: 'змінювати тільки власний статус'},
            {id: 40, name: 'змінювати статус персоналу групи'},
            {id: 50, name: 'права адміністратора групи'},
            {id: 60, name: 'права власника групи'},
        ];
        employeeService.getRanks.mockResolvedValue(mockData);

        await fetchRanks();

        expect(loading.value).toBe(false);
        expect(error.value).toBe(null);
        const returnData = [
            {id: 10, name: 'заборона перегляду статусів'},
            {id: 20, name: 'можливість перегляду статусів'},
            {id: 30, name: 'змінювати тільки власний статус'},
            {id: 40, name: 'змінювати статус персоналу групи'},
            {id: 50, name: 'права адміністратора групи'},
            {id: 60, name: 'права власника групи'},
        ];
        expect(ranksStore.setRanks).toHaveBeenCalledWith(returnData);
    });

    test('якщо unitsStore не порожній, не виконує запит', async () => {
        ranksStore.isEmptyRanks.mockReturnValue(false);

        const { fetchRanks, loading } = useCaseGetRanks(ranksStore);

        await fetchRanks();

        expect(employeeService.getRanks).not.toHaveBeenCalled();
        expect(loading.value).toBe(false);
    });

    test('якщо сервер повертає помилку авторизації, встановлює authError', async () => {
        const { fetchRanks, authError } = useCaseGetRanks(ranksStore);

        employeeService.getRanks.mockRejectedValue(new Error('AuthError'));

        await fetchRanks();

        expect(authError.value).toBe(true);
    });

    test('якщо сервер повертає іншу помилку, зберігає її у error', async () => {
        const { fetchRanks, error } = useCaseGetRanks(ranksStore);

        employeeService.getRanks.mockRejectedValue(new Error('Server Error'));

        await fetchRanks();

        expect(error.value).toBe('Server Error');
    });

    test('скасовує запит через AbortController', async () => {
        const { fetchRanks, cancelRequest, loading } = useCaseGetRanks(ranksStore);

        employeeService.getRanks.mockImplementation(() =>
            new Promise((_, reject) => setTimeout(() => reject(new Error('canceled')), 100))
        );

        fetchRanks();
        cancelRequest();

        expect(loading.value).toBe(false);
    });

    test('спроба скасувати запит через AbortController коли він завершений', async () => {
        const { fetchRanks, cancelRequest, loading } = useCaseGetRanks(ranksStore);

        employeeService.getRanks.mockImplementation(() =>
            new Promise((_, reject) => setTimeout(() => reject(new Error('canceled')), 100))
        );

        fetchRanks();
        loading.value = false
        cancelRequest();
        expect(loading.value).toBe(false);
    });
});
