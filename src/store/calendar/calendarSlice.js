import { createSlice } from "@reduxjs/toolkit";

// Event example
// [{
//   "title": "New note",
//   "notes": "test",
//   "start": "2024-01-07T05:15:49.015Z",
//   "end": "2024-01-07T07:15:49.015Z",
//   "user": {
//       "_uid": "658f34b9726d92a1d981daf8",
//       "name": "Eduardo"
//   },
//   "id": "659a3394ab0a73353df83f88"
// }]

export const calendarSlice = createSlice({
  name: "calendar",
  initialState: {
    isLoadingEvents: true,
    events: [],
    activeEvent: null,
  },

  reducers: {
    onSetActiveEvent: (state, { payload }) => {
      state.activeEvent = payload;
    },

    onAddNewEvent: (state, { payload }) => {
      state.events.push(payload);
      state.activeEvent = null;
    },

    onUpdateEvent: (state, { payload }) => {
      state.events = state.events.map((event) => {
        if (event.id === payload.id) {
          return payload;
        }
        return event;
      });
    },

    onDeleteEvent: (state) => {
      if (state.activeEvent) {
        state.events = state.events.filter(
          (event) => event.id !== state.activeEvent.id
        );
        state.activeEvent = null;
      }
    },

    onLoadEvents: (state, { payload = [] }) => {
      state.isLoadingEvents = false;
      payload.forEach((event) => {
        const exist = state.events.some((dbEvent) => dbEvent.id === event.id);
        if (!exist) {
          state.events.push(event);
        }
      });
    },
  },
});

export const {
  onSetActiveEvent,
  onAddNewEvent,
  onUpdateEvent,
  onDeleteEvent,
  onLoadEvents,
} = calendarSlice.actions;
