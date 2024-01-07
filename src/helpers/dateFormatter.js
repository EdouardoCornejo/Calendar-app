import { parseISO } from "date-fns";

export const dateFormatter = (events = []) =>
  events.map((event) => {
    event.start = parseISO(event.start);
    event.end = parseISO(event.end);
    return event;
  });
