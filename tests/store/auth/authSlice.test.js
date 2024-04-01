import { authenticatedState, initialState } from "../../fixtures/authStates";
import { authSlice, clearErrorMessage, onChecking, onLogin, onLogout } from "../../../src/store/auth/authSlice";
import { testUserCredentials } from "../../fixtures/testUser";

describe('Test in authSlice', () => {

    test('should return the checking state', () => {
        const state = authSlice.reducer(initialState, onChecking());
        expect(state).toEqual({
            status: 'checking',
            user: {},
            errorMessage: undefined
        })
    });

    test('should return the initial state', () => {
        expect(authSlice.getInitialState()).toEqual(initialState);
    });

    test('should made a login correctly', () => {
        const state = authSlice.reducer(initialState, onLogin(testUserCredentials))
        expect(state).toEqual({
            status: 'authenticated',
            user: testUserCredentials,
            errorMessage: undefined
        })
    });

    test('should made a logout correctly', () => {
        const errorMessage = 'Credentials are invalid';

        const state = authSlice.reducer(authenticatedState, onLogout(errorMessage));
        expect(state).toEqual({
            status: 'not-authenticated',
            user: {},
            errorMessage: 'Credentials are invalid',
        })
    });

    test('should clear the error message', () => {
        const errorMessage = 'Credentials are invalid';
        const state = authSlice.reducer(authenticatedState, onLogout(errorMessage));
        const newState = authSlice.reducer(state, clearErrorMessage());
        expect(newState.errorMessage).toBe(undefined)
    });
});