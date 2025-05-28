import {beforeEach, describe, expect, test, vi} from 'vitest'
import { loginWithGoogle, logout } from '../src/firebase';
import { signInWithPopup, signOut } from "firebase/auth";

vi.mock("firebase/auth", () => {
    return {
        getAuth: vi.fn(),
        GoogleAuthProvider: vi.fn(),
        signInWithPopup: vi.fn(),
        signOut: vi.fn()
    };
});

describe("Firebase Auth", () => {
    let googleToken;
    let mockStorage = {};

    beforeEach(() => {
        googleToken = { value: '' };
        mockStorage = {};
        vi.clearAllMocks();

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
    });

    test("успішний вхід через Google", async () => {
        const mockUser = {
            getIdToken: vi.fn().mockResolvedValue("mocked-token"),
        };

        signInWithPopup.mockResolvedValue({ user: mockUser });

        await loginWithGoogle(googleToken);

        expect(signInWithPopup).toHaveBeenCalled();
        expect(mockUser.getIdToken).toHaveBeenCalled();
        expect(googleToken.value).toBe("mocked-token");
    });

    test("вхід через Google — помилка", async () => {
        signInWithPopup.mockRejectedValue(new Error("Login failed"));

        await loginWithGoogle(googleToken);

        expect(signInWithPopup).toHaveBeenCalled();
        expect(googleToken.value).toBe("");
    });

    test("вихід — очищення токена", async () => {
        googleToken.value = "some-token";
        localStorage.setItem("token", "some-token");

        await logout(googleToken);

        expect(signOut).toHaveBeenCalled();
        expect(googleToken.value).toBe("");
        expect(localStorage.getItem("token")).toBe(null);
    });

    test("вихід без передачі googleToken", async () => {
        localStorage.setItem("token", "some-token");

        await logout();

        expect(signOut).toHaveBeenCalled();
        expect(localStorage.getItem("token")).toBe(null);
        // не має помилки, якщо googleToken не переданий
    });
});
