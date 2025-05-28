import {describe, test, expect, vi, beforeEach} from 'vitest';
import getConnect from "../../../src/composables/services/getConnect";
import {
    API_URL_GET_STATUSES,
    API_URL_POST_STATUSES
} from '../../../src/composables/services/statusService'; // Імпорт API URL
import statusService from "../../../src/composables/services/statusService";

vi.mock('../../../src/composables/services/getConnect', () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
    }
}));

beforeEach(() => {
    vi.clearAllMocks();
});

describe('getStatuses', () => {
    test('should fetch statuses successfully', async () => {
        const mockResponse = {data: [{id: 1, name: 'John Doe'}]};
        getConnect.get.mockResolvedValue(mockResponse);

        const unit = 123;
        const signal = {}; // Можна передати реальний AbortSignal

        const result = await statusService.getStatuses(unit, signal);

        expect(getConnect.get).toHaveBeenCalledWith(API_URL_GET_STATUSES(unit), signal);
        expect(result).toEqual(mockResponse);
    });

    test('should handle API errors', async () => {
        getConnect.get.mockRejectedValue(new Error('Network error'));

        const unit = 123;
        const dateFrom = '2025-12-12'
        const dateTo = '2025-12-22'
        const signal = {}; // Можна передати реальний AbortSignal

        await expect(statusService.getStatuses(unit, signal)).rejects.toThrow('Network error');
        expect(getConnect.get).toHaveBeenCalledWith(API_URL_GET_STATUSES(unit), signal);
    });
});

describe('postStatuses', () => {
    test('should save statuses by post successfully', async () => {
        const mockResponse = {data: [{id: 1, name: 'John Doe'}]};
        getConnect.post.mockResolvedValue(mockResponse);

        const unit = 123;
        const data = {id: 1, name: 'John Doe'};
        const signal = {}; // Можна передати реальний AbortSignal

        const result = await statusService.postStatuses(unit, data, signal);

        expect(getConnect.post).toHaveBeenCalledWith(API_URL_POST_STATUSES(unit), data, signal);
        expect(result).toEqual(mockResponse);
    });

    test('should handle API errors', async () => {
        getConnect.post.mockRejectedValue(new Error('Network error'));

        const unit = 123;
        const data = {id: 1, name: 'John Doe'};
        const signal = {}; // Можна передати реальний AbortSignal

        await expect(statusService.postStatuses(unit, data, signal)).rejects.toThrow('Network error');
        expect(getConnect.post).toHaveBeenCalledWith(API_URL_POST_STATUSES(unit), data, signal);
    });
});
