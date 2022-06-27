// Initialize these variables which will be used globally throughout the application
var addressBookRecords = [];
var countryList = [];
var currentRecord = null;


// Generic Functions

$(function() {
    $('[data-toggle="tooltip"]').tooltip();
});

function showLoading() {
    $(".loading-overlay-panel").show();
}

function hideLoading() {
    $(".loading-overlay-panel").hide();
}

function xhrErrorMessage(jqXhr) {
    if (jqXhr.responseText !== undefined) {
        var errMessage = $(jqXhr.responseText)[1].innerText;
        if (errMessage !== null && errMessage !== undefined) {
            return errMessage;
        }
    }
    return "An Internal Server Error Occurred.";
}

function sortRecords() {
    addressBookRecords.sort(function(a, b) {
        var aLastChar = a.lastName.charAt(0);
        var bLastChar = b.lastName.charAt(0);
        if (aLastChar > bLastChar) {
            return 1;
        } else if (aLastChar < bLastChar) {
            return -1;
        } else {
            var aFirstChar = a.firstName.charAt(0);
            var bFirstChar = b.firstName.charAt(0);
            if (aFirstChar > bFirstChar) {
                return 1;
            } else if (aFirstChar < bFirstChar) {
                return -1;
            } else {
                return 0;
            }
        }
    });
}

// Interactive Functions

// Initializes the Address Book by loading the records and country dropdown.
function initAddressBook() {
    // Load all of the Entries and display them
    // This ajax call is provided to you as a base for how your other calls need to be structured
    $.ajax({
        url: "Home/GetAllEntries",
        type: "GET",
        dataType: "json"
    }).done(function (data) {
        if (data.result) {
            addressBookRecords = data.resultSet;
            sortRecords();
            displayRecords();
            return;
        }
        toastr.error(data.error, "Failed to get Load Records");
    }).fail(function(xhr) {
        toastr.error(xhrErrorMessage(xhr), "Failed to Load Records");
    });

    // Initialize the Country Selector by retriving via the GetCountries action and populating the dropdown and variable
    // << YOUR CODE HERE >>
}

// Displays the address book records, with an optional parameter to pre-select an ID of a record
function displayRecords(preselectId) {
    // << YOUR CODE HERE >>
}

// Adds a new entry with the First and Last name of "New"
function addNewEntry() {
    // << YOUR CODE HERE >>
}

// Selects a record based on the element in the list or a record ID number
function selectRecord(record) {
    // Check if the record is a number or if it's our <a> element that contains the record data, and get the ID accordingly
    // << YOUR CODE HERE >>

    // Hide all fields, as we're only going to show them if they have data
    // << YOUR CODE HERE >>

    // Once we've gotten the record from the addressBookRecords, display the content on the front end and enable the Edit button
    // << YOUR CODE HERE >>

    // Show all columns/items that have data
    // << YOUR CODE HERE >>

    // Display the panel
    // << YOUR CODE HERE >>
}

// Edits a record when pressing the 'Edit' button or triggered after creating a new entry
function editRecord(recordId) {
    // Set the currentRecord from the addressBookRecords
    // << YOUR CODE HERE >>

    // Populate the editable fields
    // << YOUR CODE HERE >>

    // Show the panel and disable the Edit button
    // << YOUR CODE HERE >>
}

// Saves the current editing entry
function saveEntry() {
    // Validate all entries which contain the "data-required" attribute
    // If validation fails, display an error message and an indicator on the fields
    // << YOUR CODE HERE >>

    // Update the currentRecord with the data entered in
    // << YOUR CODE HERE >>

    // Create a $formData object, attach the photo if necessary, and include the currentRecord as part of the payload
    // << YOUR CODE HERE >>

    // Save the record, re-sort and display if successful
    // << YOUR CODE HERE >>
}

// Deletes the current editing entry
function deleteEntry() {
    // Delete via the DeleteEntry action in the controller.
    // On successful deletion, remove the record from the addressBookRecords array and update the display
    // << YOUR CODE HERE >>
}