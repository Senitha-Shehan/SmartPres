const timetable = [
    {
        year: 1,
        semester: 2,
        moduleCode: "IT1020",
        moduleName: "DMS",
        instructor: "Dr. Smith",
        timeSlots: [
            { date: "Friday", startTime: "09:00", endTime: "11:00", room: "A101" },
            { date: "Tuesday", startTime: "12:00", endTime: "14:00", room: "B202" },
        ],
    },
    {
        year: 2,
        semester: 1,
        moduleCode: "IT3030",
        moduleName: "ITPM",
        instructor: "Prof. Johnson",
        timeSlots: [
            { date: "Monday", startTime: "10:00", endTime: "12:00", room: "C303" },
            { date: "Thursday", startTime: "14:00", endTime: "16:00", room: "D404" },
        ],
    },
    {
        year: 2,
        semester: 2,
        moduleCode: "IT2040",
        moduleName: "PAF",
        instructor: "Dr. Harris",
        timeSlots: [
            { date: "Thursday", startTime: "13:00", endTime: "15:00", room: "E505" },
            { date: "Tuesday", startTime: "09:00", endTime: "11:00", room: "F606" },
        ],
    },
    {
        year: 3,
        semester: 1,
        moduleCode: "IT9010",
        moduleName: "OOP",
        instructor: "Dr. Lee",
        timeSlots: [
            { date: "Wednesday", startTime: "08:00", endTime: "10:00", room: "G707" },
            { date: "Tuesday", startTime: "10:00", endTime: "12:00", room: "H808" },
        ],
    },
    {
        year: 3,
        semester: 2,
        moduleCode: "IT5090",
        moduleName: "OSSA",
        instructor: "Prof. White",
        timeSlots: [
            { date: "Wednesday", startTime: "14:00", endTime: "16:00", room: "I909" },
            { date: "Tuesday", startTime: "16:00", endTime: "18:00", room: "J1010" },
        ],
    },
    {
        year: 4,
        semester: 1,
        moduleCode: "IT2020",
        moduleName: "MC",
        instructor: "Dr. Green",
        timeSlots: [
            { date: "Friday", startTime: "10:00", endTime: "12:00", room: "K1111" },
            { date: "Wednesday", startTime: "14:00", endTime: "16:00", room: "L1212" },
        ],
    },
    ];
    
    export default timetable;
    