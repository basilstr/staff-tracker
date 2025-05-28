import {describe, test, expect, vi, beforeEach} from 'vitest';
import getConnect from "../../../src/composables/services/getConnect";
import {
    API_URL_FETCH_SCHEDULES,
    API_URL_SET_GROUP,
    API_URL_SET_EMPLOYEE
} from '../../../src/composables/services/scheduleService'; // Імпорт API URL
import scheduleService from "../../../src/composables/services/scheduleService";

vi.mock('../../../src/composables/services/getConnect', () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
    }
}));

beforeEach(() => {
    vi.clearAllMocks();
});

describe('getSchedules', () => {
    test('should fetch schedules successfully', async () => {
        const mockResponse = {data: [{id: 1, name: 'John Doe'}]};
        getConnect.get.mockResolvedValue(mockResponse);

        const unit = 123;
        const dateFrom = '2025-12-12'
        const dateTo = '2025-12-22'
        const signal = {}; // Можна передати реальний AbortSignal

        const result = await scheduleService.getSchedules(unit, dateFrom, dateTo, signal);

        expect(getConnect.get).toHaveBeenCalledWith(API_URL_FETCH_SCHEDULES(unit, dateFrom, dateTo), signal);
        expect(result).toEqual(mockResponse);
    });

    test('should handle API errors', async () => {
        getConnect.get.mockRejectedValue(new Error('Network error'));

        const unit = 123;
        const dateFrom = '2025-12-12'
        const dateTo = '2025-12-22'
        const signal = {}; // Можна передати реальний AbortSignal

        await expect(scheduleService.getSchedules(unit, dateFrom, dateTo, signal)).rejects.toThrow('Network error');
        expect(getConnect.get).toHaveBeenCalledWith(API_URL_FETCH_SCHEDULES(unit, dateFrom, dateTo), signal);
    });
});

describe('setGroup', () => {
    test('should set group schedules successfully', async () => {
        const mockResponse = {data: [{id: 1, name: 'John Doe'}]};
        getConnect.post.mockResolvedValue(mockResponse);

        const unit = 123;
        const dateFrom = '2025-12-12'
        const dateTo = '2025-12-22'
        const data = {id: 1, name: 'John Doe'};
        const signal = {}; // Можна передати реальний AbortSignal

        const result = await scheduleService.setGroup(unit, dateFrom, dateTo, data, signal);

        expect(getConnect.post).toHaveBeenCalledWith(API_URL_SET_GROUP(unit, dateFrom, dateTo), data, signal);
        expect(result).toEqual(mockResponse);
    });

    test('should handle API errors', async () => {
        getConnect.post.mockRejectedValue(new Error('Network error'));

        const unit = 123;
        const dateFrom = '2025-12-12'
        const dateTo = '2025-12-22'
        const data = {id: 1, name: 'John Doe'};
        const signal = {}; // Можна передати реальний AbortSignal

        await expect(scheduleService.setGroup(unit, dateFrom, dateTo, data, signal)).rejects.toThrow('Network error');
        expect(getConnect.post).toHaveBeenCalledWith(API_URL_SET_GROUP(unit, dateFrom, dateTo), data, signal);
    });
});

describe('setEmployee', () => {
    test('should set employee schedules successfully', async () => {
        const mockResponse = {data: [{id: 1, name: 'John Doe'}]};
        getConnect.post.mockResolvedValue(mockResponse);

        const id = 123;
        const dateFrom = '2025-12-12'
        const dateTo = '2025-12-22'
        const data = {id: 1, name: 'John Doe'};
        const signal = {}; // Можна передати реальний AbortSignal

        const result = await scheduleService.setEmployee(id, dateFrom, dateTo, data, signal);

        expect(getConnect.post).toHaveBeenCalledWith(API_URL_SET_EMPLOYEE(id, dateFrom, dateTo), data, signal);
        expect(result).toEqual(mockResponse);
    });

    test('should handle API errors', async () => {
        getConnect.post.mockRejectedValue(new Error('Network error'));

        const id = 123;
        const dateFrom = '2025-12-12'
        const dateTo = '2025-12-22'
        const data = {id: 1, name: 'John Doe'};
        const signal = {}; // Можна передати реальний AbortSignal

        await expect(scheduleService.setEmployee(id, dateFrom, dateTo, data, signal)).rejects.toThrow('Network error');
        expect(getConnect.post).toHaveBeenCalledWith(API_URL_SET_EMPLOYEE(id, dateFrom, dateTo), data, signal);
    });
});

