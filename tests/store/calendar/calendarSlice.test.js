import { calendarSlice, onAddNewEvent, onDeleteEvent, onLoadEvents, onLogoutCalendar, onSetActiveEvent, onUpdateEvent } from "../../../src/store/calendar/calendarSlice"
import { calendarWithActiveEventsStates, calendarWithEventsStates, events, initialState } from "../../fixtures/calendarStates";

describe('test in calendarSlice', () => {

    test('should return the initial state', () => {
        const state = calendarSlice.getInitialState();
        expect(state).toEqual(initialState)
    })

    test('onSetActiveEvent should set the active event', () => {
        const state = calendarSlice.reducer(calendarWithEventsStates, onSetActiveEvent(events[0]))
        expect(state.activeEvent).toEqual(events[0]);
    })

    test('onAddNewEvent should add a new event', () => {
        const newEvent = {
            id: '3',
            title: "Cumpleaños de la jefa",
            notes: "alguna nota para jefa",
            start: new Date('2022-10-21 13:00:00'),
            end: new Date('2022-10-21 15:00:00'),
        }

        const state = calendarSlice.reducer(calendarWithEventsStates, onAddNewEvent(newEvent))
        expect(state.events.length).toBe(3);
        expect(state.events[2]).toEqual(newEvent);
        expect(state.events).toEqual([...events, newEvent])
    });

    test('onUpdateEvent should update an event', () => {
        const updatedEvent = {
            id: '1',
            title: "Cumpleaños actualizado del jefe",
            notes: "alguna nota actualizada",
            start: new Date('2022-10-21 13:00:00'),
            end: new Date('2022-10-21 15:00:00'),
        }

        const state = calendarSlice.reducer(calendarWithEventsStates, onUpdateEvent(updatedEvent))
        expect(state.events).toContain(updatedEvent);
    });

    test('onDeleteEvent should delete an event', () => {
        const state = calendarSlice.reducer(calendarWithActiveEventsStates, onDeleteEvent())
        expect(state.events.length).toBe(1);
        expect(state.activeEvent).toBeNull();
        expect(state.events).not.toContain(events[0])
        expect(state.events[0]).toEqual(events[1]);
    });

    test('onLoadEvents should load the events', () => {
        const state = calendarSlice.reducer(calendarWithEventsStates, onLoadEvents(events))
        expect(state.isLoadingEvents).toBeFalsy();
        expect(state.events).toEqual(events)
        expect(state.events.length).toBe(2);

        const newState = calendarSlice.reducer(state, onLoadEvents(events))
        expect(state.events.length).toBe(events.length);
    });

    test('onLogoutCalendar should reset the state', () => {
        const state = calendarSlice.reducer(calendarWithActiveEventsStates, onLogoutCalendar())
        expect(state).toEqual(initialState);
    });

})