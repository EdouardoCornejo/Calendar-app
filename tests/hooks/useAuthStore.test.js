import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "../../src/store/auth/authSlice";
import { useAuthStore } from "../../src/hooks/useAuthStore";
import { initialState, notAuthenticatedState, } from "../fixtures/authStates";
import { testUserCredentials } from "../fixtures/testUser";
import { renderHook, act, waitFor } from "@testing-library/react";

import { Provider } from "react-redux";
import { calendarApi } from "../../src/api";

const getMockStore = (initialState) => {
    return configureStore({
        reducer: {
            auth: authSlice.reducer
        },
        preloadedState: {
            auth: { ...initialState }
        }
    })
}


describe('test in useAuthStore', () => {

    beforeEach(() => localStorage.clear())

    test('should return default values', () => {
        const mockStore = getMockStore({ ...initialState });

        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });

        expect(result.current).toEqual({
            status: 'checking',
            user: {},
            errorMessage: undefined,
            startLogin: expect.any(Function),
            startRegister: expect.any(Function),
            checkAuthToken: expect.any(Function),
            startLogout: expect.any(Function),
        });
    });

    test('startLogin should login correctly', async () => {

        const mocStore = getMockStore({ ...notAuthenticatedState });

        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mocStore} > {children} </Provider>
        })

        await act(async () => {
            await result.current.startLogin(testUserCredentials)
        })

        const { errorMessage, status, user } = result.current

        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: {
                uid: '660777da7f40a22681b59b8b',
                name: 'test'
            }
        });
        expect(localStorage.getItem('token')).toEqual(expect.any(String))
        expect(localStorage.getItem('token-init-date')).toEqual(expect.any(String))
    })

    test('startLogin should fail', async () => {

        const mocStore = getMockStore({ ...notAuthenticatedState });

        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mocStore} > {children} </Provider>
        })

        await act(async () => {
            await result.current.startLogin({ email: 'any@google.com', password: '123456' })
        })

        const { errorMessage, status, user } = result.current

        expect(localStorage.getItem('token')).toBe(null)
        expect(localStorage.getItem('token-init-date')).toBe(null)
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: expect.any(String),
            status: 'not-authenticated',
            user: {}
        })

        await waitFor(
            () => expect(result.current.errorMessage).toBe(undefined)
        )

    })

    test('startRegister should register correctly an user ', async () => {

        const newUser = { email: 'test@gmail.com', password: 'admin123456', name: 'Test User 2' }

        const mockStore = getMockStore({ ...notAuthenticatedState });

        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children} </Provider>
        })

        const spy = jest.spyOn(calendarApi, 'post').mockReturnValue({
            data: {
                status: "Success",
                uid: '660777da7f40a22681b59b8b',
                name: 'test',
                token: 'eyJhbGciOiJIUzI1',
            }
        })

        await act(async () => {
            await result.current.startRegister(newUser)
        })

        const { errorMessage, status, user } = result.current

        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: { name: 'test', uid: '660777da7f40a22681b59b8b' }
        })

        spy.mockRestore()
    })

    test('startRegister should fail the creation', async () => {

        const mockStore = getMockStore({ ...notAuthenticatedState });

        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}> {children} </Provider>
        })

        await act(async () => {
            await result.current.startRegister(testUserCredentials)
        }
        )

        const { errorMessage, status, user } = result.current

        expect({ errorMessage, status, user }).toEqual({
            "errorMessage": "Internal Server Error",
            "status": "not-authenticated",
            "user": {},
        })
    })

    test('CheckAuthToken should validate the token', async () => {
        const mockStore = getMockStore({ ...initialState });
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}> {children} </Provider>
        })

        await act(async () => {
            await result.current.checkAuthToken()
        })

        const { errorMessage, status, user } = result.current

        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'not-authenticated',
            user: {}
        })
    })

    test('CheckAuthToken should authenticate the user if there is a token', async () => {
        const { data } = await calendarApi.post('/auth', testUserCredentials);

        localStorage.setItem('token', data.token);

        const mockStore = getMockStore({ ...initialState });

        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}> {children} </Provider>
        })

        await act(async () => {
            await result.current.checkAuthToken()
        })

        const { errorMessage, status, user } = result.current;

        expect({ errorMessage, status, user }).toEqual({
            "errorMessage": undefined,
            "status": "authenticated",
            "user": {
                "name": "test",
                "uid": "660777da7f40a22681b59b8b",
            }
        });

    });

})