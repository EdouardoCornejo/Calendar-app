import { Provider } from "react-redux";
import { act, renderHook } from "@testing-library/react";
import { uiSlice } from "../../src/store";
import { useUiStore } from "../../src/hooks";
import { configureStore } from "@reduxjs/toolkit";

const getMockStore = (initialState) =>
    configureStore({
        reducer: { ui: uiSlice.reducer },
        preloadedState: {
            ui: { ...initialState },
        },
    });

describe("test in useUiStore", () => {
    test("should return the default values", () => {
        const mockStore = getMockStore({ isDateModalOpen: false });

        const { result } = renderHook(() => useUiStore(), {
            wrapper: ({ children }) => (
                <Provider store={mockStore}>{children}</Provider>
            ),
        });

        expect(result.current).toEqual({
            isDateModalOpen: false,
            closeDateModal: expect.any(Function),
            openDateModal: expect.any(Function),
            toggleDateModal: expect.any(Function),
        });
    });

    test("should return true in the isDateModalOpen", () => {
        const mockStore = getMockStore({ isDateModalOpen: true });
        const { result } = renderHook(() => useUiStore(), {
            wrapper: ({ children }) => <Provider store={mockStore} > {children} </Provider>
        })

        const { openDateModal } = result.current;

        act(() => {
            openDateModal();
        })
        expect(result.current.isDateModalOpen).toBeTruthy();
    });

    test('closeDateModal should return false in the isDateModalOpen', () => {
        const mockStore = getMockStore({ isDateModalOpen: true });

        const { result } = renderHook(() => useUiStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}> {children} </Provider>
        })

        act(() => {
            result.current.closeDateModal();
        })

        expect(result.current.isDateModalOpen).toBeFalsy();
    });

    test('toggleDateModal should return the opposite value of isDateModalOpen', () => {
        const mockStore = getMockStore({ isDateModalOpen: true });

        const { result } = renderHook(() => useUiStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}> {children} </Provider>
        })

        act(() => {
            result.current.toggleDateModal();
        })

        expect(result.current.isDateModalOpen).toBeFalsy();

        act(() => {
            result.current.toggleDateModal();
        })

        expect(result.current.isDateModalOpen).toBeTruthy();
    });

});
