import { Staff, Subject } from "@/types/timetable";

export const staffData: Staff[] = [
  {
    id: "1",
    name: "Sagaya Rebecca",
    email: "sheninth2004@gmail.com",
    maxPeriods: 5
  },
  {
    id: "2",
    name: "Sujitha",
    email: "sheninth2004@gmail.com", 
    maxPeriods: 6
  },
  {
    id: "3",
    name: "P. Abirami",
    email: "sheninth2004@gmail.com", 
    maxPeriods: 6
  },
  {
    id: "4",
    name: "Vidya",
    email: "sheninth2004@gmail.com",
    maxPeriods: 7
  },
  {
    id: "5",
    name: "Justin Xavier",
    email: "sheninth2004@gmail.com",
    maxPeriods: 5
  },
  {
    id: "6",
    name: "Siva Karthikeyan",
    email: "sheninth2004@gmail.com",
    maxPeriods: 4
  },
];
 
export const subjectData: Subject[] = [
  {
    id: "1",
    code: "MA8402",
    name: "Probability and Statistics",
    title: "Probability and Statistics",
    staff: "Ms. Sagaya Rebecca",
    shortName: "PAS",
    type: "Theory",
    periodsPerWeek: 5,
    isLab: false,
    staffId: "1",
    priority: 1,
  },
  {
    id: "2",
    code: "CS8491",
    name: "Operating Systems",
    shortName: "OS",
    periodsPerWeek: 4,
    isLab: false,
    staffId: "2",
    type: "Theory",
    priority: 1, 
    title: "Operating Systems", 
    staff: "Ms. Sujitha"
  },
  {
    id: "3",
    code: "CS8491",
    name: "Machine Learning",
    shortName: "ML",
    type: "Theory",
    periodsPerWeek: 5,
    title: "Machine Learning", 
    staff: "Ms. P. Abirami",
    isLab: false,
    staffId: "3",
    priority: 1,
  },
  {
    id: "4",
    code: "AD8401",
    name: "Fundamentals of Data Science and Analytics",
    shortName: "FDSA",
    periodsPerWeek: 5,
    type: "Theory",
    isLab: false,
    staffId: "4",
    priority: 1,
    title: "Fundamentals of Data Science and Analytics", 
    staff: "Ms. Vidya"
  },
  {
    id: "5",
    code: "CS8591",
    name: "Computer Networks",
    shortName: "CN",
    periodsPerWeek: 4,
    type: "Theory",
    isLab: false,
    staffId: "5",
    priority: 1, 
    title: "Computer Networks", 
    staff: "Mr. Justin Xavier"
  },
  {
    id: "6",
    code: "GE8561",
    name: "Environmental Sciences and Sustainability",
    shortName: "EVS",
    periodsPerWeek: 4,
    type: "Theory",
    isLab: false,
    staffId: "6",
    priority: 2,
    title: "Environmental Sciences and Sustainability", 
    staff: "Mr. Siva Karthikeyan"
  },
  {
    id: "7",
    code: "AD8411",
    name: "Data Science and Analytics Laboratory",
    shortName: "FDSA LAB",
    periodsPerWeek: 3,
    isLab: true,
    type: "Lab",
    staffId: "4",
    priority: 3, 
    title: "Data Science and Analytics Laboratory", 
    staff: "Ms. Vidya", 
    continuous: true, 
    span: 3
  },
  {
    id: "8",
    code: "CS8581",
    name: "Machine Learning Laboratory",
    shortName: "ML LAB",
    periodsPerWeek: 3,
    type: "Lab",
    isLab: true,
    staffId: "3",
    priority: 3,
    title: "Machine Learning Laboratory", 
    staff: "Ms. P. Abirami", 
    continuous: true, 
    span: 3
  },
  {
    id: "9",
    code: "CS8581",
    name: "Computer Networks Laboratory",
    shortName: "CN LAB",
    type: "Lab",
    periodsPerWeek: 2,
    isLab: true,
    staffId: "5",
    priority: 3,
    title: "Computer Networks Lab", 
    staff: "Justin Xavier", 
    continuous: true, 
    span: 3
  },
  {
    id: "10",
    code: "AD8071",
    name: "Department Activity Hour",
    shortName: "ACTIVITY",
    periodsPerWeek: 2, 
    type: "Activity",
    isLab: false,
    staffId: "4",
    priority: 4,
    title: "Department Activity Hour", 
    staff: "All AI&DS Dept Staffs"
  },
  {
    id: "11",
    code: "HS8581",
    name: "Professional Development",
    shortName: "PD",
    periodsPerWeek: 2,
    isLab: false, 
    type: "Activity",
    staffId: "4",
    priority: 2,
    title: "Professional Development", 
    staff: "Ms. Vidya"
  },
  {
    id: "12",
    code: "LIB1001",
    name: "Library / Skill Rack",
    shortName: "LIB/SKILL RACK", 
    type: "Activity",
    periodsPerWeek: 1,
    isLab: false,
    staffId: "4",
    priority: 5, 
    title: "Library / Skill Rack", 
    staff: "Ms. Vidya"
  },
  {
    id: "13",
    code: "AL3452",
    name: "Operating System Laboratory",
    shortName: "OS LAB",
    periodsPerWeek: 2,
    type: "Lab",
    isLab: true,
    staffId: "4",
    priority: 5,
    title: "Operating System Laboratory",
    staff: "Ms. Sujitha"
  },
];