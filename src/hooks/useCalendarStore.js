import { useDispatch, useSelector } from "react-redux";
import {
  onAddNewEvent,
  onDeleteEvent,
  onSetActiveEvent,
  onUpdateEvent,
} from "../store";
import { calendarApi } from "../api";
import { dateFormatter } from "../helpers";

export const useCalendarStore = () => {
  const dispatch = useDispatch();
  const { events, activeEvent } = useSelector((state) => state.calendar);
  const { user } = useSelector((state) => state.auth);

  const setActiveEvent = (calendarEvent) => {
    dispatch(onSetActiveEvent(calendarEvent));
  };

  const startSavingEvent = async (calendarEvent) => {
    if (calendarEvent._id) {
      //Update
      dispatch(onUpdateEvent({ ...calendarEvent }));
    } else {
      //Create
      try {
        const { data } = await calendarApi.post("/events", calendarEvent);
        dispatch(onAddNewEvent({ ...calendarEvent, id: data.event.id, user }));
      } catch (error) {
        console.log("StartSavingEvent ~ error:", error);
      }
    }
  };

  const startDeletingEvent = () => {
    dispatch(onDeleteEvent());
  };

  const startLoadingEvents = async () => {
    try {
      const { data } = await calendarApi.get("/events");
      const event = dateFormatter(data.events);
      console.log(
        "🚀 ~ file: useCalendarStore.js:43 ~ startLoadingEvents ~ event:",
        event
      );
      // dispatch()
    } catch (error) {
      console.log("StartLoadingEvents ~ error:", error);
    }
  };

  return {
    //Properties
    events,
    activeEvent,
    hasEventSelected: !!activeEvent,

    //Methods
    setActiveEvent,
    startSavingEvent,
    startDeletingEvent,
    startLoadingEvents,
  };
};
