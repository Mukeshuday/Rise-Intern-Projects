// === DOM ELEMENTS ===
const modal = document.getElementById("modal");
const openBtn = document.getElementById("open-modal-btn");
const cancelBtn = document.getElementById("cancel-modal");
const submitBtn = document.getElementById("submit-student");

const nameInput = document.getElementById("student-name");
const idInput = document.getElementById("student-id");
const courseInput = document.getElementById("student-course");
const attendanceInput = document.getElementById("student-attendance");
const photoInput = document.getElementById("student-photo");

const tbody = document.querySelector(".student-table tbody");

const allSections = document.querySelectorAll(".main-content > section");

const navItems = document.querySelectorAll(".nav-menu li");
const contentSections = document.querySelectorAll(".content-section");

// Theme
const savedTheme = localStorage.getItem("theme");
if(savedTheme === "light"){
  document.body.classList.add("light-theme");
}

navItems.forEach(item => {
  item.addEventListener("click", () => {
    // Highlight active nav item
    navItems.forEach(i => i.classList.remove("active"));
    item.classList.add("active");

    const sectionToShow = item.getAttribute("data-section") + "-section";

    contentSections.forEach(section => {
      section.style.display = section.id === sectionToShow ? "block" : "none";
    });

    if(sectionToShow === "attendance-section") {
      renderAttendance();
    }

    contentSections.forEach(section => {
      section.style.display = section.id === sectionToShow ? "block" : "none";
    
      if (section.id === "grades-section") renderGrades();
});


    
  });
});

// Stats
const totalStudentsEl = document.querySelectorAll(".stat-card")[0].querySelector("p");
const presentTodayEl = document.querySelectorAll(".stat-card")[1].querySelector("p");
const avgGradeEl = document.querySelectorAll(".stat-card")[2].querySelector("p");
const alertsEl = document.querySelectorAll(".stat-card")[3].querySelector("p");

// === STUDENT DATA ===
let students = JSON.parse(localStorage.getItem("students")) || [];

// === INITIAL RENDER ===
renderTable();
updateStats();

// === EVENT LISTENERS ===
openBtn.addEventListener("click", () => modal.classList.add("active"));

cancelBtn.addEventListener("click", () => {
  modal.classList.remove("active");
  clearForm();
});

submitBtn.addEventListener("click", () => {
  const name = nameInput.value.trim();
  const studentId = idInput.value.trim();
  const course = courseInput.value.trim();
  const attendance = parseInt(attendanceInput.value.trim());
  const photo = photoInput.value.trim() || `https://i.pravatar.cc/40?img=${Math.floor(Math.random() * 70) + 1}`;

  if (!name || !studentId || !course || isNaN(attendance)) {
    alert("Please fill in all fields correctly.");
    return;
  }

  const newStudent = {
    id: Date.now(),
    name,
    studentId,
    course,
    attendance,
    photo,
    grade:""
  };

  students.push(newStudent);
  saveToLocal();
  renderTable();
  updateStats();

  modal.classList.remove("active");
  clearForm();
});

// === FUNCTIONS ===

function renderTable() {
  tbody.innerHTML = "";

  students.forEach(student => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td><img src="${student.photo}" alt="Student photo" /></td>
      <td>${student.name}</td>
      <td>${student.studentId}</td>
      <td>${student.course}</td>
      <td>${student.attendance}%</td>
      <td>
        <button class="edit-btn"><i class="fas fa-pen"></i></button>
        <button class="delete-btn"><i class="fas fa-trash"></i></button>
      </td>
    `;

    // 🗑 Delete
    row.querySelector(".delete-btn").addEventListener("click", () => {
      students = students.filter(s => s.id !== student.id);
      saveToLocal();
      renderTable();
      updateStats();
    });

    tbody.appendChild(row);
  });
}

function updateStats() {
  const total = students.length;
  const present = students.filter(s => s.attendance >= 75).length;
  const avg = total > 0 ? Math.round(students.reduce((sum, s) => sum + s.attendance, 0) / total) : 0;
  const alerts = students.filter(s => s.attendance < 60).length;

  totalStudentsEl.textContent = total;
  presentTodayEl.textContent = present;
  avgGradeEl.textContent = `${avg}%`;
  alertsEl.textContent = alerts;
}

function saveToLocal() {
  localStorage.setItem("students", JSON.stringify(students));
}

function clearForm() {
  nameInput.value = "";
  idInput.value = "";
  courseInput.value = "";
  attendanceInput.value = "";
  photoInput.value = "";
}


// Attendance Functions and Variables
function renderAttendance() {
  const tbody = document.getElementById("attendance-body");
  tbody.innerHTML = "";

  students.forEach(student => {

    const saved = records.find(r => r.studentId === student.studentId && r.date === today);
    const selected = saved ? saved.status : "Present";

    const tr = document.createElement("tr");

    // Default date = today
    const today = new Date().toISOString().split("T")[0];

    tr.innerHTML = `
      <td>${student.name}</td>
      <td>${student.studentId}</td>
      <td>${today}</td>
      <td>
        <select class="attendance-status" data-student-id="${student.studentId}" data-date="${today}">
          <option value="Present" selected>Present</option>
          <option value="Absent">Absent</option>
          <option value="Leave">Leave</option>
        </select>
      </td>
    `;

    tbody.appendChild(tr);
  });
}


// Saving attendance student data in local storage
function saveAttendanceRecord(studentId, date, status) {
  const records = JSON.parse(localStorage.getItem("attendanceRecords")) || [];

  // Remove old entry for this student + date if exists
  const updated = records.filter(record => !(record.studentId === studentId && record.date === date));

  updated.push({ studentId, date, status });

  localStorage.setItem("attendanceRecords", JSON.stringify(updated));
}

// Add-event Listeners for Attendance-table
document.getElementById("attendance-body").addEventListener("change", (e) => {
  if (e.target.classList.contains("attendance-status")) {
    const row = e.target.closest("tr");
    const studentName = row.children[0].textContent;
    const studentId = row.children[1].textContent;
    const date = row.children[2].textContent;
    const status = e.target.value;

    saveAttendanceRecord(studentId, date, status);
    console.log(`✅ ${studentName} (${studentId}) marked as ${status} on ${date}`);
  }
});


// Grade-Function

function updateGrade(id, value) {
  const student = students.find(s => s.id === id);
  if (student) {
    student.grade = value;
    saveToLocal();
  }
}

function renderGrades() {
  const gradesBody = document.getElementById("grades-body");
  gradesBody.innerHTML = "";

  students.forEach(student => {
    const row = document.createElement("tr");

    // Predefined grade ooptions
    const gradeOptions =["A+","A","B","C","D","F"];

    const gradeDropdown =`
      <select class="grade-dropdown" onChange="updateGrade('${student.id}',
        this.value)">

          <option value=""> ---Select---</option>
          ${gradeOptions.map(option =>
              `<option value="${option}" ${student.grade === option ? 'selected' : ''}>${option} </option>`).join("")}
        </select>`;

    row.innerHTML = `
      <td>${student.name}</td>
      <td>${student.studentId}</td>
      <td>${student.course}</td>
      <td>${gradeDropdown}</td>
    `;

    gradesBody.appendChild(row);
  });
}

// Add-event Listeners for Grades
document.addEventListener("input", e => {
  if (e.target.classList.contains("grade-input")) {
    const field = e.target.getAttribute("data-field");
    const id = +e.target.getAttribute("data-id");
    const value = +e.target.value;

    const student = students.find(s => s.id === id);
    if (!student.grades) student.grades = {};
    student.grades[field] = value;

    saveToLocal();
    renderGrades();
  }
});



// Setting Function

document.getElementById("reset-data-btn").addEventListener("click", () => {
  if (confirm("This will delete all students and records. Continue?")) {
    localStorage.clear();
    students = [];
    saveToLocal();
    renderTable();
    renderGrades();
    renderAttendance();
    updateStats();

    document.getElementById("grades-body").innerHTML="";
    document.getElementById("attendance-body").innerHTML="";


  }
});

document.getElementById("toggle-theme-btn").addEventListener("click", () => {
  document.body.classList.toggle("light-theme");

  localStorage.setItem("theme",
    document.body.classList.contains("light-theme")?"light":"dark"
  );
});