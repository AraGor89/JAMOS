// import { formatDistanceToNow, isYesterday, isToday, parseISO } from "date-fns";

// export const formatDate = (date: string): string => {
//   const parsedDate = parseISO(date);

//   if (isToday(parsedDate)) {
//     return `Today at ${formatDistanceToNow(parsedDate, { addSuffix: true })}`;
//   } else if (isYesterday(parsedDate)) {
//     return `Yesterday at ${formatDistanceToNow(parsedDate, {
//       addSuffix: true,
//     })}`;
//   } else {
//     return `on ${parsedDate.toLocaleDateString()} at ${parsedDate.toLocaleTimeString()}`;
//   }
// };

export const formatDate = (date: Date, locale: string = "en-US"): string => {
  if (!date) return "";

  const parsedDate = new Date(date + "");
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  };

  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter?.format(parsedDate);
};

export function convertToBase64(
  file: File
): Promise<string | ArrayBuffer | null> {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve(null);
      return;
    }

    const reader: FileReader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (reader.result) {
        resolve(reader.result);
      } else {
        resolve(null);
      }
    };
    reader.onerror = (error) => {
      console.error("Error reading the file:", error);
      resolve(null);
    };
  });
}
