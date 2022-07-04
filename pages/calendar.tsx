import { NextPage } from "next";
import { useEffect } from "react";
import { getEvents } from "slices/calendar";
import { useDispatch, useSelector } from "store";

const Calendar: NextPage = () => {
    const dispatch = useDispatch();
    const { events } = useSelector((state) => state.calendar);
    console.log(events);
    useEffect(
        () => {
          dispatch(getEvents());
        },
        []
      );
    return(<>
    </>);
}

export default Calendar;