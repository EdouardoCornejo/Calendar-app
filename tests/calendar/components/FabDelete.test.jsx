const { render, screen, fireEvent } = require("@testing-library/react");
import { Provider } from "react-redux";
import { FabDelete } from "../../../src/calendar/components/FabDelete";
import { store } from "../../../src/store";
import { useCalendarStore } from "../../../src/hooks/useCalendarStore";

jest.mock("../../../src/hooks/useCalendarStore");

describe("test in <FabDelete />", () => {
  const mockStartDeletingEvent = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should display the component correctly", () => {
    useCalendarStore.mockReturnValue({
      hasEventSelected: false,
    });

    render(
      <Provider store={store}>
        <FabDelete />
      </Provider>
    );

    const btn = screen.getByLabelText("btn-delete");
    expect(btn.classList).toContain("btn");
    expect(btn.classList).toContain("btn-danger");
    expect(btn.classList).toContain("fab-danger");
    expect(btn.style.display).toBe("none");
  });

  test("should display the button when hasEventSelected is true", () => {
    useCalendarStore.mockReturnValue({
      hasEventSelected: true,
    });

    render(
      <Provider store={store}>
        <FabDelete />
      </Provider>
    );

    const btn = screen.getByLabelText("btn-delete");
    expect(btn.style.display).toBe("");
  });

  test("should call startDeletingEvent if are an active event", () => {
    useCalendarStore.mockReturnValue({
      hasEventSelected: true,
      startDeletingEvent: mockStartDeletingEvent,
    });

    render(
      <Provider store={store}>
        <FabDelete />
      </Provider>
    );

    const btn = screen.getByLabelText("btn-delete");
    fireEvent.click(btn);

    expect(mockStartDeletingEvent).toHaveBeenCalled();
  });
});
