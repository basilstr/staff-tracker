import {createPinia, setActivePinia} from 'pinia'
import {beforeEach, describe, expect, test, vi} from 'vitest'
import {useEmployeesStore} from '../../../src/composables/store/employeesStore'

describe('EMPLOYEES STORE', () => {
    let mockStorage = {};

    beforeEach(() => {
        setActivePinia(createPinia())

        // Мокаємо localStorage
        mockStorage = {userId: '2'};

        vi.stubGlobal('localStorage', {
            getItem: vi.fn((key) => mockStorage[key] ?? null),
            setItem: vi.fn((key, value) => {
                mockStorage[key] = value;
            }),
            removeItem: vi.fn((key) => {
                delete mockStorage[key];
            }),
            clear: vi.fn(() => {
                mockStorage = {};
            }),
        });
    })

    // SET EMPLOYEES
    test('set empty data on nullable store', () => {
        const employeesStore = useEmployeesStore();

        employeesStore.setEmployees([], 5);

        expect(employeesStore.employees).toStrictEqual([])
        expect(employeesStore.unit).toBe(5)
        expect(employeesStore.employeeUser).toBe(null)
    })

    test('set empty data on not nullable store', () => {
        const employeesStore = useEmployeesStore();

        employeesStore.employees = [{
            id: 1,
            userId: 123456789,
            unitId: 5,
            rank: 60,
            name: "OWNER",
            note: "note note note",
            text_color: "#000000",
            bg_color: "#ff0000",
            sort: 0
        }]
        employeesStore.unit = 4
        employeesStore.employeeUser = {
            id: 1,
            userId: 123456789,
            unitId: 5,
            rank: 60,
            name: "OWNER",
            note: "note note note",
            text_color: "#000000",
            bg_color: "#ff0000",
            sort: 0
        }

        employeesStore.setEmployees([], 5);

        expect(employeesStore.employees).toStrictEqual([])
        expect(employeesStore.unit).toBe(5)
        expect(employeesStore.employeeUser).toBe(null)
    })

    test('set data on nullable store with empty user', () => {
        const employeesStore = useEmployeesStore();

        const data = [{
            id: 1,
            userId: 123456789,
            unitId: 5,
            rank: 60,
            name: "OWNER",
            note: "note note note",
            text_color: "#000000",
            bg_color: "#ff0000",
            sort: 0
        }]

        employeesStore.setEmployees(data, 5);

        expect(employeesStore.employees).toStrictEqual([{
            id: 1,
            userId: 123456789,
            unitId: 5,
            rank: 60,
            name: "OWNER",
            note: "note note note",
            text_color: "#000000",
            bg_color: "#ff0000",
            sort: 0
        }])
        expect(employeesStore.unit).toBe(5)
        expect(employeesStore.employeeUser).toBe(null)
    })

    test('set data on nullable store with non empty user', () => {
        const employeesStore = useEmployeesStore();

        const data = [{
            id: 1,
            userId: 2,
            unitId: 5,
            rank: 60,
            name: "OWNER",
            note: "note note note",
            text_color: "#000000",
            bg_color: "#ff0000",
            sort: 0
        }]

        employeesStore.setEmployees(data, 5);

        expect(employeesStore.employees).toStrictEqual([{
            id: 1,
            userId: 2,
            unitId: 5,
            rank: 60,
            name: "OWNER",
            note: "note note note",
            text_color: "#000000",
            bg_color: "#ff0000",
            sort: 0
        }])
        expect(employeesStore.unit).toBe(5)
        expect(employeesStore.employeeUser).toStrictEqual({
            id: 1,
            userId: 2,
            unitId: 5,
            rank: 60,
            name: "OWNER",
            note: "note note note",
            text_color: "#000000",
            bg_color: "#ff0000",
            sort: 0
        })
    })


    test('set data on non nullable store with empty user', () => {
        const employeesStore = useEmployeesStore();

        employeesStore.employees = [{
            id: 1,
            userId: 123456789,
            unitId: 5,
            rank: 60,
            name: "OWNER",
            note: "note note note",
            text_color: "#000000",
            bg_color: "#ff0000",
            sort: 0
        }]
        employeesStore.unit = 4
        employeesStore.employeeUser = {
            id: 1,
            userId: 123456789,
            unitId: 5,
            rank: 60,
            name: "OWNER",
            note: "note note note",
            text_color: "#000000",
            bg_color: "#ff0000",
            sort: 0
        }

        const data = [{
            id: 1,
            userId: 123456789,
            unitId: 5,
            rank: 60,
            name: "OWNER",
            note: "note note note",
            text_color: "#000000",
            bg_color: "#ff0000",
            sort: 0
        }]

        employeesStore.setEmployees(data, 5);

        expect(employeesStore.employees).toStrictEqual([{
            id: 1,
            userId: 123456789,
            unitId: 5,
            rank: 60,
            name: "OWNER",
            note: "note note note",
            text_color: "#000000",
            bg_color: "#ff0000",
            sort: 0
        }])
        expect(employeesStore.unit).toBe(5)
        expect(employeesStore.employeeUser).toBe(null)
    })

    test('set data on non nullable store with non empty user', () => {
        const employeesStore = useEmployeesStore();

        employeesStore.employees = [{
            id: 1,
            userId: 123456789,
            unitId: 5,
            rank: 60,
            name: "OWNER",
            note: "note note note",
            text_color: "#000000",
            bg_color: "#ff0000",
            sort: 0
        }]
        employeesStore.unit = 4
        employeesStore.employeeUser = {
            id: 1,
            userId: 123456789,
            unitId: 5,
            rank: 60,
            name: "OWNER",
            note: "note note note",
            text_color: "#000000",
            bg_color: "#ff0000",
            sort: 0
        }

        const data = [{
            id: 1,
            userId: 2,
            unitId: 5,
            rank: 60,
            name: "OWNER",
            note: "note note note",
            text_color: "#000000",
            bg_color: "#ff0000",
            sort: 0
        }]

        employeesStore.setEmployees(data, 5);

        expect(employeesStore.employees).toStrictEqual([{
            id: 1,
            userId: 2,
            unitId: 5,
            rank: 60,
            name: "OWNER",
            note: "note note note",
            text_color: "#000000",
            bg_color: "#ff0000",
            sort: 0
        }])
        expect(employeesStore.unit).toBe(5)
        expect(employeesStore.employeeUser).toStrictEqual({
            id: 1,
            userId: 2,
            unitId: 5,
            rank: 60,
            name: "OWNER",
            note: "note note note",
            text_color: "#000000",
            bg_color: "#ff0000",
            sort: 0
        })
    })

    // CLEAR EMPLOYEES
    test('check clear employee', () => {
        const employeesStore = useEmployeesStore();

        employeesStore.employees = [{
            id: 1,
            userId: 123456789,
            unitId: 5,
            rank: 60,
            name: "OWNER",
            note: "note note note",
            text_color: "#000000",
            bg_color: "#ff0000",
            sort: 0
        }]
        employeesStore.unit = 4
        employeesStore.employeeUser = {
            id: 1,
            userId: 123456789,
            unitId: 5,
            rank: 60,
            name: "OWNER",
            note: "note note note",
            text_color: "#000000",
            bg_color: "#ff0000",
            sort: 0
        }

        employeesStore.clearEmployees()

        expect(employeesStore.employees).toStrictEqual([])
        expect(employeesStore.unit).toBe(null)
        expect(employeesStore.employeeUser).toBe(null)
    })

    // IS EMPTY EMPLOYEES
    test('check is empty employee on nullable store and null unit', () => {
        const employeesStore = useEmployeesStore();

        expect(employeesStore.isEmptyEmployees(null)).toBe(true)
    })

    test('check is empty employee on nullable store and not null unit', () => {
        const employeesStore = useEmployeesStore();

        expect(employeesStore.isEmptyEmployees(3)).toBe(true)
    })

    test('check is empty employee on non nullable store and null unit', () => {
        const employeesStore = useEmployeesStore();

        employeesStore.employees = [{
            id: 1,
            userId: 123456789,
            unitId: 5,
            rank: 60,
            name: "OWNER",
            note: "note note note",
            text_color: "#000000",
            bg_color: "#ff0000",
            sort: 0
        }]
        employeesStore.unit = 4
        employeesStore.employeeUser = {
            id: 1,
            userId: 123456789,
            unitId: 5,
            rank: 60,
            name: "OWNER",
            note: "note note note",
            text_color: "#000000",
            bg_color: "#ff0000",
            sort: 0
        }

        expect(employeesStore.isEmptyEmployees(null)).toBe(true)
    })

    test('check is empty employee on non nullable store and not null unit', () => {
        const employeesStore = useEmployeesStore();

        employeesStore.employees = [{
            id: 1,
            userId: 123456789,
            unitId: 5,
            rank: 60,
            name: "OWNER",
            note: "note note note",
            text_color: "#000000",
            bg_color: "#ff0000",
            sort: 0
        }]
        employeesStore.unit = 4
        employeesStore.employeeUser = {
            id: 1,
            userId: 123456789,
            unitId: 5,
            rank: 60,
            name: "OWNER",
            note: "note note note",
            text_color: "#000000",
            bg_color: "#ff0000",
            sort: 0
        }

        expect(employeesStore.isEmptyEmployees(1)).toBe(true)
    })

    test('check is empty employee on non nullable store and unit equal this.unit', () => {
        const employeesStore = useEmployeesStore();

        employeesStore.employees = [{
            id: 1,
            userId: 123456789,
            unitId: 5,
            rank: 60,
            name: "OWNER",
            note: "note note note",
            text_color: "#000000",
            bg_color: "#ff0000",
            sort: 0
        }]
        employeesStore.unit = 4
        employeesStore.employeeUser = {
            id: 1,
            userId: 123456789,
            unitId: 5,
            rank: 60,
            name: "OWNER",
            note: "note note note",
            text_color: "#000000",
            bg_color: "#ff0000",
            sort: 0
        }

        expect(employeesStore.isEmptyEmployees(4)).toBe(false)
    })


    // GET EMPLOYEE
    test('get employee from empty employees', () => {
        const employeesStore = useEmployeesStore();

        expect(employeesStore.getEmployee(4)).toBe(null)
    })

    test('get null employee from empty employees', () => {
        const employeesStore = useEmployeesStore();

        expect(employeesStore.getEmployee(null)).toBe(null)
    })

    test('get null employee from employees', () => {
        const employeesStore = useEmployeesStore();

        employeesStore.employees = [
            {
                id: 1,
                userId: 123456789,
                unitId: 5,
                rank: 60,
                name: "OWNER",
                note: "note note note",
                text_color: "#000000",
                bg_color: "#ff0000",
                sort: 0
            },
            {
                id: 2,
                userId: 3434,
                unitId: 5,
                rank: 60,
                name: "TEST",
                note: "note note note",
                text_color: "#000000",
                bg_color: "#ff0000",
                sort: 0
            }
        ]

        expect(employeesStore.getEmployee(null)).toBe(null)
    })

    test('get exist employee from employees', () => {
        const employeesStore = useEmployeesStore();

        employeesStore.employees = [
            {
                id: 1,
                userId: 123456789,
                unitId: 5,
                rank: 60,
                name: "OWNER",
                note: "note note note",
                text_color: "#000000",
                bg_color: "#ff0000",
                sort: 0
            },
            {
                id: 2,
                userId: 3434,
                unitId: 5,
                rank: 60,
                name: "TEST",
                note: "note note note",
                text_color: "#000000",
                bg_color: "#ff0000",
                sort: 0
            }
        ]

        expect(employeesStore.getEmployee(2)).toStrictEqual({
            id: 2,
            userId: 3434,
            unitId: 5,
            rank: 60,
            name: "TEST",
            note: "note note note",
            text_color: "#000000",
            bg_color: "#ff0000",
            sort: 0
        })
    })

    test('get not exist employee from employees', () => {
        const employeesStore = useEmployeesStore();

        employeesStore.employees = [
            {
                id: 1,
                userId: 123456789,
                unitId: 5,
                rank: 60,
                name: "OWNER",
                note: "note note note",
                text_color: "#000000",
                bg_color: "#ff0000",
                sort: 0
            },
            {
                id: 2,
                userId: 3434,
                unitId: 5,
                rank: 60,
                name: "TEST",
                note: "note note note",
                text_color: "#000000",
                bg_color: "#ff0000",
                sort: 0
            }
        ]

        expect(employeesStore.getEmployee(3)).toBe(null)
    })


    // DELETE EMPLOYEE
    test('delete employee from empty employees', () => {
        const employeesStore = useEmployeesStore();

        employeesStore.deleteEmployee(4)

        expect(employeesStore.employees).toStrictEqual([])
    })

    test('delete null employee from empty employees', () => {
        const employeesStore = useEmployeesStore();

        employeesStore.deleteEmployee(null)

        expect(employeesStore.employees).toStrictEqual([])
    })

    test('delete null employee from employees', () => {
        const employeesStore = useEmployeesStore();

        employeesStore.employees = [
            {
                id: 1,
                userId: 123456789,
                unitId: 5,
                rank: 60,
                name: "OWNER",
                note: "note note note",
                text_color: "#000000",
                bg_color: "#ff0000",
                sort: 0
            },
            {
                id: 2,
                userId: 3434,
                unitId: 5,
                rank: 60,
                name: "TEST",
                note: "note note note",
                text_color: "#000000",
                bg_color: "#ff0000",
                sort: 0
            }
        ]

        employeesStore.deleteEmployee(null)

        expect(employeesStore.employees).toStrictEqual([
            {
                id: 1,
                userId: 123456789,
                unitId: 5,
                rank: 60,
                name: "OWNER",
                note: "note note note",
                text_color: "#000000",
                bg_color: "#ff0000",
                sort: 0
            },
            {
                id: 2,
                userId: 3434,
                unitId: 5,
                rank: 60,
                name: "TEST",
                note: "note note note",
                text_color: "#000000",
                bg_color: "#ff0000",
                sort: 0
            }
        ])
    })

    test('delete exist employee from employees', () => {
        const employeesStore = useEmployeesStore();

        employeesStore.employees = [
            {
                id: 1,
                userId: 123456789,
                unitId: 5,
                rank: 60,
                name: "OWNER",
                note: "note note note",
                text_color: "#000000",
                bg_color: "#ff0000",
                sort: 0
            },
            {
                id: 2,
                userId: 3434,
                unitId: 5,
                rank: 60,
                name: "TEST",
                note: "note note note",
                text_color: "#000000",
                bg_color: "#ff0000",
                sort: 0
            }
        ]

        employeesStore.deleteEmployee(2)

        expect(employeesStore.employees).toStrictEqual([
            {
                id: 1,
                userId: 123456789,
                unitId: 5,
                rank: 60,
                name: "OWNER",
                note: "note note note",
                text_color: "#000000",
                bg_color: "#ff0000",
                sort: 0
            }
        ])
    })

    test('delete not exist employee from employees', () => {
        const employeesStore = useEmployeesStore();

        employeesStore.employees = [
            {
                id: 1,
                userId: 123456789,
                unitId: 5,
                rank: 60,
                name: "OWNER",
                note: "note note note",
                text_color: "#000000",
                bg_color: "#ff0000",
                sort: 0
            },
            {
                id: 2,
                userId: 3434,
                unitId: 5,
                rank: 60,
                name: "TEST",
                note: "note note note",
                text_color: "#000000",
                bg_color: "#ff0000",
                sort: 0
            }
        ]

        employeesStore.deleteEmployee(3)

        expect(employeesStore.employees).toStrictEqual([
            {
                id: 1,
                userId: 123456789,
                unitId: 5,
                rank: 60,
                name: "OWNER",
                note: "note note note",
                text_color: "#000000",
                bg_color: "#ff0000",
                sort: 0
            },
            {
                id: 2,
                userId: 3434,
                unitId: 5,
                rank: 60,
                name: "TEST",
                note: "note note note",
                text_color: "#000000",
                bg_color: "#ff0000",
                sort: 0
            }
        ])
    })

    // SAVE EMPLOYEE
    test('save empty employee', () => {
        const employeesStore = useEmployeesStore();

        employeesStore.saveEmployee(null)

        expect(employeesStore.employees).toStrictEqual([])
    })

    test('save employee to empty employees', () => {
        const employeesStore = useEmployeesStore();

        employeesStore.saveEmployee({
            id: 2,
            userId: 3434,
            unitId: 5,
            rank: 60,
            name: "TEST",
            note: "note note note",
            text_color: "#000000",
            bg_color: "#ff0000",
            sort: 0
        })

        expect(employeesStore.employees).toStrictEqual([])
    })


    test('replace existing employee', () => {
        const employeesStore = useEmployeesStore();

        employeesStore.employees = [
            {
                id: 1,
                userId: 123456789,
                unitId: 5,
                rank: 60,
                name: "OWNER",
                note: "note note note",
                text_color: "#000000",
                bg_color: "#ff0000",
                sort: 0
            },
            {
                id: 2,
                userId: 3434,
                unitId: 5,
                rank: 60,
                name: "TEST",
                note: "note note note",
                text_color: "#000000",
                bg_color: "#ff0000",
                sort: 1
            }
        ]

        employeesStore.saveEmployee({
            id: 2,
            userId: 1111,
            unitId: 15,
            rank: 61,
            name: "1234",
            note: "note eeee note note",
            text_color: "#00ff00",
            bg_color: "#ff0ff0",
            sort: 1
        })

        expect(employeesStore.employees).toStrictEqual([
            {
                id: 1,
                userId: 123456789,
                unitId: 5,
                rank: 60,
                name: "OWNER",
                note: "note note note",
                text_color: "#000000",
                bg_color: "#ff0000",
                sort: 0
            },
            {
                id: 2,
                userId: 1111,
                unitId: 15,
                rank: 61,
                name: "1234",
                note: "note eeee note note",
                text_color: "#00ff00",
                bg_color: "#ff0ff0",
                sort: 1
            }
        ])
    })

    test('replace not existing employee', () => {
        const employeesStore = useEmployeesStore();

        employeesStore.employees = [
            {
                id: 1,
                userId: 123456789,
                unitId: 5,
                rank: 60,
                name: "OWNER",
                note: "note note note",
                text_color: "#000000",
                bg_color: "#ff0000",
                sort: 0
            },
            {
                id: 2,
                userId: 3434,
                unitId: 5,
                rank: 60,
                name: "TEST",
                note: "note note note",
                text_color: "#000000",
                bg_color: "#ff0000",
                sort: 1
            }
        ]

        employeesStore.saveEmployee({
            id: 3,
            userId: 1111,
            unitId: 15,
            rank: 61,
            name: "1234",
            note: "note eeee note note",
            text_color: "#00ff00",
            bg_color: "#ff0ff0",
            sort: 1
        })

        expect(employeesStore.employees).toStrictEqual([
            {
                id: 1,
                userId: 123456789,
                unitId: 5,
                rank: 60,
                name: "OWNER",
                note: "note note note",
                text_color: "#000000",
                bg_color: "#ff0000",
                sort: 0
            },
            {
                id: 2,
                userId: 3434,
                unitId: 5,
                rank: 60,
                name: "TEST",
                note: "note note note",
                text_color: "#000000",
                bg_color: "#ff0000",
                sort: 1
            }
        ])
    })

    // CREATE EMPLOYEE

    test('create empty employee', () => {
        const employeesStore = useEmployeesStore();

        employeesStore.createEmployee(null)

        expect(employeesStore.employees).toStrictEqual([])
    })

    test('save employee to empty employees', () => {
        const employeesStore = useEmployeesStore();

        employeesStore.createEmployee({
            id: 2,
            userId: 3434,
            unitId: 5,
            rank: 60,
            name: "TEST",
            note: "note note note",
            text_color: "#000000",
            bg_color: "#ff0000",
            sort: 0
        })

        expect(employeesStore.employees).toStrictEqual([{
            id: 2,
            userId: 3434,
            unitId: 5,
            rank: 60,
            name: "TEST",
            note: "note note note",
            text_color: "#000000",
            bg_color: "#ff0000",
            sort: 0
        }])
    })

    test('create not employee and sort store', () => {
        const employeesStore = useEmployeesStore();

        employeesStore.employees = [
            {
                id: 1,
                userId: 123456789,
                unitId: 5,
                rank: 60,
                name: "OWNER",
                note: "note note note",
                text_color: "#000000",
                bg_color: "#ff0000",
                sort: 2
            },
            {
                id: 2,
                userId: 3434,
                unitId: 5,
                rank: 60,
                name: "TEST",
                note: "note note note",
                text_color: "#000000",
                bg_color: "#ff0000",
                sort: 6
            }
        ]

        employeesStore.createEmployee({
            id: 3,
            userId: 1111,
            unitId: 15,
            rank: 61,
            name: "1234",
            note: "note eeee note note",
            text_color: "#00ff00",
            bg_color: "#ff0ff0",
            sort: 4
        })

        expect(employeesStore.employees).toStrictEqual([
            {
                id: 1,
                userId: 123456789,
                unitId: 5,
                rank: 60,
                name: "OWNER",
                note: "note note note",
                text_color: "#000000",
                bg_color: "#ff0000",
                sort: 2
            },
            {
                id: 3,
                userId: 1111,
                unitId: 15,
                rank: 61,
                name: "1234",
                note: "note eeee note note",
                text_color: "#00ff00",
                bg_color: "#ff0ff0",
                sort: 4
            },
            {
                id: 2,
                userId: 3434,
                unitId: 5,
                rank: 60,
                name: "TEST",
                note: "note note note",
                text_color: "#000000",
                bg_color: "#ff0000",
                sort: 6
            }
        ])
    })


    test('create existing employee and sort store', () => {
        const employeesStore = useEmployeesStore();

        employeesStore.employees = [
            {
                id: 1,
                userId: 123456789,
                unitId: 5,
                rank: 60,
                name: "OWNER",
                note: "note note note",
                text_color: "#000000",
                bg_color: "#ff0000",
                sort: 2
            },
            {
                id: 2,
                userId: 3434,
                unitId: 5,
                rank: 60,
                name: "TEST",
                note: "note note note",
                text_color: "#000000",
                bg_color: "#ff0000",
                sort: 6
            }
        ]

        employeesStore.createEmployee({
            id: 1,
            userId: 1111,
            unitId: 15,
            rank: 61,
            name: "1234",
            note: "note eeee note note",
            text_color: "#00ff00",
            bg_color: "#ff0ff0",
            sort: 4
        })

        expect(employeesStore.employees).toStrictEqual([
            {
                id: 1,
                userId: 1111,
                unitId: 15,
                rank: 61,
                name: "1234",
                note: "note eeee note note",
                text_color: "#00ff00",
                bg_color: "#ff0ff0",
                sort: 4
            },
            {
                id: 2,
                userId: 3434,
                unitId: 5,
                rank: 60,
                name: "TEST",
                note: "note note note",
                text_color: "#000000",
                bg_color: "#ff0000",
                sort: 6
            }
        ])
    })

    test('перевірка роботи функції updateHVemployees', () => {
        const employeesStore = useEmployeesStore();

        employeesStore.employees = [
            {
                id: 1,
                userId: 123456789,
                unitId: 5,
                rank: 60,
                name: "OWNER",
                note: "note note note",
                text_color: "#000000",
                bg_color: "#ff0000",
                sort: 0,
                hidden: false,
            },
            {
                id: 2,
                userId: 987654321,
                unitId: 3,
                rank: 40,
                name: "NOOWNER",
                note: "note1 note1 note1",
                text_color: "#0000FF",
                bg_color: "#ff00FF",
                sort: 1,
                hidden: true,
            },
        ]

        const employeesVisible = [{
            id: 1,
            userId: 123456789,
            unitId: 5,
            rank: 60,
            name: "OWNER",
            note: "note note note",
            text_color: "#000000",
            bg_color: "#ff0000",
            sort: 0,
            hidden: false,
        }]

        const employeesHidden = [{
            id: 2,
            userId: 987654321,
            unitId: 3,
            rank: 40,
            name: "NOOWNER",
            note: "note1 note1 note1",
            text_color: "#0000FF",
            bg_color: "#ff00FF",
            sort: 1,
            hidden: true,
        }]

        employeesStore.updateHVemployees();

        expect(employeesStore.employeesVisible).toStrictEqual(employeesVisible)
        expect(employeesStore.employeesHidden).toStrictEqual(employeesHidden)
    })
})
