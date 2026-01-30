import supabase from './config.js';

// Clean Notification Function
function showNotify(message, isSuccess = false) {
    const modalMsg = document.getElementById('modalMessage');
    modalMsg.innerText = message;
    modalMsg.className = isSuccess ? "text-success fw-bold" : "text-danger fw-bold";
    
    const modalElement = document.getElementById('statusModal');
    const myModal = new bootstrap.Modal(modalElement);
    myModal.show();

    setTimeout(() => {
        myModal.hide();
        // Sirf login success par redirect hoga
        if (isSuccess && message === "Successful!") {
            window.location.href = 'app.html';
        }
    }, 1000); 
}

// SIGNUP: Done hone par toggle karke login dikhayega
document.getElementById('signup-btn')?.addEventListener('click', async () => {
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const pass = document.getElementById('signup-password').value;

    const { data, error } = await supabase.auth.signUp({
        email, password: pass, options: { data: { full_name: name } }
    });

    if (error) {
        showNotify("Error: " + error.message);
    } else {
        showNotify("Signup Done!", true);
        setTimeout(() => { toggleForm(); }, 1200); 
    }
});

// LOGIN: Sahi hone par hi app.html pe jayega
document.getElementById('login-btn')?.addEventListener('click', async () => {
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-password').value;

    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });

    if (error) {
        showNotify("Incorrect Email or Password");
    } else {
        showNotify("Successful!", true);
    }
});