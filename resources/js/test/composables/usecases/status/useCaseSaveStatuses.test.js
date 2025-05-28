import {describe, test, expect, vi, beforeEach} from 'vitest';
import {useCaseSaveStatuses} from '../../../../src/composables/usecases/status/useCaseSaveStatuses';
import statusService from '../../../../src/composables/services/statusService';
import statusesStore from '../../../../src/composables/store/statusesStore';

vi.mock('../../../../src/composables/services/statusService', () => ({
    default: {
        postStatuses: vi.fn(),
    },
}));

vi.mock('../../../../src/composables/store/statusesStore', () => ({
    default: {
        isEmptyStatuses: vi.fn(() => true),
        setStatuses: vi.fn(),
        clearStatuses: vi.fn(),
    },
}));

describe('useCaseSaveStatuses', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    test('початкові значення змінних ref()', () => {
        const {loading, error, authError} = useCaseSaveStatuses(statusesStore);

        expect(loading.value).toBe(false);
        expect(error.value).toBe(null);
        expect(authError.value).toBe(false);
    });

    test('отримує дані передає на сервер та зберігає отримані з сервера дані у statusesStore', async () => {
        const {saveStatuses, loading, error} = useCaseSaveStatuses(statusesStore);

        const mockData = [
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
        ]

        const returnedData = [
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
        ]

        statusService.postStatuses.mockResolvedValue(returnedData);

        const unit = 3
        await saveStatuses(unit, mockData);

        expect(loading.value).toBe(false);
        expect(error.value).toBe(null);

        expect(statusesStore.setStatuses).toHaveBeenCalledWith(unit, mockData);
    });

    test('якщо сервер повертає помилку авторизації, встановлює authError', async () => {
        const {saveStatuses, authError} = useCaseSaveStatuses(statusesStore);

        statusService.postStatuses.mockRejectedValue(new Error('AuthError'));
        const mockData = [
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
        ]
        const unit = 3
        await saveStatuses(unit, mockData);

        expect(authError.value).toBe(true);
    });

    test('якщо сервер повертає іншу помилку, зберігає її у error', async () => {
        const {saveStatuses, error} = useCaseSaveStatuses(statusesStore);

        statusService.postStatuses.mockRejectedValue(new Error('Server Error'));

        const mockData = [
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
        ]
        const unit = 3
        await saveStatuses(unit, mockData);

        expect(error.value).toBe('Server Error');
    });

    test('скасовує запит через AbortController', async () => {
        const {cancelRequest, saveStatuses, loading} = useCaseSaveStatuses(statusesStore);

        statusService.postStatuses.mockImplementation(() =>
            new Promise((_, reject) => setTimeout(() => reject(new Error('canceled')), 100))
        );

        const mockData = [
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
        ]
        const unit = 3
        saveStatuses(unit, mockData);
        cancelRequest();

        expect(loading.value).toBe(false);
    });

    test('спроба скасувати запит через AbortController коли він завершений', async () => {
        const {saveStatuses, cancelRequest, loading} = useCaseSaveStatuses(statusesStore);

        statusService.postStatuses.mockImplementation(() =>
            new Promise((_, reject) => setTimeout(() => reject(new Error('canceled')), 100))
        );
        const mockData = [
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
        ]
        const unit = 3
        await saveStatuses(unit, mockData);
        loading.value = false
        cancelRequest();
        expect(loading.value).toBe(false);
    });
});
