import supabase from './config.js';

const fetchMyResumes = async () => {
    const grid = document.getElementById('resumes-grid');
    
    // Ab hum filter ke bagair saara data mangwayenge
    const { data, error } = await supabase
        .from('resume')
        .select('*'); 

    if (error) {
        console.error("Fetch Error:", error.message);
        return;
    }

    // Cards Render Logic (Same as before)
    let htmlContent = `<div onclick="window.location.href='template.html'" class="...">...Create Blank...</div>`;

    data.forEach(res => {
        htmlContent += `
            <div class="bg-[#06141B] border border-[#253745] rounded-xl p-5 shadow-lg">
                <div class="h-40 bg-[#11212D] rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                   ${res['img-url'] ? `<img src="${res['img-url']}" class="w-full h-full object-cover">` : `<span>No Image</span>`}
                </div>
                <h4 class="font-bold text-white text-lg">${res.full_name || 'Untitled'}</h4>
                <p class="text-xs text-[#9BA8AB] italic">Skills: ${res.skills || 'N/A'}</p>
            </div>
        `;
    });

    grid.innerHTML = htmlContent;
};

window.onload = fetchMyResumes;