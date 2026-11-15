import { logOut, authChange, checkTeacherDb, verifyTeacherDb } from "./database.js";

const logOutNav = document.getElementById("logOutNav");
const userNav = document.getElementById("userNav");
const verifyPassword = document.getElementById("verifyPassword");
const errorVerifyPassword = document.getElementById("errorVerifyPassword");
const submit = document.getElementById("submit");

const header = document.querySelector("header");
const main = document.querySelector("main");

const headerHeight = () => {
    const height = header.offsetHeight;
    document.documentElement.style.setProperty("--header_height", `${height}px`);
};

const checkUser = async (session) => {
    if(session===null || await checkTeacherDb()) {
        window.location.href = "../";
    } else {
        userNav.textContent = session.user.user_metadata.username;
    };
};

const checkVerifyTeacher = () => {
    if(verifyPassword.value.length === 0) {
        errorVerifyPassword.textContent = "*กรุณากรอกรหัสยืนยันตัวตนครู"
        errorVerifyPassword.style.display = "block";
        verifyPassword.classList.add("error-input");
        return false;
    } else {
        errorVerifyPassword.style.display = "none";
        verifyPassword.classList.remove("error-input");
        return true;
    };
};

window.addEventListener("reload", headerHeight);
window.addEventListener("resize", headerHeight);

logOutNav.addEventListener("click", async (e) => {
    e.preventDefault();
    await logOut();
});

verifyPassword.addEventListener("input", () => {
    checkVerifyTeacher();
});

submit.addEventListener("click", async (e) => {
    e.preventDefault();
    
    if(checkVerifyTeacher()) {
        main.style.animation = "2s loading linear infinite";
        const verifyMessage = await verifyTeacherDb(verifyPassword);
        if(!(verifyMessage.success)) {
            errorVerifyPassword.style.display = "block";
            verifyPassword.classList.add("error-input");

            if(verifyMessage.message === 1) {
                errorVerifyPassword.textContent = "*รหัสยืนยันตัวตนครูไม่ถูกต้อง";
            } else if(verifyMessage.message === 2){
                errorVerifyPassword.textContent = `*ใส่รหัสยืนยันตัวตนครูผิดเกิน 3 ครั้ง ต้องรอ ${verifyMessage.minutes}:${verifyMessage.seconds}`;
            };
        } else {
            window.location.href = "../";
        };
        main.style.removeProperty("animation");
    };
});

headerHeight();
authChange((event, session) => checkUser(session));