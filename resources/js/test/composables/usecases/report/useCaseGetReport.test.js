import { describe, test, expect, vi, beforeEach } from 'vitest';
import { useCaseGetReport } from '../../../../src/composables/usecases/report/useCaseGetReport';
import reportService from '../../../../src/composables/services/reportService';
import reportStore from '../../../../src/composables/store/reportStore';

vi.mock('../../../../src/composables/services/reportService', () => ({
    default: {
        getReport: vi.fn(),
    },
}));

vi.mock('../../../../src/composables/store/reportStore', () => ({
    default: {
        isEmptyReport: vi.fn(() => true),
        setReport: vi.fn(),
        clearReport: vi.fn(),
    },
}));

describe('useCaseGetReport', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    test('початкові значення змінних ref()', () => {
        const { loading, error, authError } = useCaseGetReport(reportStore);

        expect(loading.value).toBe(false);
        expect(error.value).toBe(null);
        expect(authError.value).toBe(false);
    });

    test('отримує дані та зберігає їх у reportStore', async () => {
        const { fetchReport, loading, error } = useCaseGetReport(reportStore);

        const mockData = {
            unit: 1,
            date_from: '2025-12-12',
            date_to: '2025-12-15',
            report: {
                '1001': {8: [1,1,1], 9: [1,1,1], 3: [1,2,3], 6: [2,3,4]},
                '1002': {2: [1,1,1], 1: [1,1,1], 3: [1,2,3], 6: [2,3,4]},
                '1003': {2: [1,1,1], 1: [1,1,1], 3: [1,2,3], 6: [2,3,4]},
                '1004': {5: [1,1,1], 7: [1,1,1], 3: [1,2,3], 6: [2,3,4]},
                '1005': {5: [1,1,1], 7: [1,1,1], 3: [1,2,3], 4: [2,3,4]},
                '1006': {2: [1,1,1], 1: [1,1,1], 3: [1,2,3], 4: [2,3,4]},
                '1007': {2: [1,1,1], 1: [1,1,1], 3: [1,2,3], 4: [2,3,4]},
            }
        }
        reportService.getReport.mockResolvedValue(mockData);

        const unit = 1
        const dateFrom = '2025-12-12'
        const dateTo = '2025-12-15'
        await fetchReport(unit, dateFrom, dateTo);

        expect(loading.value).toBe(false);
        expect(error.value).toBe(null);
        const returnData = {
            unit: 1,
            dateFrom: '2025-12-12',
            dateTo: '2025-12-15',
            reportData: {
                '1001': {8: [1,1,1], 9: [1,1,1], 3: [1,2,3], 6: [2,3,4]},
                '1002': {2: [1,1,1], 1: [1,1,1], 3: [1,2,3], 6: [2,3,4]},
                '1003': {2: [1,1,1], 1: [1,1,1], 3: [1,2,3], 6: [2,3,4]},
                '1004': {5: [1,1,1], 7: [1,1,1], 3: [1,2,3], 6: [2,3,4]},
                '1005': {5: [1,1,1], 7: [1,1,1], 3: [1,2,3], 4: [2,3,4]},
                '1006': {2: [1,1,1], 1: [1,1,1], 3: [1,2,3], 4: [2,3,4]},
                '1007': {2: [1,1,1], 1: [1,1,1], 3: [1,2,3], 4: [2,3,4]},
            }
        }
        expect(reportStore.setReport).toHaveBeenCalledWith(returnData);
    });

    test('якщо reportStore не порожній, не виконує запит', async () => {
        reportStore.isEmptyReport.mockReturnValue(false);

        const { fetchReport, loading } = useCaseGetReport(reportStore);

        const unit = 1
        const dateFrom = '2025-12-12'
        const dateTo = '2025-12-15'
        await fetchReport(unit, dateFrom, dateTo);

        expect(reportService.getReport).not.toHaveBeenCalled();
        expect(loading.value).toBe(false);
    });

    test('якщо даних немає не виконуємо запит 1', async () => {
        const { fetchReport, loading } = useCaseGetReport(reportStore);

        const unit = null
        const dateFrom = '2025-12-12'
        const dateTo = '2025-12-15'
        await fetchReport(unit, dateFrom, dateTo);

        expect(reportStore.isEmptyReport).not.toHaveBeenCalled();
        expect(loading.value).toBe(false);
    });

    test('якщо даних немає не виконуємо запит 2', async () => {
        const { fetchReport, loading } = useCaseGetReport(reportStore);

        const unit = 2
        const dateFrom = null
        const dateTo = '2025-12-15'
        await fetchReport(unit, dateFrom, dateTo);

        expect(reportStore.isEmptyReport).not.toHaveBeenCalled();
        expect(loading.value).toBe(false);
    });

    test('якщо даних немає не виконуємо запит 1', async () => {
        const { fetchReport, loading } = useCaseGetReport(reportStore);

        const unit = 3
        const dateFrom = '2025-12-12'
        const dateTo = null
        await fetchReport(unit, dateFrom, dateTo);

        expect(reportStore.isEmptyReport).not.toHaveBeenCalled();
        expect(loading.value).toBe(false);
    });

    test('якщо сервер повертає помилку авторизації, встановлює authError', async () => {
        const { fetchReport, authError } = useCaseGetReport(reportStore);

        reportService.getReport.mockRejectedValue(new Error('AuthError'));

        const unit = 1
        const dateFrom = '2025-12-12'
        const dateTo = '2025-12-15'
        await fetchReport(unit, dateFrom, dateTo);

        expect(authError.value).toBe(true);
    });

    test('якщо сервер повертає іншу помилку, зберігає її у error', async () => {
        const { fetchReport, error } = useCaseGetReport(reportStore);

        reportService.getReport.mockRejectedValue(new Error('Server Error'));

        const unit = 1
        const dateFrom = '2025-12-12'
        const dateTo = '2025-12-15'
        await fetchReport(unit, dateFrom, dateTo);

        expect(error.value).toBe('Server Error');
    });

    test('скасовує запит через AbortController', async () => {
        const { fetchReport, cancelRequest, loading } = useCaseGetReport(reportStore);

        reportService.getReport.mockImplementation(() =>
            new Promise((_, reject) => setTimeout(() => reject(new Error('canceled')), 100))
        );

        const unit = 1
        const dateFrom = '2025-12-12'
        const dateTo = '2025-12-15'
        fetchReport(unit, dateFrom, dateTo);
        cancelRequest();

        expect(loading.value).toBe(false);
    });

    test('спроба скасувати запит через AbortController коли він завершений', async () => {
        const { fetchReport, cancelRequest, loading } = useCaseGetReport(reportStore);

        reportService.getReport.mockImplementation(() =>
            new Promise((_, reject) => setTimeout(() => reject(new Error('canceled')), 100))
        );

        const unit = 1
        const dateFrom = '2025-12-12'
        const dateTo = '2025-12-15'
        await fetchReport(unit, dateFrom, dateTo);
        loading.value = false
        cancelRequest();
        expect(loading.value).toBe(false);
    });
});
