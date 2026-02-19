// Get elements
const companyInput = document.getElementById("companyInput");
const positionInput = document.getElementById("positionInput");
const statusInput = document.getElementById("statusInput");
const notesInput = document.getElementById("notesInput");
const addBtn = document.getElementById("addBtn");
const listContainer = document.getElementById("list-container");
const form = document.getElementById("applicationForm");
const filterButtons = document.querySelectorAll('input[name="filter"]')

// Dialog Box elements
const editDialog = document.getElementById("editDialog");
const editForm = document.getElementById("editForm");
const editCompany = document.getElementById("editCompany");
const editPosition = document.getElementById("editPosition");
const editStatus = document.getElementById("editStatus");
const editNotes = document.getElementById("editNotes");
const cancelEdit = document.getElementById("cancelEdit");

let applications = [];
let currentFilter = "all";
let editingId = null;

loadFromLocalStorage();

// Show "applications list" function
function renderApplications() {

    listContainer.innerHTML = ""; // clear list-container section

    let filteredApplications; // to overwrite the filter array variable instead of the array holding all the applications 

    if (currentFilter === "all") {
        filteredApplications =  applications;
    } else {
        filteredApplications = applications.filter(function (app) {
            return app.status === currentFilter;
        })
    }

    filteredApplications.forEach(function(app) {

        const card = document.createElement("section");
        card.classList.add("app-card");

        card.innerHTML = `
            <div class="app-top">
                <h4 class="company">${app.company}</h4>
                <p class="position">${app.position}</p>
            </div>

            <div class="app-middle">
                <span class="status-badge ${app.status}">${app.status}</span>
                <span class="date">Applied on: ${app.date}</span>
                
            </div>

            ${app.notes ?`<div class="app-notes">${app.notes}</div>` : ""}
            
            <div class="app-actions">
                <button class="button edit-btn" data-id=${app.id}>Edit</button>
                <button class="button delete-btn" data-id=${app.id}>Delete</button>
            </div>
        `;

        listContainer.appendChild(card);
    });
}

// Event listener for "Add Application" button
addBtn.addEventListener("click", function (e) {
    e.preventDefault();

    if (!companyInput.value || !positionInput.value || !statusInput.value) {
        alert("Please fill all fields");
        return;
    }

    const application = {
        id: Date.now(), //unique identifier
        company: companyInput.value.trim(),
        position: positionInput.value.trim(),
        status: statusInput.value,
        notes: notesInput.value.trim(),
        date: new Date().toLocaleDateString()
    };

    console.log(application) //for testing
    applications.push(application) //pushing the application to the applications array
    saveToLocalStorage(); //saving applications[] to Local
    renderApplications(); //calling the render function to show the applications in the "applications list"

    // clear form
    form.reset();
});

// Event listener for "Edit" "Delete" buttons
listContainer.addEventListener("click", function(e) {  //listener on listContainer and not delete-btn because delete-btn does not exist on page load
    if (e.target.classList.contains("delete-btn")) {

        const id = Number(e.target.getAttribute("data-id"))
        
        applications = applications.filter(function (app) { //overwrite the applications array with the met conditions (filtering and overwriting = deleting from the array and overwriting)
            return app.id !== id;
        });

        saveToLocalStorage(); //update LocalStorage
        renderApplications();
    }

    if (e.target.classList.contains("edit-btn")) {

        const id = Number(e.target.getAttribute("data-id"));
        const appToEdit = applications.find(app => app.id === id);

        editingId = id;

        editCompany.value = appToEdit.company || "";
        editPosition.value = appToEdit.position || "";
        editStatus.value = appToEdit.status || "applied";
        editNotes.value = appToEdit.notes || "";

        editDialog.showModal();
    }
});

// Event listener to edit local storage values
editForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const appIndex = applications.findIndex(app => app.id === editingId);

    applications[appIndex].company = editCompany.value.trim();
    applications[appIndex].position = editPosition.value.trim();
    applications[appIndex].status = editStatus.value;
    applications[appIndex].notes = editNotes.value.trim();

    saveToLocalStorage();
    renderApplications();

    editDialog.close();
});

// Event listener for cancel button in dialog box
cancelEdit.addEventListener("click", function() {
    editDialog.close();
})

// Show Filtered/non-Filtered "applications list"
filterButtons.forEach(function (radio) {
    radio.addEventListener("change", function() {
        currentFilter = this.value;
        renderApplications()
    })
})

// Saving the applications to LocalStorage
function saveToLocalStorage() {
    localStorage.setItem("applications", JSON.stringify(applications));
}

// Loading the applications from LocalStorage
function loadFromLocalStorage() {
    
    const storedData = localStorage.getItem("applications");

    if (storedData) {
        applications = JSON.parse(storedData);
        renderApplications();
    }
}
