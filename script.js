let schoolNames = ["Select", "School 1", "School 2", "School 3", "School 4"];
let departmentNames = [
  "Select",
  "Electronics",
  "CS",
  "IT",
  "Mechanical",
  "Civil",
  "Automobile",
];
let courseNames = [
  "Select",
  "Subject 1",
  "Subject 2",
  "Subject 3",
  "Subject 4",
  "Subject 5",
  "Subject 6",
  "Subject 7",
];
let electronicsCourses = [
  "Select",
  "Electronics 1",
  "Electronics 2",
  "Electronics 3",
  "Electronics 4",
  "Electronics 5",
  "Electronics 6",
];
let csCourses = ["Select", "CS 1", "CS 2", "CS 3", "CS 4"];
let itCourses = ["Select", "IT 1", "IT 2", "IT 3"];
let mechanicalCourses = ["Select", "Mechanical 1", "Mechanical 2"];
let civilCourses = ["Select", "Civil 1", "Civil 2"];
let automobileCourses = ["Select", "Automobile 1", "Automobile 2"];

let theme = "light";

// Mapping the dropdown content and injecting in html
let school = document.getElementById("school");
schoolNames.forEach((element) => {
  let options = document.createElement("option");
  let optionValue = document.createTextNode(element);
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
  let name = document.getElementById("fullname").value;
  let dob = document.getElementById("dob").value;
  let sex = document.querySelector("input[name='sex']:checked").value;
  let email = document.getElementById("email").value;
  let address = document.getElementById("address").value;
  let school = document.getElementById("school").value;
  let department = document.getElementById("department").value;
  let course = document.getElementById("course").value;
  let number = document.getElementById("number").value;
  let form = document.querySelector("form");

  // Form Validation
  let validRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (!email.match(validRegex)) {
    alert("Please enter a valid email address!");
  } else if (school == "Select") {
    alert("Please select the school");
  } else if (department == "Select") {
    alert("Please select the department");
  } else if (course == "Select") {
    alert("Please select the course");
  } else if (number.length < 10 || Number.isFinite(parseInt(number)) == false) {
    alert("Please enter 10 digit mobile number");
  } else {
    let formData = {
      fullname: name,
      dob: dob,
      sex: sex,
      email: email,
      address: address,
      school: school,
      department: department,
      course: course,
      number: number,
    };
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

function resetConfirm() {
  return confirm("Are you sure you want to reset the form?");
}

// Create Table whenever called
function createTable(data = JSON.parse(localStorage["data"])) {
  let table = document.getElementById("tablebody");
  let role = document.getElementById("role").value;
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
    ? `<td><button onclick="editData(${index})">Edit</button></td>
<th><input type="checkbox" onChange="bulkDeleteArray(${index}, event)"/></th></tr>`
    : `</tr>`
}
`;
    table.innerHTML += row;
  });
  theme = document.getElementById("theme").value;
  const cellsth = document.querySelectorAll("table th");
  cellsth.forEach((cell) => {
    cell.style.border =
      theme == "light" ? "1px solid black" : "1px solid white";
  });
  const cellstd = document.querySelectorAll("table td");
  cellstd.forEach((cell) => {
    cell.style.border =
      theme == "light" ? "1px solid black" : "1px solid white";
  });
}

// Delete all rows
function deleteAll() {
  if (window.confirm("Alert! This will DELETE ALL DATA. Are your sure?")) {
    localStorage.clear();
    window.location.reload();
  }
}

// Prefill the data when edit button is clicked!
function editData(index) {
  theme = document.getElementById("theme").value;
  localStorage.setItem("editIndex", index);
  document.getElementById("submitBtn").innerText = "Update";
  document.getElementById(`${index}`).style.background =
    theme == "light" ? "aqua" : "darkslateblue";
  let data = JSON.parse(localStorage["data"]);
  let dataObj = JSON.parse(data[index]);
  document.getElementById("department").value = dataObj.department;
  let selected = document.getElementById("department").value;
  let arr = eval(`${selected.toLowerCase()}Courses`);
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
  theme = document.getElementById("theme").value;
  if (event.target.checked) {
    deletingIndex.add(index);
    document.getElementById(`${index}`).style.background =
      theme == "light" ? "indianred" : "firebrick";
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
function exportData() {
  let method = document.getElementById("exportData").value;
  if (method == "pdf") {
    document.getElementById("form").style.display = "none";
    document.getElementById("features").style.display = "none";
    window.print();
    document.getElementById("exportData").value = "select";
    document.getElementById("form").style.display = "";
    document.getElementById("features").style.display = "";
  } else if (method == "xlsx") {
    let table = document.getElementById("table");
    const wb = XLSX.utils.table_to_book(table, { sheet: "sheet-1" });
    XLSX.writeFile(wb, "Sheet.xlsx");
    document.getElementById("exportData").value = "select";
  } else if (method == "csv") {
    exportCSV();
    document.getElementById("exportData").value = "select";
  } else if (method == "json") {
    document.getElementById("exportData").value = "select";
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
function renderVersion() {
  let version = document.getElementById("versionHistory").value;
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
  } else {
    document.getElementById("versionHistory").value = "select";
    return;
  }
  document.getElementById("versionHistory").value = "select";
}

//Change theme based on the user selection
function changeTheme() {
  let theme = document.getElementById("theme").value;
  document.body.style.background = theme == "light" ? "#f4f2ee" : "black";
  document.body.style.color = theme == "light" ? "#000000" : "#f4f2ee";
  const cellsth = document.querySelectorAll("table th");
  cellsth.forEach((cell) => {
    cell.style.border =
      theme == "light" ? "1px solid black" : "1px solid white";
  });
  const cellstd = document.querySelectorAll("table td");
  cellstd.forEach((cell) => {
    cell.style.border =
      theme == "light" ? "1px solid black" : "1px solid white";
  });
}

// Render table based on the current role.
function currentRole() {
  createTable();
  let role = document.getElementById("role").value;
  if (role == 0) {
    document.getElementById("editOnTable").style.display = "none";
    document.getElementById("deleteOnTable").style.display = "none";
    document.getElementById("importFeaure").style.display = "none";
    document.getElementById("deleteAll").style.display = "none";
  } else {
    document.getElementById("editOnTable").style.display = "";
    document.getElementById("deleteOnTable").style.display = "";
    document.getElementById("importFeaure").style.display = "";
    document.getElementById("deleteAll").style.display = "";
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

// Load the data if exist when page loads
document.onload = createTable();
