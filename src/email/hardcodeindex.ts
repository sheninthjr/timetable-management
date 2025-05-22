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
    mode: "no-cors",
    body: JSON.stringify({
  subject: subjectName,
  staff: staffName,
  section,
  year,
  to: mail,
  timestamp: new Date().toISOString(),
  html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #005bbb;">📌 ${subjectName} - Notification</h2>
      <p><strong>Staff:</strong> ${staffName}</p>
      <p><strong>Section:</strong> ${section}</p>
      <p><strong>Year:</strong> ${year}</p>
      <p><strong>Email:</strong> ${mail}</p>
      <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
      <hr style="margin: 20px 0;" />
      <footer style="font-size: 0.9em; color: #777;">
        This is an automated email from your task notification system.
      </footer>
    </div>
  `
})
  })
    .then((res) => {
      if (res.ok) {
        alert("Email sent successfully ✅");
      } else {
        alert("Failed to send email ❌");
        console.error("Zapier Response Error:", res.statusText);
      }
    })
    .catch((error) => {
      alert("Error sending email ❌");
      console.error("Zapier Error:", error);
    });
}

const sentRecords = new Set();

export function timeToTriggerEmail(periodTimings = defaultPeriodTimings) {
  const { section, year } = parseYearAndSection(LOCAL_STORAGE_KEY);

  setInterval(() => {
    // 🔁 Simulated time for testing
    const simulatedDay = "Monday";
    const simulatedTime = "22:45"; // 10:38 PM in 24-hour format

    const timetable = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_KEY) || "{}"
    );
    const todaySchedule = timetable[simulatedDay];
    if (!todaySchedule) return;

    // Match period by time
    const periodIndex = periodTimings.findIndex((period) => {
      const [start, end] = period.split("-");
      return simulatedTime >= start && simulatedTime <= end;
    });

    if (periodIndex === -1 || !todaySchedule[periodIndex]) return;

    const classInfo = todaySchedule[periodIndex];
    const uniqueKey = `${simulatedDay}-${periodIndex}-${classInfo.staff}`;

    if (sentRecords.has(uniqueKey)) return;

    sendEmailNotification(classInfo.title, classInfo.staff, section, year);
    sentRecords.add(uniqueKey);
  }, 3000); // Run every 3 seconds for testing
}
