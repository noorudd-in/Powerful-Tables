//let schoolNames = ["Select", "School 1", "School 2", "School 3", "School 4"];
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

let electronicsCourses = ["Select", "Electronics 1", "Electronics 2"];
let csCourses = ["Select", "CS 1", "CS 2"];
let itCourses = ["Select", "IT 1", "IT 2"];
let mechanicalCourses = ["Select", "Mechanical 1", "Mechanical 2"];
let civilCourses = ["Select", "Civil 1", "Civil 2"];
let automobileCourses = ["Select", "Automobile 1", "Automobile 2"];

// Mapping the dropdown content and injecting in html
/*
let school = document.getElementById("school");
schoolNames.forEach((element) => {
  let options = document.createElement("option");
  let optionValue = document.createTextNode(element);
  options.appendChild(optionValue);
  school.appendChild(options);
});
*/
let school = document.getElementById("school");
schoolNames.forEach((element) => {
  //console.log();
  let options = document.createElement("option");
  let optionValue = document.createTextNode(Object.values(element)[0]);
  options.appendChild(optionValue);
  school.appendChild(options);
});

/*
for (const schoolID in schoolNames) {
  let options = document.createElement("option");
  let optionValue = document.createTextNode(schoolNames[schoolID]);
  options.appendChild(optionValue);
  school.appendChild(options);
}
*/

let department = document.getElementById("department");
departmentNames.forEach((element, index) => {
  let options = document.createElement("option");
  let optionValue = document.createTextNode(element);
  options.setAttribute("class", index);
  options.appendChild(optionValue);
  department.appendChild(options);
});
/*
let course = document.getElementById("course");
courseNames.forEach((element) => {
  let options = document.createElement("option");
  let optionValue = document.createTextNode(element);
  options.appendChild(optionValue);
  course.appendChild(options);
});
*/

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
  const form = document.querySelector("form");
  const d = new FormData(form);
  console.log(d.getAll("fullname"));
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
    if (localStorage.getItem("editIndex") == null) {
      // Form data for creating new row
      if (localStorage.getItem("data") == null) {
        let dataArray = [];
        dataArray.push(JSON.stringify(formData));
        localStorage.setItem("data", JSON.stringify(dataArray));
        //form.reset();
      } else {
        let dataArray = JSON.parse(localStorage["data"]);
        if (uniqueEmailCheck(dataArray, formData.email)) {
          dataArray.push(JSON.stringify(formData));
          localStorage.setItem("data", JSON.stringify(dataArray));
          form.reset();
        } else {
          alert("Student with same email already exist.");
        }
      }
    } else {
      // Form data for edit
      let data = JSON.parse(localStorage["data"]);
      let editindex = localStorage.getItem("editIndex");
      data[editindex] = JSON.stringify(formData);
      localStorage.setItem("data", JSON.stringify(data));
      document.getElementById("submitBtn").innerText = "Submit";
      document.getElementById(`${editindex}`).style.background = "";
      localStorage.removeItem("editIndex");
      alert("Details edited successfully!");
      form.reset();
    }
    createTable();
  }
}

// Create Table whenever called
function createTable(data = JSON.parse(localStorage["data"])) {
  let table = document.getElementById("tablebody");
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
<td><button onclick="editData(${index})">Edit</button></td>
<td><button onclick="deleteData(${index})">Delete</button></td>
<th><input type="checkbox" onChange="bulkDeleteArray(${index}, event)"/></th>
</tr>`;
    table.innerHTML += row;
  });
}

// Delete all rows
function deleteAll() {
  if (window.confirm("Alert! This will DELETE ALL DATA. Are your sure?")) {
    localStorage.clear();
    let form = document.querySelector("form");
    form.reset();
    localStorage.removeItem("editIndex");
    window.location.reload();
  }
}

// Delete a single row
function deleteData(index) {
  if (window.confirm("Do you really want to delete this detail?")) {
    let data = JSON.parse(localStorage["data"]);
    data = data.filter((e, i) => {
      return i != index;
    });
    localStorage.setItem("data", JSON.stringify(data));
    let form = document.querySelector("form");
    form.reset();
    localStorage.removeItem("editIndex");
    document.getElementById("submitBtn").innerText = "Submit";
    createTable();
  }
}

// Prefill the data when edit button is clicked!
function editData(index) {
  localStorage.setItem("editIndex", index);
  document.getElementById("submitBtn").innerText = "Update";
  document.getElementById(`${index}`).style.background = "aqua";
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
  if (event.currentTarget.checked) {
    //alert("checked");
    deletingIndex.add(index);
    document.getElementById(`${index}`).style.background = "indianred";
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
    let removingIndex = [...deletingIndex];
    data = data.reduce((acc, curr, index) => {
      if (!removingIndex.includes(index)) {
        acc.push(data[index]);
      }
      return acc;
    }, []);
    localStorage.setItem("data", JSON.stringify(data));
    let form = document.querySelector("form");
    form.reset();
    localStorage.removeItem("editIndex");
    createTable();
    deletingIndex.clear();
  }
}

// Print Functionality
function printData() {
  window.print();
}

// Searching through name
function searching(e) {
  let result = e.target.value;
  let data = JSON.parse(localStorage.getItem("data"));
  let filteredData = data.filter((name) => {
    return JSON.parse(name)
      ["fullname"].toLowerCase()
      .includes(result.toLowerCase());
  });
  createTable(filteredData);
}

// Load the data if exist when page loads
document.onload = createTable();
