import { logIn, logInOtp, verifyLogIn, authChange } from "./database.js";

const email = document.getElementById("email");
const errorEmail = document.getElementById("errorEmail");
const password = document.getElementById("password");
const errorPassword = document.getElementById("errorPassword");
const submit = document.getElementById("submit");
const formLogIn = document.getElementById("logIn");
const goEmail = document.getElementById("goEmail");
const formLogInOtp = document.getElementById("logInOtp");
const verifyEmail = document.getElementById("verifyEmail");
const goPassword = document.getElementById("goPassword");
const emailOtp = document.getElementById("emailOtp");
const errorEmailOtp = document.getElementById("errorEmailOtp");
const submitEmail = document.getElementById("submitEmail");
const verifyOtp = document.getElementById("verifyOtp");
const backEmail = document.getElementById("backEmail");
const submitOtp = document.getElementById("submitOtp");

const inputs = document.querySelectorAll("#logIn input");
const otps = document.querySelectorAll(".otp");

const header = document.querySelector("header");
const main = document.querySelector("main");

const headerHeight = () => {
    const height = header.offsetHeight;
    document.documentElement.style.setProperty("--header_height", `${height}px`)
};

const emailCheck = () => {
    if(email.value!=="" && email.checkValidity()) {
        errorEmail.style.display = "none";
        email.classList.remove("error-input");
        return true;
    } else if(email.value === "") {
        errorEmail.textContent = "*กรุณากรอกอีเมล"
        errorEmail.style.display = "block";
        email.classList.add("error-input");
    } else if(!email.checkValidity()) {
        errorEmail.textContent = "*กรุณากรอกอีเมลที่ถูกต้อง";
        errorEmail.style.display = "block";
        email.classList.add("error-input");
    };

    email.style.animation = "none";
    void email.offsetWidth;
    email.style.animation = "shake 0.3s ease-in-out";
    return false;
};
const passwordCheck = () => {
    if(password.value.length>=8 && /[A-Z]/.test(password.value) && /[a-z]/.test(password.value) && /[0-9]/.test(password.value)) {
        errorPassword.style.display = "none";
        password.classList.remove("error-input");
        return true;
    } else if(password.value.length === 0) {
        errorPassword.textContent = "*กรุณากรอกรหัสผ่าน"
        errorPassword.style.display = "block";
        password.classList.add("error-input");
    } else if(password.value.length<8) {
        errorPassword.textContent = "*รหัสผ่านต้องมีอย่างน้อย 8 ตัว"
        errorPassword.style.display = "block";
        password.classList.add("error-input");
    };

    password.style.animation = "none";
    void password.offsetWidth;
    password.style.animation = "shake 0.3s ease-in-out";
    return false;
};
const emailOtpCheck = () => {
    if(emailOtp.value!=="" && emailOtp.checkValidity()) {
        errorEmailOtp.style.display = "none";
        emailOtp.classList.remove("error-input");
        return true;
    } else if(email.value === "") {
        errorEmailOtp.textContent = "*กรุณากรอกอีเมล"
        errorEmailOtp.style.display = "block";
        emailOtp.classList.add("error-input");
    } else if(!emailOtp.checkValidity()) {
        errorEmailOtp.textContent = "*กรุณากรอกอีเมลที่ถูกต้อง";
        errorEmailOtp.style.display = "block";
        emailOtp.classList.add("error-input");
    };

    emailOtp.style.animation = "none";
    void emailOtp.offsetWidth;
    emailOtp.style.animation = "shake 0.3s ease-in-out";
    return false;
};

const otpSum = () => {
    let sum = "";
    otps.forEach(otp => {
        sum += otp.value;
    });
    return(sum);
};

email.addEventListener("input", () => {
    clearTimeout(timerCheck);
    if(/[^A-Za-z0-9@#$!+*/=^._-]/.test(email.value)) {
        email.style.animation = "none";
        void email.offsetWidth;
        email.style.animation = "shake 0.3s ease-in-out";
    };
    email.value = email.value.replace(/[^A-Za-z0-9@#$!+*/=^._-]/g, "");
    timerCheck = setTimeout(() => {
        emailCheck();
    }, 400);
});
password.addEventListener("input", () => {
    clearTimeout(timerCheck);
    if(/[^A-Za-z0-9@#$!+*/=^._-]/.test(password.value)) {
        password.style.animation = "none";
        void password.offsetWidth;
        password.style.animation = "shake 0.3s ease-in-out";
    };
    password.value = password.value.replace(/[^A-Za-z0-9@#$!+*/=^._-]/g, "");
    timerCheck = setTimeout(() => {
        passwordCheck();
    }, 400);
});
emailOtp.addEventListener("input", () => {
    clearTimeout(timerCheck);
    if(/[^A-Za-z0-9@#$!+*/=^._-]/.test(emailOtp.value)) {
        emailOtp.style.animation = "none";
        void emailOtp.offsetWidth;
        emailOtp.style.animation = "shake 0.3s ease-in-out";
    };
    emailOtp.value = emailOtp.value.replace(/[^A-Za-z0-9@#$!+*/=^._-]/g, "");
    timerCheck = setTimeout(() => { 
        emailOtpCheck();
    }, 400);
});

submit.addEventListener("click", async (e) => {
    e.preventDefault();
    
    const emailChecked = emailCheck();
    const passwordChecked = passwordCheck();

    if(emailChecked && passwordChecked) {
        main.style.animation = "2s loading linear infinite";
        if(await logIn(email, password)) {
            errorPassword.textContent = "*อีเมลหรือรหัสผ่านผิด";
            errorPassword.style.display = "block";
            password.classList.add("error-input");
        };
        main.style.removeProperty("animation");
    };
});

goEmail.addEventListener("click", () => {
    formLogIn.style.display = "none"
    formLogInOtp.style.display = "block"
    verifyEmail.style.display = "block";
})
goPassword.addEventListener("click", () => {
    verifyEmail.style.display = "none";
    formLogInOtp.style.display = "none"
    formLogIn.style.display = "block";
    
});
backEmail.addEventListener("click", e => {
    e.preventDefault();
    verifyOtp.style.display = "none";
    verifyEmail.style.display = "block";
});

submitEmail.addEventListener("click", async (e) => {
    e.preventDefault();

    if(emailOtpCheck()) {
        main.style.animation = "2s loading linear infinite";
        if(await logInOtp(emailOtp)) {
            verifyEmail.style.display = "none";
            verifyOtp.style.display = "block";
        };
        main.style.removeProperty("animation");
    };
});

submitOtp.addEventListener("click", async (e) => {
    e.preventDefault();
    main.style.animation = "2s loading linear infinite";
    if(await verifyLogIn(emailOtp, otpSum())) {
        window.location.href = "../";
    };
    main.style.removeProperty("animation");
});

otps.forEach((otp, i) => {
    otp.addEventListener("input", () => {
        if(/[^\d]/.test(otp.value)) {
            otp.style.animation = "none";
            void otp.offsetWidth;
            otp.style.animation = "shake 0.3s ease-in-out";
        };
        otp.value = otp.value.replace(/[^\d]/g, "");
        if(otp.value && i<otps.length-1) {
            otps[i+1].focus();
        };
    });
    otp.addEventListener("keydown", e => {
        if(e.key==="Backspace" && !otp.value && i>0) {
            otps[i-1].focus();
        };
    });
    otp.addEventListener("paste", e => {
        const pasted = e.clipboardData.getData("text").trim();

        if(/^\d+$/.test(pasted)) {
            const numValue = pasted.split("");
            otps.forEach((otp, j) => {
                if(numValue[j]) {
                    otp.value = numValue[j];
                };
            });
            const lastIndex = Math.min(numValue.length, otps.length)-1;
            otps[lastIndex].focus();
        };
    });
});

inputs.forEach((input, i) =>
    input.addEventListener("keydown", e => {
        if(e.key === "Enter") {
            if(input.value && (i < inputs.length-1)) {
                e.preventDefault();
                inputs[i+1].focus();
            };
        };
    })
);

let timerCheck;

headerHeight();
authChange((event, session) => {
    if(session) {
        window.location.href = "../";
    };
});