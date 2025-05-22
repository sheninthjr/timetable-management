const timetable = [
  {
    Monday: [
      {
        subject: "ML",
        title: "Machine Learning",
        staff: "P. Abirami",
        continuous: false,
      },
      {
        subject: "CN",
        title: "Computer Networks",
        staff: "Justin Xavier",
        continuous: false,
      },
      {
        subject: "EVS",
        title: "Environmental Sciences and Sustainability",
        staff: "Siva Karthikeyan",
        continuous: false,
      },
      {
        subject: "FDSA",
        title: "Fundamentals of Data Science and Analytics",
        staff: "Vidya",
        continuous: false,
      },
      {
        subject: "OS LAB",
        title: "Operating System Laboratory",
        staff: "Vidya",
        continuous: true,
        span: 2,
      },
      {
        subject: "OS LAB",
        title: "Operating System Laboratory",
        staff: "Vidya",
        continuous: true,
        span: 2,
      },
      {
        subject: "OS",
        title: "Operating Systems",
        staff: "Sujitha",
        continuous: false,
      },
    ],
    Tuesday: [
      {
        subject: "PAS",
        title: "Probability and Statistics",
        staff: "Sagaya Rebecca",
        continuous: false,
      },
      {
        subject: "ML LAB",
        title: "Machine Learning Laboratory",
        staff: "P. Abirami",
        continuous: true,
        span: 3,
      },
      {
        subject: "ML LAB",
        title: "Machine Learning Laboratory",
        staff: "P. Abirami",
        continuous: true,
        span: 3,
      },
      {
        subject: "ML LAB",
        title: "Machine Learning Laboratory",
        staff: "P. Abirami",
        continuous: true,
        span: 3,
      },
      {
        subject: "ML",
        title: "Machine Learning",
        staff: "P. Abirami",
        continuous: false,
      },
      {
        subject: "EVS",
        title: "Environmental Sciences and Sustainability",
        staff: "Siva Karthikeyan",
        continuous: false,
      },
      {
        subject: "PAS",
        title: "Probability and Statistics",
        staff: "Sagaya Rebecca",
        continuous: false,
      },
    ],
    Wednesday: [
      {
        subject: "EVS",
        title: "Environmental Sciences and Sustainability",
        staff: "Siva Karthikeyan",
        continuous: false,
      },
      {
        subject: "OS",
        title: "Operating Systems",
        staff: "Sujitha",
        continuous: false,
      },
      {
        subject: "ML",
        title: "Machine Learning",
        staff: "P. Abirami",
        continuous: false,
      },
      {
        subject: "CN",
        title: "Computer Networks",
        staff: "Justin Xavier",
        continuous: false,
      },
      {
        subject: "ML",
        title: "Machine Learning",
        staff: "P. Abirami",
        continuous: false,
      },
      {
        subject: "PD",
        title: "Professional Development",
        staff: "Vidya",
        continuous: false,
      },
      {
        subject: "OS",
        title: "Operating Systems",
        staff: "Sujitha",
        continuous: false,
      },
    ],
    Thursday: [
      {
        subject: "FDSA LAB",
        title: "Data Science and Analytics Laboratory",
        staff: "Vidya",
        continuous: true,
        span: 3,
      },
      {
        subject: "FDSA LAB",
        title: "Data Science and Analytics Laboratory",
        staff: "Vidya",
        continuous: true,
        span: 3,
      },
      {
        subject: "FDSA LAB",
        title: "Data Science and Analytics Laboratory",
        staff: "Vidya",
        continuous: true,
        span: 3,
      },
      {
        subject: "PAS",
        title: "Probability and Statistics",
        staff: "Sagaya Rebecca",
        continuous: false,
      },
      {
        subject: "FDSA",
        title: "Fundamentals of Data Science and Analytics",
        staff: "Vidya",
        continuous: false,
      },
      {
        subject: "EVS",
        title: "Environmental Sciences and Sustainability",
        staff: "Siva Karthikeyan",
        continuous: false,
      },
      {
        subject: "FDSA",
        title: "Fundamentals of Data Science and Analytics",
        staff: "Vidya",
        continuous: false,
      },
    ],
    Friday: [
      {
        subject: "PD",
        title: "Professional Development",
        staff: "Vidya",
        continuous: false,
      },
      {
        subject: "PAS",
        title: "Probability and Statistics",
        staff: "Sagaya Rebecca",
        continuous: false,
      },
      {
        subject: "CN LAB",
        title: "Computer Networks Laboratory",
        staff: "Justin Xavier",
        continuous: true,
        span: 2,
      },
      {
        subject: "CN LAB",
        title: "Computer Networks Laboratory",
        staff: "Justin Xavier",
        continuous: true,
        span: 2,
      },
      {
        subject: "FDSA",
        title: "Fundamentals of Data Science and Analytics",
        staff: "Vidya",
        continuous: false,
      },
      {
        subject: "OS",
        title: "Operating Systems",
        staff: "Sujitha",
        continuous: false,
      },
      {
        subject: "FDSA",
        title: "Fundamentals of Data Science and Analytics",
        staff: "Vidya",
        continuous: false,
      },
    ],
    Saturday: [
      {
        subject: "PAS",
        title: "Probability and Statistics",
        staff: "Sagaya Rebecca",
        continuous: false,
      },
      {
        subject: "ML",
        title: "Machine Learning",
        staff: "P. Abirami",
        continuous: false,
      },
      {
        subject: "LIB/SKILL RACK",
        title: "Library / Skill Rack",
        staff: "Vidya",
        continuous: false,
      },
      {
        subject: "CN",
        title: "Computer Networks",
        staff: "Justin Xavier",
        continuous: false,
      },
      {
        subject: "CN",
        title: "Computer Networks",
        staff: "Justin Xavier",
        continuous: false,
      },
      {
        subject: "ACTIVITY",
        title: "Department Activity Hour",
        staff: "Vidya",
        continuous: false,
      },
      {
        subject: "ACTIVITY",
        title: "Department Activity Hour",
        staff: "Vidya",
        continuous: false,
      },
    ],
  },
];
const ZAPIER_ENDPOINT = "https://hooks.zapier.com/hooks/catch/22968748/27znyqp/";
const email = 'sheninth2004@gmail.com';
const classAndSection = 'CSE-B';

const periodTimes = [
  { start: { hour: 8, minute: 30 }, end: { hour: 9, minute: 20 } },
  { start: { hour: 9, minute: 20 }, end: { hour: 10, minute: 10 } },
  { start: { hour: 10, minute: 10 }, end: { hour: 11, minute: 0 } },
  { start: { hour: 11, minute: 15 }, end: { hour: 12, minute: 0 } },
  { start: { hour: 12, minute: 0 }, end: { hour: 12, minute: 45 } },
  { start: { hour: 13, minute: 35 }, end: { hour: 14, minute: 25 } },
  { start: { hour: 14, minute: 25 }, end: { hour: 15, minute: 15 } },
];

function getCurrentDay() {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const now = new Date();
  return days[now.getDay()];
}

function isTimeEqual(t1, t2) {
  return t1.hour === t2.hour && t1.minute === t2.minute;
}

function addMinutes(time, minutesToAdd) {
  const date = new Date();
  date.setHours(time.hour, time.minute);
  date.setMinutes(date.getMinutes() + minutesToAdd);
  return { hour: date.getHours(), minute: date.getMinutes() };
}

export function checkAndSendReminders() {
    console.log("hi")
  const now = new Date();
  const currentTime = { hour: now.getHours(), minute: now.getMinutes() };
  const day = getCurrentDay();

  if (day === 'Sunday') return;

  const todaySchedule = timetable[0][day];
  if (!todaySchedule) return;

  for (let i = 0; i < periodTimes.length; i++) {
    const periodStart = periodTimes[i].start;
    // Changed from -5 to -10 minutes for reminders
    const reminderTime = addMinutes(periodStart, -10);

    if (isTimeEqual(currentTime, reminderTime)) {
      const subjectDetails = todaySchedule[i];

      if (!subjectDetails) return;

      const message = `Dear ${subjectDetails.staff},

You have a class scheduled in 10 minutes.

📘 Subject: ${subjectDetails.title} (${subjectDetails.subject})
🏫 Class: ${classAndSection}
📅 Day: ${day}
🕒 Time: ${periodStart.hour}:${String(periodStart.minute).padStart(2, '0')}

This is an automated reminder.`;

      sendEmailToStaff(subjectDetails.staff, message);
    }
  }
}

function sendEmailToStaff(staffName, message) {
  fetch(ZAPIER_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      staffName,
      message
    })
  }).then(res => {
    if (res.ok) {
      console.log(`Reminder sent to ${staffName}`);
    } else {
      console.error(`Failed to send reminder to ${staffName}`);
    }
  }).catch(err => {
    console.error("Error sending request to Zapier:", err);
  });
}

// Check every minute
setInterval(checkAndSendReminders, 60 * 1000);

// You can also call it immediately once
checkAndSendReminders();