export const ZAPIER_URL =
  "https://hooks.zapier.com/hooks/catch/23043397/2j4mhxa";
export const mail = "sheninth2004@gmail.com";

const LOCAL_STORAGE_KEY = "timetable_ui_I_AI&DS_B";

const defaultPeriodTimings = [
  "8:30-9:20",
  "9:20-10:10",
  "10:10-11:00",
  "11:15-12:00",
  "12:00-12:45",
  "1:35-2:25",
  "2:25-3:15",
];

// Extract year & section from key
function parseYearAndSection(key) {
  const parts = key.split("_");
  const section = parts.slice(2).join(" ").replace(/_/g, " ");
  const yearMatch = section.match(/\bI+|II+|III+|IV+\b/);
  const year = yearMatch
    ? {
        I: "First Year",
        II: "Second Year",
        III: "Third Year",
        IV: "Final Year",
      }[yearMatch[0]]
    : "Unknown Year";
  return { section, year };
}

export function sendEmailNotification(subjectName, staffName, section, year) {
  fetch(ZAPIER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      subject: subjectName,
      to: mail,
      body: {
        subject: subjectName,
        staff: staffName,
        section,
        year,
        to: mail,
        timestamp: new Date().toISOString(),
      },
    }),
  }).catch((error) => console.error("Zapier Error:", error));
}

const sentRecords = new Set();

export function timeToTriggerEmail(periodTimings = defaultPeriodTimings) {
  const { section, year } = parseYearAndSection(LOCAL_STORAGE_KEY);

  setInterval(() => {
    const now = new Date();
    const currentDay = now.toLocaleDateString("en-US", { weekday: "long" });
    const currentTime = now.toTimeString().slice(0, 5); // "HH:MM"

    const timetable = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_KEY) || "{}"
    );
    const todaySchedule = timetable[currentDay];
    if (!todaySchedule) return;

    // Match period by time
    const periodIndex = periodTimings.findIndex((period) => {
      const [start, end] = period.split("-");
      return currentTime >= start && currentTime <= end;
    });

    if (periodIndex === -1 || !todaySchedule[periodIndex]) return;

    const classInfo = todaySchedule[periodIndex];
    const uniqueKey = `${currentDay}-${periodIndex}-${classInfo.staff}`;

    if (sentRecords.has(uniqueKey)) return;

    sendEmailNotification(classInfo.title, classInfo.staff, section, year);
    sentRecords.add(uniqueKey);
  }, 60000); // every 1 minute
}
