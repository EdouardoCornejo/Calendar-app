import { render, screen } from "@testing-library/react";
import { useAuthStore } from "../../src/hooks";
import { AppRouter } from "../../src/router/AppRouter";
import { MemoryRouter } from "react-router-dom";
import { CalendarPage } from "../../src/calendar";

jest.mock("../../src/hooks/useAuthStore");

jest.mock('../../src/calendar', () => ({
  CalendarPage: () => <h1> CalendarPage </h1>
}))


describe("test in <AppRouter/>", () => {
  const mockCheckAuthToken = jest.fn();
  beforeEach(() => jest.clearAllMocks());

  test("should display the login screen correctly & call checkAuthToken", () => {
    useAuthStore.mockReturnValue({
      status: "checking",
      checkAuthToken: mockCheckAuthToken,
    });

    render(<AppRouter />);

    expect(screen.getByText("Loading ...")).toBeTruthy();
    expect(mockCheckAuthToken).toHaveBeenCalled();
  });

  test('It should show the login if you are not authenticated', () => {

    useAuthStore.mockReturnValue({
      status: 'not-authenticated',
      checkAuthToken: mockCheckAuthToken,
    })

    const { container } = render(
      <MemoryRouter>
        <AppRouter />
      </MemoryRouter>
    );

    expect(screen.getByText('Ingreso')).toBeTruthy();
    expect(container).toMatchSnapshot();

  })


  test('should display the calendar screen if we are authenticated', () => {

    useAuthStore.mockReturnValue({
      status: 'authenticated',
      checkAuthToken: mockCheckAuthToken,
    })

    render(
      <MemoryRouter>
        <AppRouter />
      </MemoryRouter>
    );

    expect(screen.getByText('CalendarPage')).toBeTruthy();

  })


});
