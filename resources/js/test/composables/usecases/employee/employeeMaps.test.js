import { describe, test, expect } from 'vitest';
import employeeMaps from "../../../../src/composables/usecases/emploee/employeeMaps.js";

describe('transform.toServer()', () => {
    test('перетворює масив обʼєктів для сервера v1', () => {
        const input = {
            id: "data.id",
            userId: "data.userId",
            unitId: "data.unitId",
            rank: "data.rank",
            name: "data.name",
            note: "data.note",
            textColor: "data.textColor",
            bgColor: "data.bgColor",
            sort: "data.sort",
            hidden: true,
        };

        const expectedOutput = {
            id: "data.id",
            user_id: "data.userId",
            unit_id: "data.unitId",
            rank: "data.rank",
            name: "data.name",
            note: "data.note",
            text_color: "data.textColor",
            bg_color: "data.bgColor",
            sort: "data.sort",
            hidden: 1,
        };

        expect(employeeMaps.toServer(input)).toEqual(expectedOutput);
    });

    test('перетворює масив обʼєктів для сервера v2', () => {
        const input = {
            id: "data.id",
            userId: "data.userId",
            unitId: "data.unitId",
            rank: "data.rank",
            name: "data.name",
            note: "data.note",
            textColor: "data.textColor",
            bgColor: "data.bgColor",
            sort: "data.sort",
            hidden: false,
        };

        const expectedOutput = {
            id: "data.id",
            user_id: "data.userId",
            unit_id: "data.unitId",
            rank: "data.rank",
            name: "data.name",
            note: "data.note",
            text_color: "data.textColor",
            bg_color: "data.bgColor",
            sort: "data.sort",
            hidden: 0,
        };

        expect(employeeMaps.toServer(input)).toEqual(expectedOutput);
    });

    test('повертає порожній масив при пустому вхідному масиві', () => {
        expect(employeeMaps.toServer({})).toEqual({});
    });
});

describe('transform.toClient()', () => {
    test('перетворює масив обʼєктів для клієнта v1', () => {
        const input = {
            id: "data.id",
            user_id: "data.userId",
            unit_id: "data.unitId",
            rank: "data.rank",
            name: "data.name",
            note: "data.note",
            text_color: "data.textColor",
            bg_color: "data.bgColor",
            sort: "data.sort",
            hidden: 0,
        };

        const expectedOutput = {
            id: "data.id",
            userId: "data.userId",
            unitId: "data.unitId",
            rank: "data.rank",
            name: "data.name",
            note: "data.note",
            textColor: "data.textColor",
            bgColor: "data.bgColor",
            sort: "data.sort",
            hidden: false,
        };

        expect(employeeMaps.toClient(input)).toEqual(expectedOutput);
    });

    test('перетворює масив обʼєктів для клієнта v2', () => {
        const input = {
            id: "data.id",
            user_id: "data.userId",
            unit_id: "data.unitId",
            rank: "data.rank",
            name: "data.name",
            note: "data.note",
            text_color: "data.textColor",
            bg_color: "data.bgColor",
            sort: "data.sort",
            hidden: 1,
        };

        const expectedOutput = {
            id: "data.id",
            userId: "data.userId",
            unitId: "data.unitId",
            rank: "data.rank",
            name: "data.name",
            note: "data.note",
            textColor: "data.textColor",
            bgColor: "data.bgColor",
            sort: "data.sort",
            hidden: true,
        };

        expect(employeeMaps.toClient(input)).toEqual(expectedOutput);
    });

    test('повертає порожній масив при пустому вхідному масиві', () => {
        expect(employeeMaps.toClient({})).toEqual({});
    });
});
