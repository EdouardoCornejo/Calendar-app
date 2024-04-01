export const events = [
    {     
          id: '1',
          title: "Cumpleaños del jefe",
          notes: "alguna nota",
          start: new Date('2022-10-21 13:00:00'),
          end: new Date('2022-10-21 15:00:00'),
    },
    {     
        id: '2',
        title: "Cumpleaños de la gerente",
        notes: "alguna nota para gerente",
        start: new Date('2022-10-21 13:00:00'),
        end: new Date('2022-10-21 15:00:00'),
  }
];


export const initialState = {
    isLoadingEvents: true,
    events: [],
    activeEvent: null,
}

export const calendarWithEventsStates = {
    isLoadingEvents: false,
    events: [...events],
    activeEvent: null,
}

export const calendarWithActiveEventsStates = {
    isLoadingEvents: false,
    events: [...events],
    activeEvent: {...events[0]},
}