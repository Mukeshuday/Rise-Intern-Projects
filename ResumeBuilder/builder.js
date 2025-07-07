// ==== Live Preview Binding ====

document.getElementById("input-name").addEventListener("input", function () {
  document.getElementById("preview-name").textContent = this.value || "Your Name";
});

document.getElementById("input-email").addEventListener("input", updateContact);
document.getElementById("input-phone").addEventListener("input", updateContact);

function updateContact() {
  const email = document.getElementById("input-email").value;
  const phone = document.getElementById("input-phone").value;
  const contactPreview = document.getElementById("preview-contact");

  if (email && phone) {
    contactPreview.textContent = `${email} | ${phone}`;
  } else {
    contactPreview.textContent = email || phone || "Email | Phone";
  }
}

document.getElementById("input-summary").addEventListener("input", function () {
  document.getElementById("preview-summary").textContent = this.value || "Your summary will appear here...";
});

document.getElementById("input-education").addEventListener("input", function () {
  document.getElementById("preview-education").textContent = this.value || "Education details...";
});

document.getElementById("input-experience").addEventListener("input", function () {
  document.getElementById("preview-experience").textContent = this.value || "Experience details...";
});

document.getElementById("input-skills").addEventListener("input", function () {
  const skillsInput = this.value;
  const skillList = document.getElementById("preview-skills");
  skillList.innerHTML = "";

  if (skillsInput.trim() === "") {
    const li = document.createElement("li");
    li.textContent = "Skill list will appear here...";
    li.style.opacity = "0.6";
    skillList.appendChild(li);
    return;
  }

  const skills = skillsInput.split(",").map(skill => skill.trim()).filter(skill => skill.length > 0);

  skills.forEach(skill => {
    const li = document.createElement("li");
    li.textContent = skill;
    skillList.appendChild(li);
  });
});


const templateSelector = document.getElementById('template-selector');
const preview = document.getElementById('resume-preview');

templateSelector.addEventListener('change', function () {
  preview.classList.remove('template-modern', 'template-creative', 'template-formal');
  preview.classList.add(this.value);
});

const templateThumbs = document.querySelectorAll('.template-thumb');
const resumePreview = document.getElementById('resume-preview');

templateThumbs.forEach(thumb => {
  thumb.addEventListener('click', () => {
    const selected = thumb.getAttribute('data-template');

    // Remove existing templates
    resumePreview.classList.remove('template-modern', 'template-creative', 'template-formal','template-neon','template-techwave','template-minimalist');

    // Apply new template
    resumePreview.classList.add(selected);

    // Highlight selected
    templateThumbs.forEach(t => t.classList.remove('selected-template'));
    thumb.classList.add('selected-template');
  });
});


// ==== Download Resume as PDF ====
function downloadPDF() {

   const btn = document.querySelector("button");
    btn.disabled = true;
    btn.textContent = "Generating PDF...";

    html2pdf().set(opt).from(resume).save().then(() => {
    btn.disabled = false;
    btn.textContent = "Download Resume";
    }); 

  const resume = document.getElementById("resume-preview");

  const opt = {
    margin: 0.3,
    filename: "Mukesh_Resume.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
    },
    jsPDF: {
      unit: "in",
      format: "letter",
      orientation: "portrait",
    },
  };

  html2pdf().set(opt).from(resume).save();
}