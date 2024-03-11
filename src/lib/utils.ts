// tailwind helpers
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Date helpers
const relativeFormatter = new Intl.RelativeTimeFormat(undefined, {
  numeric: "auto",
});

type Division = {
  amount: number;
  name: Intl.RelativeTimeFormatUnit;
};

const DIVISIONS: Division[] = [
  { amount: 60, name: "seconds" },
  { amount: 60, name: "minutes" },
  { amount: 24, name: "hours" },
  { amount: 7, name: "days" },
  { amount: 4.34524, name: "weeks" },
  { amount: 12, name: "months" },
  { amount: Number.POSITIVE_INFINITY, name: "years" },
];

export function getRelativeTime(date: Date) {
  let duration = (date.getTime() - new Date().getTime()) / 1000;

  for (let i = 0; i < DIVISIONS.length; i++) {
    const division = DIVISIONS[i];
    if (Math.abs(duration) < division.amount) {
      return relativeFormatter.format(Math.round(duration), division.name);
    }
    duration /= division.amount;
  }
}

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "long",
  timeStyle: "medium",
});

export function getTime(date: Date) {
  let formattedDate = dateFormatter.format(date.getTime());
  return `${formattedDate.split("at")[0]} - ${formattedDate.split("at")[1].toUpperCase()}`;
}
