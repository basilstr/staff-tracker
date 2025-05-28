import { describe, test, expect } from 'vitest';
import employeesMaps from "../../../../src/composables/usecases/employees/employeesMaps";

describe('transform.toClient()', () => {
    test('перетворює масив обʼєктів для клієнта', () => {
        const input = [
            {
                id: "employee.id 1",
                user_id: "employee.user_id 1",
                unit_id: "employee.unit_id 1",
                name: "employee.name 1",
                rank: "employee.rank 1",
                note: "employee.note 1",
                text_color: "employee.text_color 1",
                bg_color: "employee.bg_color 1",
                sort: "employee.sort 1",
                hidden: 0,
            }, {
                id: "employee.id 2",
                user_id: "employee.user_id 2",
                unit_id: "employee.unit_id 2",
                name: "employee.name 2",
                rank: "employee.rank 2",
                note: "employee.note 2",
                text_color: "employee.text_color 2",
                bg_color: "employee.bg_color 2",
                sort: "employee.sort 2",
                hidden: 1,
            },
        ];

        const expectedOutput = [
            {
                id: "employee.id 1",
                userId: "employee.user_id 1",
                unitId: "employee.unit_id 1",
                name: "employee.name 1",
                rank: "employee.rank 1",
                note: "employee.note 1",
                textColor: "employee.text_color 1",
                bgColor: "employee.bg_color 1",
                sort: "employee.sort 1",
                hidden: false,
            }, {
                id: "employee.id 2",
                userId: "employee.user_id 2",
                unitId: "employee.unit_id 2",
                name: "employee.name 2",
                rank: "employee.rank 2",
                note: "employee.note 2",
                textColor: "employee.text_color 2",
                bgColor: "employee.bg_color 2",
                sort: "employee.sort 2",
                hidden: true,
            },
        ];

        expect(employeesMaps.toClient(input)).toEqual(expectedOutput);
    });

    test('повертає порожній масив при пустому вхідному масиві', () => {
        expect(employeesMaps.toClient([])).toEqual([]);
    });
});
