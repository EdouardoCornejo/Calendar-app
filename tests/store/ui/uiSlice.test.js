import {
  onCloseDateModal,
  onOpenDateModal,
  uiSlice,
} from "../../../src/store/ui/uiSlice";

/**
 * Test in uiSlice.getInitialState
 * should return de state by default
 * should change isDateModalOpen correctly
 * ✓ should return de state by default
 * ✓ should change isDateModalOpen correctly
 */
describe("Test in uiSlice", () => {
  test("should return de state by default", () => {
    expect(uiSlice.getInitialState()).toEqual({ isDateModalOpen: false });
  });

  test("should change isDateModalOpen correctly", () => {
    let state = uiSlice.getInitialState();
    state = uiSlice.reducer(state, onOpenDateModal());
    expect(state.isDateModalOpen).toBeTruthy();

    state = uiSlice.reducer(state, onCloseDateModal());
    expect(state.isDateModalOpen).toBeFalsy();
  });
});
