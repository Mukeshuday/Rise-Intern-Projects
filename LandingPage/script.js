document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('contact-form');
  const alertBox = document.getElementById('alert-box');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
      alertBox.innerText = "Please fill out all fields.";
      alertBox.style.backgroundColor = "#fee2e2"; // light red
      alertBox.style.color = "#b91c1c";
      alertBox.style.display = "block";
      return;
    }

    // Store data in localStorage
    const contactData = {
      name,
      email,
      message,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('contactFormSubmission', JSON.stringify(contactData));

    // Show success alert
    alertBox.innerText = `Thanks, ${name}! Your message has been sent.`;
    alertBox.style.backgroundColor = "#d1fae5"; // light green
    alertBox.style.color = "#065f46";
    alertBox.style.display = "block";

    // Clear form fields
    form.reset();

    // Auto-hide alert after 3 seconds
    setTimeout(() => {
      alertBox.style.display = "none";
    }, 3000);
  });
});