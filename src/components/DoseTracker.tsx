import React from "react";
import { CalendarDays } from "lucide-react-native";
import { MoodBubbleSelector } from "./MoodBubbleSelector";
import { TookDose } from "../types";

type Props = {
  doseDay: string;
  value: TookDose;
  onChange: (value: TookDose) => void;
};

export function DoseTracker({ doseDay, value, onChange }: Props) {
  return (
    <MoodBubbleSelector
      label="Took GLP-1 today?"
      helper={`Usual dose day: ${doseDay}`}
      value={value}
      options={[
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
        { value: "not dose day", label: "Not dose day" }
      ]}
      onChange={(next) => onChange(next as TookDose)}
    />
  );
}

export const DoseTrackerIcon = CalendarDays;
