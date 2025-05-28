import {describe, test, expect, vi, beforeEach} from 'vitest';
import getConnect from "../../../src/composables/services/getConnect";
import {
    API_URL_GET_UNITS,
    API_URL_POST_UNITS
} from '../../../src/composables/services/unitService'; // Імпорт API URL
import unitService from "../../../src/composables/services/unitService";

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

        const signal = {}; // Можна передати реальний AbortSignal

        const result = await unitService.getUnits(signal);

        expect(getConnect.get).toHaveBeenCalledWith(API_URL_GET_UNITS(), signal);
        expect(result).toEqual(mockResponse);
    });

    test('should handle API errors', async () => {
        getConnect.get.mockRejectedValue(new Error('Network error'));

        const signal = {}; // Можна передати реальний AbortSignal

        await expect(unitService.getUnits(signal)).rejects.toThrow('Network error');
        expect(getConnect.get).toHaveBeenCalledWith(API_URL_GET_UNITS(), signal);
    });
});

describe('postStatuses', () => {
    test('should save statuses by post successfully', async () => {
        const mockResponse = {data: [{id: 1, name: 'John Doe'}]};
        getConnect.post.mockResolvedValue(mockResponse);

        const units = {id: 1, name: 'John Doe'};
        const signal = {}; // Можна передати реальний AbortSignal

        const result = await unitService.postUnits(units, signal);

        expect(getConnect.post).toHaveBeenCalledWith(API_URL_POST_UNITS(), units, signal);
        expect(result).toEqual(mockResponse);
    });

    test('should handle API errors', async () => {
        getConnect.post.mockRejectedValue(new Error('Network error'));

        const units = {id: 1, name: 'John Doe'};
        const signal = {}; // Можна передати реальний AbortSignal

        await expect(unitService.postUnits(units, signal)).rejects.toThrow('Network error');
        expect(getConnect.post).toHaveBeenCalledWith(API_URL_POST_UNITS(), units, signal);
    });
});
