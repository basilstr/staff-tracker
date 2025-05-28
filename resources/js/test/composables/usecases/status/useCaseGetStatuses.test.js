import {describe, test, expect, vi, beforeEach} from 'vitest';
import {useCaseGetStatuses} from '../../../../src/composables/usecases/status/useCaseGetStatuses';
import statusService from '../../../../src/composables/services/statusService';
import statusesStore from '../../../../src/composables/store/statusesStore';

vi.mock('../../../../src/composables/services/statusService', () => ({
    default: {
        getStatuses: vi.fn(),
    },
}));

vi.mock('../../../../src/composables/store/statusesStore', () => ({
    default: {
        isEmptyStatuses: vi.fn(() => true),
        setStatuses: vi.fn(),
        clearStatuses: vi.fn(),
    },
}));

describe('useCaseGetStatuses', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    test('початкові значення змінних ref()', () => {
        const {loading, error, authError} = useCaseGetStatuses(statusesStore);

        expect(loading.value).toBe(false);
        expect(error.value).toBe(null);
        expect(authError.value).toBe(false);
    });

    test('отримує дані та зберігає їх у statusesStore', async () => {
        const {fetchStatuses, loading, error} = useCaseGetStatuses(statusesStore);

        const unit = 3
        const mockData = [
            {
                id: 3,
                sort: 8,
                name: "Вихідний",
                short_name: "вхд",
                is_group: true,
                text_color: "#000000",
                bg_color: "#ffff99",
                deleted_at: null
            },
            {
                id: 2,
                sort: 4,
                name: "ВИДАЛЕНИЙ",
                short_name: "вхд",
                is_group: false,
                text_color: "#000000",
                bg_color: "#ffff99",
                deleted_at: '2025-02-22 12:12:12'
            },
        ];
        statusService.getStatuses.mockResolvedValue(mockData);

        await fetchStatuses(unit);

        expect(loading.value).toBe(false);
        expect(error.value).toBe(null);
        const returnData = [
            {
                id: 2,
                sort: 4,
                fullName: "ВИДАЛЕНИЙ",
                shortName: "вхд",
                group: false,
                textColor: "#000000",
                bgColor: "#ffff99",
                deletedAt: '2025-02-22 12:12:12'
            },
            {
                id: 3,
                sort: 8,
                fullName: "Вихідний",
                shortName: "вхд",
                group: true,
                textColor: "#000000",
                bgColor: "#ffff99",
                deletedAt: null
            },
        ];
        expect(statusesStore.setStatuses).toHaveBeenCalledWith(unit, returnData);
    });

    test('якщо unitsStore не порожній, не виконує запит', async () => {
        statusesStore.isEmptyStatuses.mockReturnValue(false);

        const {fetchStatuses, loading} = useCaseGetStatuses(statusesStore);

        const unit = 3
        await fetchStatuses(unit);

        expect(statusService.getStatuses).not.toHaveBeenCalled();
        expect(loading.value).toBe(false);
    });

    test('якщо unit порожній, не виконує запит', async () => {
        statusesStore.isEmptyStatuses.mockReturnValue(false);

        const {fetchStatuses, loading} = useCaseGetStatuses(statusesStore);

        const unit = null
        await fetchStatuses(unit);

        expect(statusService.getStatuses).not.toHaveBeenCalled();
        expect(loading.value).toBe(false);
    });

    test('якщо сервер повертає помилку авторизації, встановлює authError', async () => {
        const {fetchStatuses, authError} = useCaseGetStatuses(statusesStore);

        statusService.getStatuses.mockRejectedValue(new Error('AuthError'));

        const unit = 3
        await fetchStatuses(unit);

        expect(authError.value).toBe(true);
    });

    test('якщо сервер повертає іншу помилку, зберігає її у error', async () => {
        const {fetchStatuses, error} = useCaseGetStatuses(statusesStore);

        statusService.getStatuses.mockRejectedValue(new Error('Server Error'));

        const unit = 3
        await fetchStatuses(unit);

        expect(error.value).toBe('Server Error');
    });

    test('скасовує запит через AbortController', async () => {
        const {fetchStatuses, cancelRequest, loading} = useCaseGetStatuses(statusesStore);

        statusService.getStatuses.mockImplementation(() =>
            new Promise((_, reject) => setTimeout(() => reject(new Error('canceled')), 100))
        );

        const unit = 3
        fetchStatuses(unit);
        cancelRequest();

        expect(loading.value).toBe(false);
    });

    test('спроба скасувати запит через AbortController коли він завершений', async () => {
        const {fetchStatuses, cancelRequest, loading} = useCaseGetStatuses(statusesStore);

        statusService.getStatuses.mockImplementation(() =>
            new Promise((_, reject) => setTimeout(() => reject(new Error('canceled')), 100))
        );

        fetchStatuses();
        loading.value = false
        cancelRequest();
        expect(loading.value).toBe(false);
    });
});
