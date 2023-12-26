import { useState } from "react";
import { Calendar } from "react-big-calendar";
import { addHours } from "date-fns";
import { NavBar, CalendarEvent, CalendarModal } from "../components";
import { localizer, getMessages } from "../../helpers";
import "react-big-calendar/lib/css/react-big-calendar.css";

const events = [
  {
    title: "cumpleaños Jefe",
    notes: "Hay que comprar el pastel",
    start: new Date(),
    end: addHours(new Date(), 2),
    bgColor: "#fafafa",
    user: {
      _id: "123",
      name: "Fernando",
    },
  },
];

export const CalendarPage = () => {
  const [lastView, setLastView] = useState(
    localStorage.getItem("lastView") || "week"
  );

  const eventStyleGetter = (event, start, end, isSelected) => {
    console.log({ event, start, end, isSelected });
    const style = {
      backgroundColor: "#347CF7",
      borderRadius: "0px",
      opacity: 0.8,
      color: "#FFFF",
    };
    return style;
  };

  const onDoubleClick = (event) => {
    console.log(
      "🚀 ~ file: CalendarPage.jsx:34 ~ onDoubleClick ~ event:",
      event
    );
  };

  const onSelect = (event) => {
    console.log("🚀 ~ file: CalendarPage.jsx:40 ~ onSelect ~ event:", event);
    return {};
  };

  const onViewChanged = (event) => {
    localStorage.setItem("lastView", event);
    setLastView(event);
  };

  return (
    <>
      <NavBar />
      <Calendar
        culture="es"
        localizer={localizer}
        events={events}
        defaultView={lastView}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "calc(100vh - 80px)" }}
        messages={getMessages()}
        eventPropGetter={eventStyleGetter}
        components={{
          event: CalendarEvent,
        }}
        onDoubleClickEvent={onDoubleClick}
        onSelectEvent={onSelect}
        onView={onViewChanged}
      />

      <CalendarModal />
    </>
  );
};
