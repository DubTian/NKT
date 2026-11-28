const { createClient } = supabase;
const db = createClient('https://vmzamuxfadsdzjavoacd.supabase.co', 'sb_publishable_YKc0HiMVzwY1KXz6aq0cjA_MTKofqqN');

export const signUp = async (username, email, password) => {
    const { error } = await db.auth.signUp({
        email: email.value,
        password: password.value,
        options: {
            data: {
                username: username.value,
            },
        },
    });

    if(error) {
        console.error("Error", error);
        return false;
    };

    return true;
};

export const logIn = async (email, password) => {
    const { error } = await db.auth.signInWithPassword({
        email: email.value,
        password: password.value,
    });

    if(error) {
        console.error("Error", error);
        return true;
    };
};

export const logInOtp = async (emailOtp) => {
    const { error } = await db.auth.signInWithOtp({
        email: emailOtp.value,
    })

    if(error) {
        console.error("Error", error);
        return false;
    };

    return true;
};

export const verifyLogIn = async (emailOtp, otp) => {
    const { error } = await db.auth.verifyOtp({
        email: emailOtp.value,
        token: otp,
        type: "email",
    });

    if(error) {
        console.error("Error", error);
        return false;
    };
    
    return true;
};

export const logOut = async () => {
    const { error } = await db.auth.signOut();

    if(error) {
        console.error("Error", error);
    } else {
        window.location.reload();
    };
};

export const checkUsernameDb = async (username) => {
    const { data } = await db.rpc("check_username", {
        p_username: username.value,
    });

    return !data
};

export const checkEmailDb = async (email) => {
    const { data } = await db.rpc("check_email", {
        p_email: email.value,
    });

    if(data) {
        return false;
    } else {
        return true;
    };
};

export const checkTeacherDb = async () => {
    const { data, error } = await db.from("profiles")
        .select("teacher")
        .maybeSingle();

    if(error) {
        console.error("Error", error);
    } else {
        return data.teacher;
    };
};

export const verifyTeacherDb = async (password) => {
    const { data, error } = await db.rpc("verify_teacher", {
        p_password: password.value,
    });

    if(error) {
        console.error("Error", error);
    } else {
        return data;
    };
};

export const userSession = async () => {
    const { data } = await db.auth.getSession();
    return(data.session);
};

export const authChange = (callback) => 
    db.auth.onAuthStateChange((event, session) => {
        if(typeof callback === "function") {
            callback(event, session);
        };
    });

export const loadClassType = async () => {
    const { data, error } = await db.from("class_types")
        .select("hour1, hour2, hour3, hour4, hour5, hour6, hour7, hour8, hour9, hour10, hour11");
    
    if(error) {
        console.error("Error", error);
    } else {
        return data;
    };
};

export const loadNormalClass = async (term) => {
    const { data, error } = await db.from("class_normal_days")
        .select("class")
        .eq("term", term)
        .order("id", {ascending: true});

    if(error) {
        console.error("Error", error);
    } else {
        return data;
    };
};
    
export const loadDateClass = async (date) => {
    const { data, error } = await db.from("class_changes")
        .select("*")
        .eq("date", date)
        .maybeSingle();

    if(error) {
        console.error("Error", error);
    } else {
        return data;
    };
};

export const saveClass = async (date, classType, subject) => {
    if(subject === null) {
        const { error } = await db.from("class_changes")
            .upsert(
                {date: date, class_type: classType},
                {onConflict: "date"}
            );
        if(error) {
            console.error("Error", error);
        };
    } else {
        const { error } = await db.from("class_changes")
            .upsert(
                {date: date, class_type: classType, class: subject},
                {onConflict: "date"}
            );
        if(error) {
            console.error("Error", error);
        };
    };
};

export const deleteClass = async (date) => {
    const { error } = await db.from("class_changes")
        .delete()
        .eq("date", date);

    if(error) {
        console.error("Error", error);
    };
};

export const loadDateHomework = async (date) => {
    const { data, error } = await db.from("class_homeworks")
        .select("*")
        .eq("date", date)
        .maybeSingle();

    if(error) {
        console.error("Error", error);
    } else {
        return data;
    };
};

export const saveHomework = async (date, homework) => {
    const { error } = await db.from("class_homeworks")
        .upsert(
            {date: date, homework: homework},
            {onConflict: "date"}
        );

    if(error) {
        console.error("Error", error);
    };
};

export const deleteHomework = async (date) => {
    const { error } = await db.from("class_homeworks")
        .delete()
        .eq("date", date);

    if(error) {
        console.error("Error", error);
    };
};