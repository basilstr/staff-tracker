import {describe, test, expect, vi, beforeEach} from 'vitest';
import {useCaseSaveUnits} from '../../../../src/composables/usecases/unit/useCaseSaveUnits';
import unitService from '../../../../src/composables/services/unitService';
import unitsStore from '../../../../src/composables/store/unitsStore';

vi.mock('../../../../src/composables/services/unitService', () => ({
    default: {
        postUnits: vi.fn(),
    },
}));

vi.mock('../../../../src/composables/store/unitsStore', () => ({
    default: {
        isEmptyUnits: vi.fn(() => true),
        setUnits: vi.fn(),
    },
}));

describe('useCaseSaveUnits', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    test('початкові значення змінних ref()', () => {
        const {loading, error, authError} = useCaseSaveUnits(unitsStore);

        expect(loading.value).toBe(false);
        expect(error.value).toBe(null);
        expect(authError.value).toBe(false);
    });

    test('отримує дані передає на сервер та зберігає отримані з сервера дані у unitsStore', async () => {
        const {saveUnits, loading, error} = useCaseSaveUnits(unitsStore);

        const mockData = [
            {id: 7, sort: 7, name: "Група № 4"},
            {id: 1, sort: 1, name: "Група № 1"},
        ]

        const returnedData = [
            {id: 1, sort: 1, name: "Група № 1", edited: false},
            {id: 7, sort: 7, name: "Група № 4", edited: false},
        ]

        unitService.postUnits.mockResolvedValue(returnedData);

        await saveUnits(mockData)

        expect(loading.value).toBe(false);
        expect(error.value).toBe(null);

        const returnData = [
            {id: 1, sort: 1, name: "Група № 1", edited: false},
            {id: 7, sort: 7, name: "Група № 4", edited: false},
        ];
        expect(unitsStore.setUnits).toHaveBeenCalledWith(returnData);
    });

    test('якщо сервер повертає помилку авторизації, встановлює authError', async () => {
        const {saveUnits, authError} = useCaseSaveUnits(unitsStore);

        unitService.postUnits.mockRejectedValue(new Error('AuthError'));

        await saveUnits([
            {id: 7, sort: 7, name: "Група № 4"},
            {id: 1, sort: 1, name: "Група № 1"},
        ]);

        expect(authError.value).toBe(true);
    });

    test('якщо сервер повертає іншу помилку, зберігає її у error', async () => {
        const {saveUnits, error} = useCaseSaveUnits(unitsStore);

        unitService.postUnits.mockRejectedValue(new Error('Server Error'));

        const mockData = [
            {id: 1, sort: 1, name: "Група № 1", edited: false},
            {id: 7, sort: 7, name: "Група № 4", edited: false},
        ];
        await saveUnits(mockData);

        expect(error.value).toBe('Server Error');
    });

    test('скасовує запит через AbortController', async () => {
        const {cancelRequest, saveUnits, loading} = useCaseSaveUnits(unitsStore);

        unitService.postUnits.mockImplementation(() =>
            new Promise((_, reject) => setTimeout(() => reject(new Error('canceled')), 100))
        );

        const mockData = [
            {id: 1, sort: 1, name: "Група № 1", edited: false},
            {id: 7, sort: 7, name: "Група № 4", edited: false},
        ];
        await saveUnits(mockData);

        cancelRequest();

        expect(loading.value).toBe(false);
    });

    test('спроба скасувати запит через AbortController коли він завершений', async () => {
        const {saveUnits, cancelRequest, loading} = useCaseSaveUnits(unitsStore);

        unitService.postUnits.mockImplementation(() =>
            new Promise((_, reject) => setTimeout(() => reject(new Error('canceled')), 100))
        );

        await saveUnits();
        loading.value = false
        cancelRequest();
        expect(loading.value).toBe(false);
    });
});
