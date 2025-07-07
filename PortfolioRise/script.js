

function downloadResume() {
  const link = document.createElement("a");
  link.href = "./image/Mukesh-ATS updated.pdf";
  link.download="Mukesh_UdayaKumar_Resume.pdf";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}


document.getElementById("contact-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  if (name && email && message) {
    localStorage.setItem("contact", JSON.stringify({ name, email, message }));
    document.getElementById("success-banner").style.display = "block";

    setTimeout(() => {
      document.getElementById("success-banner").style.display = "none";
    }, 3000);

    this.reset();
  } else {
    alert("Please fill out all fields.");
  }
});


