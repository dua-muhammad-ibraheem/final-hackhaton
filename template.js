import supabase from './config.js';

// 1. Image Preview Function
const previewImage = (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const outImg = document.getElementById('outImg');
            outImg.src = e.target.result;
            outImg.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    }
};

// 2. Sync Data for Live Preview
const syncData = () => {
    const mappings = {
        'name': 'outName',
        'title': 'outTitle',
        'email': 'outEmail',
        'phone': 'outPhone',
        'summary': 'outSummary',
        'edu': 'outEdu',
        'exp': 'outExp',
        'skills': 'outSkills'
    };

    for (let inpId in mappings) {
        const input = document.getElementById(inpId + 'Inp');
        const output = document.getElementById(mappings[inpId]);
        if (input && output) {
            output.innerText = input.value || "";
        }
    }
};

// 3. Save Function (With Auth Security)
const saveAndGoToDashboard = async () => {
    const saveBtn = document.querySelector('button');
    const originalText = saveBtn.innerText;
    
    // Check if user is logged in
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (!user || authError) {
        alert("Please Login first to save your resume!");
        return;
    }

    saveBtn.innerText = "Processing...";
    saveBtn.disabled = true;

    try {
        const fileInput = document.getElementById('imageInp');
        const file = fileInput.files[0];
        let imageUrl = "";

        // Image upload to bucket 'img-url'
        if (file) {
            const fileName = `${Date.now()}_${file.name.replace(/\s/g, '_')}`;
            const { data: imgData, error: imgErr } = await supabase.storage
                .from('img-url') 
                .upload(fileName, file);

            if (imgErr) throw imgErr;

            const { data: urlData } = supabase.storage
                .from('img-url')
                .getPublicUrl(fileName);
            
            imageUrl = urlData.publicUrl;
        }

        // Table Data with user_id for security
        const resumeData = {
            user_id: user.id, // Linking data to logged-in user
            full_name: document.getElementById('nameInp').value,
            email: document.getElementById('emailInp').value,
            phone: document.getElementById('phoneInp').value,
            summary: document.getElementById('summaryInp').value,
            education: document.getElementById('eduInp').value,
            experience: document.getElementById('expInp').value,
            skills: document.getElementById('skillsInp').value,
            "img-url": imageUrl 
        };

        const { error: dbErr } = await supabase
            .from('resume') 
            .insert([resumeData]);

        if (dbErr) throw dbErr;

        alert("Resume Saved Successfully!");
        window.location.href = 'dashboard.html';

    } catch (err) {
        alert("Error: " + err.message);
        saveBtn.innerText = originalText;
        saveBtn.disabled = false;
    }
};

// Global attachment
window.previewImage = previewImage;
window.syncData = syncData;
window.saveAndGoToDashboard = saveAndGoToDashboard;
window.resetForm = () => { document.getElementById('resumeForm').reset(); syncData(); };
window.downloadPDF = () => { window.print(); };