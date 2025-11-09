import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

export function MaterialMCalendar() {
  return (
    <div className="p-4">
      <DayPicker mode="single" />
    </div>
  );
}
