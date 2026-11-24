import {
    logOut,
    checkTeacherDb,
    authChange,
    loadClassType,
    loadNormalClass,
    loadDateClass,
    saveClass,
    deleteClass
} from "./database.js";

const signUpNav = document.getElementById("signUpNav");
const logInNav = document.getElementById("logInNav");
const logOutNav = document.getElementById("logOutNav");
const userNav = document.getElementById("userNav");
const statusNav = document.getElementById("statusNav");

const year = document.getElementById("yearValue");
const month = document.getElementById("monthValue");
const yearBack = document.getElementById("yearBack");
const yearGo = document.getElementById("yearGo");
const monthBack = document.getElementById("monthBack");
const monthGo = document.getElementById("monthGo");

const cell = document.getElementById("cell");
const dateCellHeader = document.getElementById("dateCellHeader");
const classDay = document.getElementById("classDay");

const homeworkButton = document.getElementById("homeworkButton");
const overlay = document.getElementById("overlay");
const homework = document.getElementById("homework");
const dateHomework = document.getElementById("dateHomework");

const classTypeForm = document.getElementById("classTypeForm");
const swapButton = document.getElementById("swapButton");
const fixButton = document.getElementById("fixButton");
const submitFix = document.getElementById("submitFix");

const verifyNoti = document.getElementById("verifyNoti");
const clossNoti = document.getElementById("clossNoti");

const cellClasses = document.querySelectorAll(".cell-class");
const dates = document.querySelectorAll(".date");
const mon = document.querySelectorAll(".mon");
const tue = document.querySelectorAll(".tue");
const wed = document.querySelectorAll(".wed");
const thu = document.querySelectorAll(".thu");
const fri = document.querySelectorAll(".fri");
const formClassTypes = document.querySelectorAll(".class-type");

const header = document.querySelector("header");
const main = document.querySelector("main");

const cellTimes = Array.from({length:11}, (_, i) => document.getElementById(`cellTime${i+1}`));

const classes = Array.from({length:11}, (_, i) => {
    return{
        subject: document.getElementById(`class${i+1}-1`),
        teacher: document.getElementById(`class${i+1}-2`),
        room: document.getElementById(`class${i+1}-3`)
    };
});

const headerHeight = () => {
    const height = header.offsetHeight;
    document.documentElement.style.setProperty("--header_height", `${height}px`);
};

const checkUser = async (session) => {
    if(session === null) {
        signUpNav.style.display = "block";
        logInNav.style.display = "block";
        logOutNav.style.display = "none";
        verifyNav.style.display = "none";
        userNav.style.display = "none";
        statusNav.style.display = "none";
    } else {
        signUpNav.style.display = "none";
        logInNav.style.display = "none";
        logOutNav.style.display = "block";
        userNav.style.display = "block";
        userNav.textContent = session.user.user_metadata.username;  
        statusNav.style.display = "block";
        if(await checkTeacherDb()) {
            verifyNav.style.display = "none";
            statusNav.src = "./assets/pictures/check.webp";
            statusNav.title = "ยืนยันสถานะครูแล้ว";
            if(!fixMode) {
                fixButton.style.display = "flex";
            };
        } else {
            verifyNav.style.display = "block";
            statusNav.src = "./assets/pictures/cross.webp";
            statusNav.title = "ยังไม่ได้ยืนยันสถานะครู";
        };
    };
};

const calendarCal = (monthCount, yearCount) => {
    const first = `${yearCount-543}-${monthCount+1}-${1}`;
    const last = `${yearCount-543}-${monthCount+1}-${lastDate(monthCount, yearCount-543)}`;
    const firstDay = new Date(first).getDay();
    const lastDay = new Date(last).getDay();
    const nowDate = new Date().getDate();
    const nowMonth = new Date().getMonth();
    const nowYear = new Date().getFullYear();
    const weekends = [0, 6, 7, 13, 14, 20, 21, 27, 28, 34, 35, 41];

    dates[firstDay].textContent = 1;
    dates[firstDay].classList.remove("block-day", "out-month");

    for(let i = 2; i<=lastDate(monthCount, yearCount-543); i++) {
        dates[firstDay+i-1].textContent = i;
        dates[firstDay+i-1].classList.remove("block-day", "out-month");
    };

    for(let i = 0; firstDay-i-1>=0; i++) {
        dates[firstDay-i-1].textContent = lastDate((monthCount-1+monthNames.length) % monthNames.length, yearCount-543)-i;
        dates[firstDay-i-1].classList.add("out-month");
    };

    if(lastDate(monthCount, yearCount-543)===28 && firstDay===0) {
        for(let i = 1; i<=7; i++) {
            dates[i+27].textContent = i;
            dates[i+27].classList.add("out-month");
        };
        for(let i = 1; i<=7; i++) {
            dates[i+34].textContent = i+13-lastDay;
            dates[i+34].classList.add("out-month");
        };
    } else if(firstDay===6 && lastDate(monthCount, yearCount-543)===29) {
        for(let i = 1; i<=7; i++) {
            dates[i+34].textContent = i;
            dates[i+34].classList.add("out-month");
        };
    } else if((lastDate(monthCount, yearCount-543)>=30 && firstDay>=5)) {
        for(let i = 1; lastDay+i<=6; i++) {
            dates[lastDay+i+35].textContent = i;
            dates[lastDay+i+35].classList.add("out-month");
        };
    } else if(lastDay===6){
        for(let i = 1; i<=7; i++) {
            dates[i+34].textContent = i;
            dates[i+34].classList.add("out-month");
        };
    } else {
        for(let i = 1; lastDay+i<=6; i++) {
            dates[lastDay+i+28].textContent = i;
            dates[lastDay+i+28].classList.add("out-month");
        };
        for(let i = 1; i<=7; i++) {
            dates[i+34].textContent = i+6-lastDay;
            dates[i+34].classList.add("out-month");
        };
    };

    weekends.forEach(weekend => dates[weekend].classList.add("block-day"));

    for(const target of dates) {
        target.style.removeProperty("color");
        target.style.removeProperty("font-weight");
        if(target.textContent==nowDate && monthCount===nowMonth && yearCount-543===nowYear) {
            target.style.color = "var(--important_color)";
            target.style.fontWeight = "400";
        };
    };
};

const lastDate = (mv, yv) => {
    let kom = [0, 2, 4, 6, 7, 9, 11];
    let yon = [3, 5, 8, 10];

    if(kom.includes(mv)){
        return(31)
    } else if(yon.includes(mv)) {
        return(30)
    } else {
        if((yv%4 === 0 && yv%100 !== 0) || year%400 === 0){
            return(29)
        } else {
            return(28)
        };
    };
};

const beforeClassLoad = async (target) => {
    if(!target.classList.contains("out-month") && !target.classList.contains("block-day")) {   
        cell.style.display = "block";
        dateCount = target.textContent;
        currDate = `${yearCount-543}-${monthCount+1}-${dateCount}`;
        loadedClass = await loadDateClass(currDate);
        
        if(!!loadedClass?.class_type) {
            formClassTypes[loadedClass.class_type-1].checked = true;
        } else {
            formClassTypes[0].checked = true;
        };
            
        formClassTypes.forEach((formClassType) => formClassType.dispatchEvent(new Event("change")));
    };
};

const classLoad = async (day) => {
    for(const item of classes) {
        item.subject.innerHTML = "&nbsp;";
        item.teacher.innerHTML = "กำลังโหลด...";
        item.room.innerHTML = "&nbsp;";
    };

    classDay.textContent = dayThNames[day];

    if(result[day]) {
        for(const [i, item] of classes.entries()) {
            item.subject.innerHTML = result[day].class[i].subject;
            item.teacher.innerHTML = result[day].class[i].teacher;
            item.room.innerHTML = result[day].class[i].room;
        };
        if(!!loadedClass?.class) {  
            for(const [i, item] of classes.entries()) {
                if(loadedClass.class[i] !== null) {
                    item.subject.innerHTML = loadedClass.class[i].subject;
                    item.teacher.innerHTML = loadedClass.class[i].teacher;
                    item.room.innerHTML = loadedClass.class[i].room;
                };
            };  
        };
    } else {
        for(const item of classes) {
            item.subject.innerHTML = "&nbsp;";
            item.teacher.innerHTML = "ไม่มีข้อมูล";
            item.room.innerHTML = "&nbsp;";
        };
    };
};

const termCheck = (mv, yv) => {
    if(mv>=4 && mv<=8) {
        return(`${yv}-1`)
    } else if(mv>=9) {
        return(`${yv}-2`)
    } else {
        return(`${yv-1}-2`)
    };
};

const termChange = async (mv, yv) => {
    if(term !== termCheck(mv, yv)) {
        term = termCheck(mv, yv);
        result = await loadNormalClass(term);
    };
};

const clickFixCellClasses = target => {
    const truth = target.style.backgroundColor === "var(--soft_important)";

    for(const item of cellClasses) {
        item.style.backgroundColor = "var(--soft_soft_important)";
        item.style.boxShadow = "none";
    };

    if(truth) {
        swapButton.style.display = "none";
        submitFix.inert = false;
    } else {
        target.style.backgroundColor = "var(--soft_important)";
        target.style.boxShadow = "0 0 1.5rem 0.5rem var(--soft_important)";
        swapButton.style.display = "flex";
        submitFix.inert = true;
    };
};

const clickChooseCellClasses = target => {
    const truth = target.style.backgroundColor === "var(--soft_important)";

    for(const item of cellClasses) {
        item.style.backgroundColor = "var(--soft_soft_important)";
        item.style.boxShadow = "none";
    };

    if(truth) {
        swapButton.style.display = "none";
    } else {
        swapButton.style.display = "flex";
        target.style.backgroundColor = "var(--soft_important)";
        target.style.boxShadow = "0 0 1.5rem 0.5rem var(--soft_important)";
    };
};

const swapA = () => {
    for(const date of dates) {
        date.inert = true;
    };

    for(const [i, item] of cellClasses.entries()) {
        if(item.style.backgroundColor === "var(--soft_important)") {
            fixClass[0].date = currDate;
            fixClass[0].class = i+1;
            fixClass[0].subject = classes[i].subject.textContent;
            fixClass[0].teacher = classes[i].teacher.textContent;
            fixClass[0].room = classes[i].room.textContent;

            swapMode = true;
            swapButton.textContent = "ตกลง";
            swapButton.style.display = "none";

            for(const [j, target] of cellClasses.entries()) {
                target.removeEventListener("click", clickCellClasses[j]);
                clickCellClasses[j] = () => clickChooseCellClasses(target);
                target.addEventListener("click", clickCellClasses[j]);
            };
        } else {
            for(const date of dates) {
                date.inert = false;
            };
        };

        item.style.backgroundColor = "var(--soft_soft_important)";
        item.style.boxShadow = "none";
    };
};

const swapB = () => {
    for(const [i, item] of cellClasses.entries()) {
        if(item.style.backgroundColor === "var(--soft_important)") {
            fixClass[1].date = currDate;
            fixClass[1].class = i+1;
            fixClass[1].subject = classes[i].subject.textContent;
            fixClass[1].teacher = classes[i].teacher.textContent;
            fixClass[1].room = classes[i].room.textContent;

            swapMode = false;
            swapButton.textContent = "สลับ";

            for(const [j, target] of cellClasses.entries()) {
                target.removeEventListener("click", clickCellClasses[j]);
                clickCellClasses[j] = () => clickFixCellClasses(target);
                target.addEventListener("click", clickCellClasses[j]);
            };
            
            for(const [j, _] of cellClasses.entries()) {
                if(fixClass[0].date === fixClass[1].date) {
                    if(fixClass[0].class === j+1) {
                        subjectChange[0].date = fixClass[0].date;
                        subjectChange[0].class[j] = {
                            "class": fixClass[0].class,
                            "subject": fixClass[1].subject,
                            "teacher": fixClass[1].teacher,
                            "room": fixClass[1].room
                        };
                    };
                    if(fixClass[1].class === j+1) {
                        subjectChange[0].date = fixClass[1].date;
                        subjectChange[0].class[j] = {
                            "class": fixClass[1].class,
                            "subject": fixClass[0].subject,
                            "teacher": fixClass[0].teacher,
                            "room": fixClass[0].room
                        };
                    };
                } else {
                    if(fixClass[0].class === j+1) {
                        subjectChange[0].date = fixClass[0].date;
                        subjectChange[0].class[j] = {
                            "class": fixClass[0].class,
                            "subject": fixClass[1].subject,
                            "teacher": fixClass[1].teacher,
                            "room": fixClass[1].room
                        };
                    };
                    if(fixClass[1].class === j+1) {
                        subjectChange[1].date = fixClass[1].date;
                        subjectChange[1].class[j] = {
                            "class": fixClass[1].class,
                            "subject": fixClass[0].subject,
                            "teacher": fixClass[0].teacher,
                            "room": fixClass[0].room
                        };
                    };
                };
            };

            swapButton.style.display = "none";
            submitFix.inert = false;
            for(const date of dates) {
                date.inert = true;
            };
        };

        item.style.backgroundColor = "var(--soft_soft_important)";
        item.style.boxShadow = "none";
    };
};

window.addEventListener("reload", headerHeight);
window.addEventListener("resize", headerHeight);

logOutNav.addEventListener("click", async (e) => {
    e.preventDefault();
    await logOut();
});

yearBack.addEventListener("click", async () => {
    if(yearCount===2490) {
        yearCount = new Date().getFullYear()+544;
    } else {
        yearCount--;
    };
    year.textContent = yearCount;
    await termChange(monthCount, yearCount);
    calendarCal(monthCount, yearCount);
});
yearGo.addEventListener("click", async () => {
    if(yearCount===new Date().getFullYear()+544) {
        yearCount = 2490;
    } else {
        yearCount++;
    };
    year.textContent = yearCount;
    await termChange(monthCount, yearCount);
    calendarCal(monthCount, yearCount);
});

monthBack.addEventListener("click", async () => {
    if(monthCount===0){
        monthCount = 11;
        if(yearCount===2490) {
            yearCount = new Date().getFullYear()+544;
        } else {
            yearCount--;
        };
        year.textContent = yearCount;
    } else {
        monthCount--
    };
    month.textContent = monthNames[monthCount];
    await termChange(monthCount, yearCount);
    calendarCal(monthCount, yearCount);
});
monthGo.addEventListener("click", async () => {
    if(monthCount===11){
        monthCount = 0;
        if(yearCount===new Date().getFullYear()+544) {
            yearCount = 2490;
        } else {
            yearCount++;
        };
        year.textContent = yearCount;
    } else {
        monthCount++
    };
    month.textContent = monthNames[monthCount];
    await termChange(monthCount, yearCount);
    calendarCal(monthCount, yearCount);
});

homeworkButton.addEventListener("click", () => {
    overlay.style.display = "block"
    homework.style.animation = "none";
    void homework.offsetWidth;
    homework.style.animation = "slide-R-to-L 0.2s ease-out forwards";

    dateHomework.innerHTML = `${dateCount}/${monthCount+1}/${yearCount}`;
});

overlay.addEventListener("click", () => {
    homework.style.animation = "none";
    void homework.offsetWidth;
    homework.style.animation = "slide-R-to-L 0.15s ease-out reverse forwards";
    overlay.style.display = "none"
});

swapButton.addEventListener("click", e => {
    e.preventDefault();

    if(swapMode) {
        swapB();
    } else {
        swapA();
    };
});

fixButton.addEventListener("click", async () => {
    if(await checkTeacherDb()) {
        for(const date of dates) {
            date.inert = true;
        };

        fixMode = true;
        homeworkButton.style.display = "none";
        fixButton.style.display = "none";
        submitFix.style.display = "flex";
        classTypeForm.style.display = "flex";

        for(const [i, cellClass] of cellClasses.entries()) {
            clickCellClasses[i] = () => clickFixCellClasses(cellClass);
            cellClass.style.cursor = "pointer";
            cellClass.style.backgroundColor = "var(--soft_soft_important)";
            cellClass.addEventListener("click", clickCellClasses[i]);
        };
    } else {
        overlay.style.display = "block";
        verifyNoti.style.animation = "none";
        verifyNoti.offsetHeight;
        verifyNoti.style.animation = "push-noti 0.2s ease-out forwards";
    };
});

submitFix.addEventListener("click", async () => {
    if(await checkTeacherDb()) {
        main.style.animation = "2s loading linear infinite";

        const selectedType = Array.from(classTypeForm).find(item => item.checked);
        const notSubject = subjectChange[0].class.every(item => item===null);
        const sameDay = fixClass[0].date === fixClass[1].date;
        const nowDay = new Date(currDate).getDay();
        const nowDayMap = dayMap[nowDay];
        const duplicateClass = Array.from({length:2}, () => true)
        const fix = subjectChange;

        fixMode = false;
        homeworkButton.style.display = "flex";
        fixButton.style.display = "flex";
        submitFix.style.display = "none";
        swapButton.style.display = "none";
        classTypeForm.style.display = "none";

        for(const [i, cellClass] of cellClasses.entries()) {
            cellClass.style.removeProperty("cursor");
            cellClass.style.removeProperty("background-color");
            cellClass.style.removeProperty("box-shadow");
            cellClass.removeEventListener("click", clickCellClasses[i]);
        };

        if(!notSubject) {
            let og = result[(new Date(fix[0].date).getDay())-1].class;
            let now = await loadDateClass(fix[0].date);
            for(const [i, item] of fix[0].class.entries()) {
                const final = item ?? now?.class?.[i] ?? null;
                if(final === null) {
                    continue;
                };
                
                if((final.subject!=og[i].subject) || (final.teacher!=og[i].teacher) || (final.room!=og[i].room)) {
                    duplicateClass[0] = false;
                    break;
                };
            };
            
            if(!sameDay) {
                og = result[(new Date(fix[1].date).getDay())-1].class;
                now = await loadDateClass(fix[1].date);
                for(const [i, item] of fix[1].class.entries()) {
                    const final = item ?? now?.class?.[i] ?? null;
                    if(final === null) {
                        continue;
                    };
                    
                    if((final.subject!=og[i].subject) || (final.teacher!=og[i].teacher) || (final.room!=og[i].room)) {
                        duplicateClass[1] = false;
                        break;
                    };
                };
            };
        };
        
        if(notSubject) {
            if(selectedType.value!=1 && selectedType.value!=loadedClass?.class_type) {
                await saveClass(currDate, selectedType.value, null);
            } else if(selectedType.value==1 && loadedClass?.class && loadedClass.class_type!=1) {
                await saveClass(currDate, selectedType.value, null);
            } else if(selectedType.value==1 && !(await loadDateClass(currDate))?.class) {
                await deleteClass(currDate);
            };
        } else {
            if(sameDay) {
                if(!duplicateClass[0]) {
                    await saveClass(fix[0].date, selectedType.value, fix[0].class)
                } else if(selectedType.value==1 && duplicateClass[0]) {
                    await deleteClass(currDate);
                };
            } else {
                if(!duplicateClass[0]) {
                    await saveClass(fix[0].date, selectedType.value, fix[0].class);
                } else if(selectedType.value==1 && duplicateClass[0]) {
                    await deleteClass(fix[0].date);
                };
                if(!duplicateClass[1]) {
                    await saveClass(fix[1].date, selectedType.value, fix[1].class);
                } else if(selectedType.value==1 && duplicateClass[1]) {
                    await deleteClass(fix[1].date);
                };
            };
        };
        
        for(const item of nowDayMap.name) {
            if(item.textContent == dateCount) {
                await beforeClassLoad(item);
                classLoad(nowDayMap.index);
            };
        };

        subjectChange = Array.from({length:2}, () => {
            return {
                date: null,
                class: Array(11).fill(null)
            };
        });

        for(const date of dates) {
            date.inert = false;
        };
        main.style.removeProperty("animation");
    } else {
        overlay.style.display = "block";
        verifyNoti.style.animation = "none";
        verifyNoti.offsetHeight;
        verifyNoti.style.animation = "push-noti 0.2s ease-out forwards";
    };
});

clossNoti.addEventListener("click", () => {
    overlay.style.display = "none";
    verifyNoti.style.animation = "none";
    verifyNoti.offsetHeight;
    verifyNoti.style.animation = "push-noti 0.2s ease-out reverse forwards";
});

mon.forEach((monJr) =>
    monJr.addEventListener("click", async () => {
        if(!monJr.classList.contains("out-month") && !monJr.classList.contains("block-day")) {
            await beforeClassLoad(monJr);
            dateCellHeader.innerHTML = `&nbsp;จ.&nbsp;${dateCount}&nbsp;${monthNames[monthCount]}&nbsp;${yearCount}`;
            classLoad(0);
        };
    })
);
tue.forEach((tueJr) =>
    tueJr.addEventListener("click", async () => {
        if(!tueJr.classList.contains("out-month") && !tueJr.classList.contains("block-day")) {
            await beforeClassLoad(tueJr);
            dateCellHeader.innerHTML = `&nbsp;อ.&nbsp;${dateCount}&nbsp;${monthNames[monthCount]}&nbsp;${yearCount}`;
            classLoad(1);
        };
    })
);
wed.forEach((wedJr) =>
    wedJr.addEventListener("click", async () => {
        if(!wedJr.classList.contains("out-month") && !wedJr.classList.contains("block-day")) {
            await beforeClassLoad(wedJr);
            dateCellHeader.innerHTML = `&nbsp;พ.&nbsp;${dateCount}&nbsp;${monthNames[monthCount]}&nbsp;${yearCount}`;
            classLoad(2);
        };
    })
);
thu.forEach((thuJr) =>
    thuJr.addEventListener("click", async () => {
        if(!thuJr.classList.contains("out-month") && !thuJr.classList.contains("block-day")) {
            await beforeClassLoad(thuJr);
            dateCellHeader.innerHTML = `&nbsp;พฤ.&nbsp;${dateCount}&nbsp;${monthNames[monthCount]}&nbsp;${yearCount}`;
            classLoad(3);
        };
    })
);
fri.forEach((friJr) =>
    friJr.addEventListener("click", async () => {
        if(!friJr.classList.contains("out-month") && !friJr.classList.contains("block-day")) {
            await beforeClassLoad(friJr);
            dateCellHeader.innerHTML = `&nbsp;ศ.&nbsp;${dateCount}&nbsp;${monthNames[monthCount]}&nbsp;${yearCount}`;
            classLoad(4);
        };
    })
);

formClassTypes.forEach((formClassType) =>
    formClassType.addEventListener("change", async () => {
        if(formClassType.checked) {
            for(const [i, cellTime] of cellTimes.entries()) {
                cellTime.textContent = classType[`${formClassType.value-1}`][`hour${i+1}`];
            };
        };
    })
);

const classType = await loadClassType();
const dayMap = {
    1: {name: mon, index: 0},
    2: {name: tue, index: 1},
    3: {name: wed, index: 2},
    4: {name: thu, index: 3},
    5: {name: fri, index: 4}
};

let fixClass = [
    {
        date: null,
        class: null,
        subject: null,
        teacher: null,
        room: null
    },
    {
        date: null,
        class: null,
        subject: null,
        teacher: null,
        room: null
    }
];
let subjectChange = Array.from({length:2}, () => {
    return {
        date: null,
        class: Array(11).fill(null)
    };
});

let yearCount = new Date().getFullYear()+543;
let monthNames = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม"
];
let monthCount = new Date().getMonth();
let dateCount;
let dayThNames = [
    "จันทร์",
    "อังคาร",
    "พุธ",
    "พฤหัสฯ",
    "ศุกร์"
];
let currDate;
let term = termCheck(monthCount, yearCount);
let result = await loadNormalClass(term);
let fixMode = false;
let swapMode = false;
let loadedClass;
let clickCellClasses = Array(11);

year.textContent = yearCount;
month.textContent = monthNames[monthCount];

headerHeight();
calendarCal(monthCount, yearCount);
authChange((event, session) => checkUser(session));