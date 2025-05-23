import { Staff, Subject } from "@/types/timetable";

export const staffData: Staff[] = [
  {
    id: "11",
    name: "Sowmiya",
    email: "sowmiya@velammal.edu",
    maxPeriods: 5,
  },
  {
    id: "12",
    name: "K. Sudha",
    email: "sudha@velammal.edu",
    maxPeriods: 6,
  },
  {
    id: "13",
    name: "Dinesh Kumar",
    email: "dinesh@velammal.edu",
    maxPeriods: 6,
  },
  {
    id: "14",
    name: "Deepika",
    email: "deepika@velammal.edu",
    maxPeriods: 7,
  },
  {
    id: "15",
    name: "Kirupavathy",
    email: "kirupavathy@velammal.edu",
    maxPeriods: 5,
  },
  {
    id: "16",
    name: "Sophia",
    email: "sophia@velammal.edu",
    maxPeriods: 4,
  },
];

export const subjectData: Subject[] = [
  {
    id: "21",
    code: "MA8402",
    name: "Probability and Statistics",
    title: "Probability and Statistics",
    type: "Theory",
    staff: "Sowmiya",
    shortName: "PAS",
    periodsPerWeek: 5,
    isLab: false,
    staffId: "11",
    priority: 1,
  },
  {
    id: "22",
    code: "CS8491",
    name: "Operating Systems",
    shortName: "OS",
    periodsPerWeek: 4,
    isLab: false,
    staffId: "12",
    priority: 1,
    type: "Theory",
    title: "Operating Systems",
    staff: "K. Sudha",
  },
  {
    id: "23",
    code: "CS8491",
    name: "Machine Learning",
    shortName: "ML",
    periodsPerWeek: 5,
    isLab: false,
    staffId: "13",
    priority: 1,
    type: "Theory",
    title: "Machine Learning",
    staff: "Dinesh Kumar",
  },
  {
    id: "24",
    code: "AD8401",
    name: "Fundamentals of Data Science and Analytics",
    shortName: "FDSA",
    periodsPerWeek: 5,
    isLab: false,
    staffId: "14",
    priority: 1,
    type: "Theory",
    title: "Fundamentals of Data Science and Analytics",
    staff: "Deepika",
  },
  {
    id: "25",
    code: "CS8591",
    name: "Computer Networks",
    shortName: "CN",
    periodsPerWeek: 4,
    isLab: false,
    staffId: "15",
    priority: 1,
    type: "Theory",
    title: "Computer Networks",
    staff: "Kirupavathy",
  },
  {
    id: "26",
    code: "GE8561",
    name: "Environmental Sciences and Sustainability",
    shortName: "EVS",
    periodsPerWeek: 4,
    isLab: false,
    staffId: "16",
    priority: 2,
    type: "Theory",
    title: "Environmental Sciences and Sustainability",
    staff: "Sophia",
  },
  {
    id: "7",
    code: "AD8411",
    name: "Data Science and Analytics Laboratory",
    shortName: "FDSA LAB",
    periodsPerWeek: 3,
    isLab: true,
    staffId: "14",
    priority: 3,
    type: "Lab",
    title: "Data Science and Analytics Laboratory",
    staff: "Deepika",
    continuous: true,
  },
  {
    id: "8",
    code: "CS8581",
    name: "Machine Learning Laboratory",
    shortName: "ML LAB",
    periodsPerWeek: 3,
    isLab: true,
    staffId: "13",
    priority: 3,
    continuous: true,
    type: "Lab",
    title: "Machine Learning Laboratory",
    staff: "Dinesh Kumar",
  },
  {
    id: "9",
    code: "CS8581",
    name: "Computer Networks Laboratory",
    shortName: "CN LAB",
    continuous: true,
    periodsPerWeek: 2,
    isLab: true,
    staffId: "15",
    priority: 3,
    title: "Computer Networks Laboratory",
    type: "Lab",
    staff: "Kirupavathy",
  },
  {
    id: "30",
    code: "AD8071",
    name: "Activity Hour",
    shortName: "ACTIVITY",
    periodsPerWeek: 2,
    isLab: false,
    staffId: "14", // All staff
    priority: 4,
    type: "Activity",
    title: "Department Activity Hour",
    staff: "All AI&DS Dept Staffs",
  },
  {
    id: "31",
    code: "HS8581",
    name: "Professional Development",
    shortName: "PD",
    periodsPerWeek: 2,
    isLab: false,
    staffId: "15",
    priority: 2,
    type: "Activity",
    title: "Professional Development",
    staff: "Kirupavathy",
  },
  {
    id: "32",
    code: "LIB1001",
    name: "Library / Skill Rack",
    shortName: "LIB/SKILL RACK",
    periodsPerWeek: 1,
    isLab: false,
    staffId: "15",
    priority: 5,
    type: "Activity",
    title: "Library / Skill Rack",
    staff: "Kirupavathy",
  },
  {
    id: "13",
    code: "AL3452",
    name: "Operating System Laboratory",
    shortName: "OS LAB",
    periodsPerWeek: 2,
    type: "Lab",
    isLab: true,
    staffId: "14",
    priority: 5,
    title: "Operating System Laboratory",
    staff: "Ms. Sujitha"
  },
];
