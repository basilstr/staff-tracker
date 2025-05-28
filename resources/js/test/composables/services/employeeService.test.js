import {describe, test, expect, vi, beforeEach} from 'vitest';
import getConnect from "../../../src/composables/services/getConnect";
import {
    API_URL_DELETE_EMPLOYEE,
    API_URL_GET_EMPLOYEE,
    API_URL_GET_EMPLOYEES, API_URL_GET_INVITE, API_URL_GET_RANKS, API_URL_POST_EMPLOYEES,
    API_URL_PUT_EMPLOYEE
} from '../../../src/composables/services/employeeService'; // Імпорт API URL
import employeeService from "../../../src/composables/services/employeeService";

vi.mock('../../../src/composables/services/getConnect', () => ({
    default: {
        get: vi.fn(),
        put: vi.fn(),
        post: vi.fn(),
        delete: vi.fn(),
    }
}));

beforeEach(() => {
    vi.clearAllMocks();
});

describe('getEmployees', () => {
    test('should fetch employees successfully', async () => {
        const mockResponse = {data: [{id: 1, name: 'John Doe'}]};
        getConnect.get.mockResolvedValue(mockResponse);

        const unitId = 123;
        const signal = {}; // Можна передати реальний AbortSignal

        const result = await employeeService.getEmployees(unitId, signal);

        expect(getConnect.get).toHaveBeenCalledWith(API_URL_GET_EMPLOYEES(unitId), signal);
        expect(result).toEqual(mockResponse);
    });

    test('should handle API errors', async () => {
        getConnect.get.mockRejectedValue(new Error('Network error'));

        const unitId = 123;
        const signal = {};

        await expect(employeeService.getEmployees(unitId, signal)).rejects.toThrow('Network error');
        expect(getConnect.get).toHaveBeenCalledWith(API_URL_GET_EMPLOYEES(unitId), signal);
    });
});

describe('getEmployee', () => {
    test('should fetch employee successfully', async () => {
        const mockResponse = {data: [{id: 1, name: 'John Doe'}]};
        getConnect.get.mockResolvedValue(mockResponse);

        const id = 123;
        const signal = {}; // Можна передати реальний AbortSignal

        const result = await employeeService.getEmployee(id, signal);

        expect(getConnect.get).toHaveBeenCalledWith(API_URL_GET_EMPLOYEE(id), signal);
        expect(result).toEqual(mockResponse);
    });

    test('should handle API errors', async () => {
        getConnect.get.mockRejectedValue(new Error('Network error'));

        const id = 123;
        const signal = {};

        await expect(employeeService.getEmployee(id, signal)).rejects.toThrow('Network error');
        expect(getConnect.get).toHaveBeenCalledWith(API_URL_GET_EMPLOYEE(id), signal);
    });
});

describe('putEmployee', () => {
    test('should put employee successfully', async () => {
        const mockResponse = {data: [{id: 1, name: 'John Doe'}]};
        getConnect.put.mockResolvedValue(mockResponse);

        const id = 123;
        const employee = {id: 1, name: 'John Doe'};
        const signal = {}; // Можна передати реальний AbortSignal

        const result = await employeeService.putEmployee(id, employee, signal);

        expect(getConnect.put).toHaveBeenCalledWith(API_URL_PUT_EMPLOYEE(id), employee, signal);
        expect(result).toEqual(mockResponse);
    });

    test('should handle API errors', async () => {
        getConnect.put.mockRejectedValue(new Error('Network error'));

        const id = 123;
        const employee = {id: 1, name: 'John Doe'};
        const signal = {};

        await expect(employeeService.putEmployee(id, employee, signal)).rejects.toThrow('Network error');
        expect(getConnect.put).toHaveBeenCalledWith(API_URL_PUT_EMPLOYEE(id), employee, signal);
    });
});

describe('postEmployee', () => {
    test('should post employee successfully', async () => {
        const mockResponse = {data: [{id: 1, name: 'John Doe'}]};
        getConnect.post.mockResolvedValue(mockResponse);

        const unitId = 123;
        const data = {id: 1, name: 'John Doe'};
        const signal = {}; // Можна передати реальний AbortSignal

        const result = await employeeService.postEmployee(unitId, data, signal);

        expect(getConnect.post).toHaveBeenCalledWith(API_URL_POST_EMPLOYEES(unitId), data, signal);
        expect(result).toEqual(mockResponse);
    });

    test('should handle API errors', async () => {
        getConnect.post.mockRejectedValue(new Error('Network error'));

        const unitId = 123;
        const data = {id: 1, name: 'John Doe'};
        const signal = {};

        await expect(employeeService.postEmployee(unitId, data, signal)).rejects.toThrow('Network error');
        expect(getConnect.post).toHaveBeenCalledWith(API_URL_POST_EMPLOYEES(unitId), data, signal);
    });
});

describe('deleteEmployee', () => {
    test('should delete employee successfully', async () => {
        const mockResponse = {data: [{id: 1, name: 'John Doe'}]};
        getConnect.delete.mockResolvedValue(mockResponse);

        const id = 123;
        const signal = {}; // Можна передати реальний AbortSignal

        const result = await employeeService.deleteEmployee(id, signal);

        expect(getConnect.delete).toHaveBeenCalledWith(API_URL_DELETE_EMPLOYEE(id), signal);
        expect(result).toEqual(mockResponse);
    });

    test('should handle API errors', async () => {
        getConnect.delete.mockRejectedValue(new Error('Network error'));

        const id = 123;
        const signal = {};

        await expect(employeeService.deleteEmployee(id, signal)).rejects.toThrow('Network error');
        expect(getConnect.delete).toHaveBeenCalledWith(API_URL_DELETE_EMPLOYEE(id), signal);
    });
});

describe('getRanks', () => {
    test('should get ranks successfully', async () => {
        const mockResponse = {data: [{id: 1, name: 'John Doe'}]};
        getConnect.get.mockResolvedValue(mockResponse);

        const signal = {}; // Можна передати реальний AbortSignal

        const result = await employeeService.getRanks(signal);

        expect(getConnect.get).toHaveBeenCalledWith(API_URL_GET_RANKS(), signal);
        expect(result).toEqual(mockResponse);
    });

    test('should handle API errors', async () => {
        getConnect.get.mockRejectedValue(new Error('Network error'));

        const signal = {};

        await expect(employeeService.getRanks(signal)).rejects.toThrow('Network error');
        expect(getConnect.get).toHaveBeenCalledWith(API_URL_GET_RANKS(), signal);
    });
});

describe('getInvite', () => {
    test('should get invite successfully', async () => {
        const mockResponse = {data: [{id: 1, name: 'John Doe'}]};
        getConnect.get.mockResolvedValue(mockResponse);

        const id = 123;
        const signal = {}; // Можна передати реальний AbortSignal

        const result = await employeeService.getInvite(id, signal);

        expect(getConnect.get).toHaveBeenCalledWith(API_URL_GET_INVITE(id), signal);
        expect(result).toEqual(mockResponse);
    });

    test('should handle API errors', async () => {
        getConnect.get.mockRejectedValue(new Error('Network error'));

        const id = 123;
        const signal = {};

        await expect(employeeService.getInvite(id, signal)).rejects.toThrow('Network error');
        expect(getConnect.get).toHaveBeenCalledWith(API_URL_GET_INVITE(id), signal);
    });
});
