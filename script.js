/* Data for options */
let schoolNames = [
  { 0: "Select" },
  { 12: "School 1" },
  { 17: "School 2" },
  { 15: "School 3" },
];
let departmentNames = [
  "Select",
  "Electronics",
  "CS",
  "IT",
  "Mechanical",
  "Civil",
  "Automobile",
];

let electronicsCourses = [
  "Select",
  "Analog Communication",
  "Digital Electronics",
  "Digital System Design",
  "Electronic Device & Circuits",
  "Linear Integrated Circuit",
  "Discrete Time Signal",
  "Microcontrollers",
  "Antenna & Radio Wave",
  "Optical Communication",
];
let csCourses = [
  "Select",
  "C++",
  "Data Structures",
  "Computer Networks",
  "Discrete Mathematics",
  "Linux OS",
  "Database Management",
  "Operating System",
  "Programming with Java",
  "Theory of Computation",
  "Compiler Design",
];
let itCourses = [
  "Select",
  "Database Management",
  "File Structure",
  "Logic Design",
  "Operating System",
  "Programming in C",
  "Object Oriented using C++",
  "Data Mining",
  "RDBMS",
  "Computer Graphics",
  "Data Compression",
];
let mechanicalCourses = [
  "Select",
  "Fluid Mechanics",
  "Material Science",
  "Design",
  "Thermodynamics",
  "Applied Mechanics",
  "Solid Mechanics",
  "Heat Transfer",
  "Strenght of Material",
  "Thermal Engineering",
];
let civilCourses = [
  "Select",
  "Structural Engineering",
  "Envoirnmental Engineering",
  "Geotechnical",
  "Transportation Engineering",
  "Surveying",
  "Construction Engineering",
  "Hydraulic Engineering",
];
let automobileCourses = [
  "Select",
  "Applied Mechanics",
  "Mathematics",
  "Fluid Mechanics",
  "Vehicle Drawing",
  "Chassis",
  "Chemical Engineering",
  "Automobile Engine",
  "Robotics",
  "Solid Mechanics",
  "Thermodynamics",
];

// Mapping the dropdown content and injecting in html
let school = document.getElementById("school");
schoolNames.forEach((element) => {
  //console.log();
  let options = document.createElement("option");
  let optionValue = document.createTextNode(Object.values(element)[0]);
  options.appendChild(optionValue);
  school.appendChild(options);
});

let department = document.getElementById("department");
departmentNames.forEach((element, index) => {
  let options = document.createElement("option");
  let optionValue = document.createTextNode(element);
  options.setAttribute("class", index);
  options.appendChild(optionValue);
  department.appendChild(options);
});

// Dynamically render courses dropdown based on selected department
function dynamicCourse(e) {
  let selected = document.getElementById("department").value;
  let course = document.getElementById("course");
  course.innerHTML = ``;
  if (selected == "Select") {
    let options = document.createElement("option");
    let optionValue = document.createTextNode("Select Department First");
    options.appendChild(optionValue);
    course.appendChild(options);
  } else {
    let arr = eval(`${selected.toLowerCase()}Courses`);
    arr.forEach((element) => {
      let options = document.createElement("option");
      let optionValue = document.createTextNode(element);
      options.appendChild(optionValue);
      course.appendChild(options);
    });
  }
}

// Function to toggle the mode between "Light" and "Dark"
function changeTheme() {
  if (document.documentElement.getAttribute("data-bs-theme") == "dark") {
    document.documentElement.setAttribute("data-bs-theme", "light");
    document.getElementById("changeTheme").innerText = "Light";
  } else {
    document.documentElement.setAttribute("data-bs-theme", "dark");
    document.getElementById("changeTheme").innerText = "Dark";
  }
}

// Function to toggle the role between "Admin" and "User"
function changeRole() {
  if (document.getElementById("changeRole").innerText == "Admin") {
    document.getElementById("changeRole").innerText = "User";
  } else {
    document.getElementById("changeRole").innerText = "Admin";
  }
}

// Check if the submitted email address is uique!
function uniqueEmailCheck(data, email) {
  for (let i = 0; i < data.length; i++) {
    let dataEmail = JSON.parse(data[i]).email;
    if (dataEmail == email) {
      return false;
    }
  }
  return true;
}

// Submitting the form
function formSubmit(e) {
  e.preventDefault();
  const form = document.querySelector("form");
  const d = new FormData(form);
  const data = Object.fromEntries(new FormData(form).entries());
  // Form Validation
  let validRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (!data.email.match(validRegex)) {
    alert("Please enter a valid email address!");
  } else if (data.school == "Select") {
    alert("Please select the school");
  } else if (data.department == "Select") {
    alert("Please select the department");
  } else if (data.course == "Select") {
    alert("Please select the course");
  } else if (
    data.number.length < 10 ||
    Number.isFinite(parseInt(data.number)) == false
  ) {
    alert("Please enter 10 digit mobile number");
  } else {
    let formData = ({
      fullname,
      dob,
      sex,
      email,
      address,
      school,
      department,
      course,
      number,
    } = data);
    form.reset();
    if (localStorage.getItem("editIndex") == null) {
      // Form data for creating new row
      if (localStorage.getItem("data") == null) {
        versionHistory();
        let dataArray = [];
        dataArray.push(JSON.stringify(formData));
        localStorage.setItem("data", JSON.stringify(dataArray));
      } else {
        versionHistory();
        let dataArray = JSON.parse(localStorage["data"]);
        //uniqueEmailCheck(dataArray, formData.email);
        if (uniqueEmailCheck(dataArray, formData.email)) {
          dataArray.push(JSON.stringify(formData));
          localStorage.setItem("data", JSON.stringify(dataArray));
        } else {
          alert("Student with same email already exist.");
        }
      }
    } else {
      // Form data for edit
      versionHistory();
      let data = JSON.parse(localStorage["data"]);
      let editindex = localStorage.getItem("editIndex");
      data[editindex] = JSON.stringify(formData);
      localStorage.setItem("data", JSON.stringify(data));
      document.getElementById("submitBtn").innerText = "Submit";
      document.getElementById(`${editindex}`).style.background = "";
      localStorage.removeItem("editIndex");
      alert("Details edited successfully!");
    }
    createTable();
  }
}

// Create Table whenever called
function createTable(data = JSON.parse(localStorage["data"])) {
  let table = document.getElementById("tablebody");
  let role;
  if ((document.getElementById("changeRole").innerText = "Admin")) {
    role = 1;
  } else {
    role = 0;
  }
  table.innerHTML = ``;
  data.map((e, index) => {
    let row = `<tr id="${index}">
  <td>${JSON.parse(e).fullname}</td>
  <td>${JSON.parse(e).dob}</td>
  <td>${JSON.parse(e).sex}</td>
  <td>${JSON.parse(e).email}</td>
  <td>${JSON.parse(e).address}</td>
  <td>${JSON.parse(e).school}</td>
  <td>${JSON.parse(e).department}</td>
  <td>${JSON.parse(e).course}</td>
  <td>${JSON.parse(e).number}</td>
  ${
    role == 1
      ? `<td><button class="btn btn-primary" onclick="editData(${index})">Edit</button></td>
  <th><input type="checkbox" onChange="bulkDeleteArray(${index}, event)"/></th></tr>`
      : `</tr>`
  }
  `;
    table.innerHTML += row;
  });
}

// Confirm before resetting the form
function resetConfirm() {
  return confirm("Are you sure you want to reset the form?");
}

// Prefill the data when edit button is clicked!
function editData(index) {
  //theme = document.getElementById("theme").value;
  localStorage.setItem("editIndex", index);
  document.getElementById("submitBtn").innerText = "Update";
  document.getElementById(`${index}`).style.background = "aqua";
  //theme == "light" ? "aqua" : "darkslateblue";
  let data = JSON.parse(localStorage["data"]);
  let dataObj = JSON.parse(data[index]);
  document.getElementById("department").value = dataObj.department;
  let selected = document.getElementById("department").value;
  let arr = eval(`${selected.toLowerCase()}Courses`);
  let course = document.getElementById("course");
  course.innerHTML = ``;
  arr.forEach((element) => {
    let options = document.createElement("option");
    let optionValue = document.createTextNode(element);
    options.appendChild(optionValue);
    course.appendChild(options);
  });
  document.getElementById("fullname").value = dataObj.fullname;
  document.getElementById("dob").value = dataObj.dob;
  document.getElementById(`${dataObj.sex}`).checked = true;
  document.getElementById("email").value = dataObj.email;
  document.getElementById("address").value = dataObj.address;
  document.getElementById("school").value = dataObj.school;
  document.getElementById("number").value = dataObj.number;
  document.getElementById("course").value = dataObj.course;
}

// Bulk Delete
let deletingIndex = new Set();
function bulkDeleteArray(index, event) {
  //theme = document.getElementById("theme").value;
  if (event.target.checked) {
    deletingIndex.add(index);
    document.getElementById(`${index}`).style.background = "indianred";
    //theme == "light" ? "indianred" : "firebrick";
  } else {
    deletingIndex.delete(index);
    document.getElementById(`${index}`).style.background = "";
  }
  if (deletingIndex.size > 0) {
    document.getElementById("bulkdelete").disabled = false;
  } else {
    document.getElementById("bulkdelete").disabled = true;
  }
}
function bulkDelete() {
  if (
    window.confirm(
      "ALERT!! You are deleting one or more row(s). Do you still want to delete?"
    )
  ) {
    let data = JSON.parse(localStorage["data"]);
    versionHistory();
    let removingIndex = [...deletingIndex];
    data = data.reduce((acc, curr, index) => {
      if (!removingIndex.includes(index)) {
        acc.push(data[index]);
      }
      return acc;
    }, []);
    localStorage.setItem("data", JSON.stringify(data));
    createTable();
    deletingIndex.clear();
  }
}

// Export Table data to pdf or excel sheet.
function exportData(method) {
  if (method == "pdf") {
    //document.getElementById("form").style.display = "none";
    //document.getElementById("features").style.display = "none";
    window.print();

    document.getElementById("form").style.display = "";
    document.getElementById("features").style.display = "";
  } else if (method == "xlsx") {
    let table = document.getElementById("table");
    const wb = XLSX.utils.table_to_book(table, { sheet: "sheet-1" });
    XLSX.writeFile(wb, "Sheet.xlsx");
  } else if (method == "csv") {
    exportCSV();
  } else if (method == "json") {
    exportJSON();
  }
}

// Importing CSV and rendering it as CSV;
function importData() {
  if (
    window.confirm(
      "This will import the table data to the existing one. Do you still want to continue?"
    )
  ) {
    let reader = new FileReader();
    let picker = document.getElementById("import");
    reader.readAsText(picker.files[0]);
    reader.onloadend = () => {
      let csv = reader.result;
      let rows = csv.split("\n");
      let data = JSON.parse(localStorage.getItem("data"));
      if (data == null) {
        data = [];
      }
      for (let i = 0; i < rows.length; i++) {
        let result = rows[i].split(",");
        if (result.length > 1) {
          let obj = {
            fullname: result[0],
            dob: result[1],
            sex: result[2],
            email: result[3],
            address: result[4],
            school: result[5],
            department: result[6],
            course: result[7],
            number: result[8],
          };
          data.push(JSON.stringify(obj));
        }
      }
      versionHistory();
      createTable(data);
      localStorage.setItem("data", JSON.stringify(data));
    };
  }
}

// Maintains the past version of data according to edit and delete button
function versionHistory() {
  let data = localStorage.getItem("data");
  let data_1 = localStorage.getItem("data_1");
  let data_2 = localStorage.getItem("data_2");
  localStorage.setItem("data_3", data_2);
  localStorage.setItem("data_2", data_1);
  localStorage.setItem("data_1", data);
}

// Render past version of table data
function renderVersion(version) {
  let data = localStorage.getItem("data");
  let data_1 = localStorage.getItem("data_1");
  let data_2 = localStorage.getItem("data_2");
  let data_3 = localStorage.getItem("data_3");
  if (
    version == -1 &&
    window.confirm(
      "Are you sure you want to revert to the previous version of the table?"
    )
  ) {
    var temp = data_1;
    localStorage.setItem("data_3", data_2);
    localStorage.setItem("data_2", data_1);
    localStorage.setItem("data_1", data);
    localStorage.setItem("data", temp);
    createTable();
  } else if (
    version == -2 &&
    window.confirm(
      "Are you sure you want to revert to the second last version of the table?"
    )
  ) {
    var temp = data_2;
    localStorage.setItem("data_3", data_2);
    localStorage.setItem("data_2", data_1);
    localStorage.setItem("data_1", data);
    localStorage.setItem("data", temp);
    createTable();
  } else if (
    version == -3 &&
    window.confirm(
      "Are you sure you want to revert to the third last version of the table?"
    )
  ) {
    var temp = data_3;
    localStorage.setItem("data_3", data_2);
    localStorage.setItem("data_2", data_1);
    localStorage.setItem("data_1", data);
    localStorage.setItem("data", temp);
    createTable();
  }
}

// Applying Searching and filtering on table data
function searching(e, name) {
  let given = e.target.value;
  let data = JSON.parse(localStorage.getItem("data"));
  let result = data.filter((e) => {
    return JSON.parse(e)[name].toLowerCase().includes(given.toLowerCase());
  });
  createTable(result);
}

// Applying Sorting on table data
function sorting(e, name) {
  let method = e.target.value;
  let data = JSON.parse(localStorage.getItem("data"));
  if (method == "asc") {
    function ascsorting(a, b) {
      if (JSON.parse(a)[name] < JSON.parse(b)[name]) {
        return -1;
      } else {
        return 1;
      }
    }
    let result = data.sort(ascsorting);
    createTable(result);
  } else if (method == "des") {
    function dessorting(a, b) {
      if (JSON.parse(a)[name] > JSON.parse(b)[name]) {
        return -1;
      } else {
        return 1;
      }
    }
    let result = data.sort(dessorting);
    createTable(result);
  }
}

// Function to export data as CSV
function exportCSV() {
  let data = JSON.parse(localStorage.getItem("data"));
  let fileContent = "";
  let headers =
    "Full Name;Email;Date of Birth;Mobile Number;Sex;Address;School;Department;Course";
  fileContent += headers + "\n";
  data.map((e) => {
    let result = JSON.parse(e);
    let str = "";
    for (const key in result) {
      str += result[key] + ";";
    }
    fileContent += str + "\n";
  });
  const blob = new Blob([fileContent], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "data.csv";
  a.click();
  window.URL.revokeObjectURL(a.href);
}

// Function to export table data as JSON
function exportJSON() {
  let data = localStorage.getItem("data");
  let blob = new Blob([data], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "data.json";
  a.click();
  window.URL.revokeObjectURL(a.href);
}

// Enable or Disable Searching on Table
function toggleSearching(e) {
  if (e.target.checked) {
    document.getElementById("searching").style.display = "";
  } else {
    document.getElementById("searching").style.display = "none";
  }
}

// Enable or Disable Sorting on Table
function toggleSorting(e) {
  if (e.target.checked) {
    document.getElementById("sorting").style.display = "";
  } else {
    document.getElementById("sorting").style.display = "none";
  }
}

function firstLoad() {
  if (localStorage.getItem("data") == null) {
    let preData =
      '["{\\"fullname\\":\\"Nooruddin Shaikh\\",\\"email\\":\\"hi@noorudd.in\\",\\"dob\\":\\"2000-01-01\\",\\"number\\":\\"9876543210\\",\\"sex\\":\\"male\\",\\"address\\":\\"Mumbai, Maharashtra, India\\",\\"school\\":\\"School 1\\",\\"department\\":\\"Electronics\\",\\"course\\":\\"Digital System Design\\"}"]';
    localStorage.setItem("data", preData);
    localStorage.setItem("data_1", JSON.stringify([]));
    localStorage.setItem("data_2", JSON.stringify([]));
    localStorage.setItem("data_3", JSON.stringify([]));
  }
  createTable();
}

// Load the data if exist when page loads
document.onload = firstLoad();
