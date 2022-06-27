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
        dataType: "json",
        beforeSend: showLoading()
    }).done(function (data) {
        if (data.result) {
            addressBookRecords = data.resultSet;
            sortRecords();
            displayRecords();
            hideLoading();
            return;
        }
        hideLoading();
        toastr.error(data.error, "Failed to get Load Records");
    }).fail(function (xhr) {
        hideLoading();
        toastr.error(xhrErrorMessage(xhr), "Failed to Load Records");
    });

    // Initialize the Country Selector by retriving via the GetCountries action and populating the dropdown and variable
    $.ajax({
        url: "Home/GetCountries",
        type: "GET",
        dataType: "json",
    }).done(function (data) {
        if (data.result) {
            countryList = data.resultSet;
            countryList.forEach((country) => {
                $("#selectCountry").append("<option value='" + country.name + "'><div>" + country.name + "</div></option>'");
            });
            return;
        }
        toastr.error(data.error, "Failed to Load Countries");
    }).fail(function (xhr) {
        toastr.error(xhrErrorMessage(xhr), "Failed to Load Countries");
    });
}

// Displays the address book records, with an optional parameter to pre-select an ID of a record
function displayRecords(preselectId) {
    //Clear address book records from display
    $(".address-book-entries").empty();

    //Append the address book records in display
    addressBookRecords.forEach((element) => {
        $(".address-book-entries").append("<a class='address-book-record font-weight-bold' onclick='selectRecord(this);' data-id='"
            + element.id + "' href='#'><img class='record-photo mr-2' src='Uploads/"
            + element.id + ".png' onerror='this.src = \"Content/Images/blankuser.png\"' style='border-radius: 30px;'/>"
            + element.lastName + ", " + element.firstName + "</a>")
    });

    //Pre-select record is preselectId is given
    if (preselectId != undefined) {
        var preselectRecord = $(".address-book-record[data-id='" + preselectId + "']");
        if ($(preselectRecord).length > 0) selectRecord(preselectRecord);
    }
}

// Adds a new entry with the First and Last name of "New"
function addNewEntry() {
    $.ajax({
        url: "Home/AddEntry",
        type: "POST",
        beforeSend: showLoading()
    }).done(function (data) {
        if (data.result) {
            addressBookRecords.push({ id: data.recordId, firstName: "New", lastName: "New" });
            sortRecords();
            displayRecords();
            editRecord(data.recordId);
            $('#readOnlyDisplay').hide();
            $('#editableDisplay').show();            
            hideLoading();
            return;
        }
        hideLoading();
        toastr.error(data.error, "Failed to Add Entry");
    }).fail(function (xhr) {
        hideLoading();
        toastr.error(xhrErrorMessage(xhr), "Failed to Add Entry");
    });
}

// Selects a record based on the element in the list or a record ID number
function selectRecord(record) {
    var recordID = null;

    $(".address-book-record").removeClass("active");
    $("#editButton").prop('disabled', true);

    // Check if the record is a number or if it's our <a> element that contains the record data, and get the ID accordingly
    if ($(record).is("a")) {
        recordID = $(record).data("id");
    }
    else if (!isNaN(record) && record > 0) {
        recordID = record;
    }
    // Hide all fields, as we're only going to show them if they have data
    $('#displayAddressColumn, #displayContactColumn, #displayPhoneItem, #displayEmailItem, #displayAddress').hide()
    $('#displayAddressColumn ul li').not('li:first').remove()

    // Once we've gotten the record from the addressBookRecords, display the content on the front end and enable the Edit button
    addressBookRecords.forEach((element) => {
        if (element.id == recordID) {
            currentRecord = element;
            $(".address-book-record[data-id='" + currentRecord.id + "']").addClass("active");
            $("#editButton").prop('disabled', false);
        }
    });
    
    var userPhoto = $(".address-book-record[data-id='" + currentRecord.id + "'] img").prop('src');
    $('#displayPhoto').attr("src", userPhoto);

    $('#displayName').text(currentRecord.firstName + " " + currentRecord.lastName);

    // Show all columns/items that have data    
    if (currentRecord.address != null && currentRecord.address != "") { $("#displayAddressColumn, #displayAddress").show(); $('#displayAddress').text(currentRecord.address); }
    if (currentRecord.addressLine2 != null && currentRecord.addressLine2 != "") { $("#displayAddressColumn").show(); $('#displayAddressColumn ul').append("<li><span>" + currentRecord.addressLine2 + "</span></li>"); }
    if (currentRecord.city != null && currentRecord.city != "") { $("#displayAddressColumn").show(); $('#displayAddressColumn ul').append("<li><span id='displayCity'>" + currentRecord.city+ "</span></li>"); }
    if (currentRecord.provinceState != null && currentRecord.provinceState != "") {
        $("#displayAddressColumn").show();
        if (currentRecord.city != null && currentRecord.city != "") {
            $('#displayCity').text(currentRecord.city + ", " + currentRecord.provinceState);
        }
        else {
            $('#displayAddressColumn ul').append("<li><span>" + currentRecord.provinceState + "</span></li>");
        }
    }
    if (currentRecord.postalZip != null && currentRecord.postalZip != "") { $("#displayAddressColumn").show(); $('#displayAddressColumn ul').append("<li><span>" + currentRecord.postalZip + "</span></li>"); }
    if (currentRecord.country != null && currentRecord.country != "") { $("#displayAddressColumn").show(); $('#displayAddressColumn ul').append("<li><span>" + currentRecord.country + "</span></li>"); }

    if (currentRecord.phoneNumber != null && currentRecord.phoneNumber != "") { $('#displayContactColumn, #displayPhoneItem').show(); $('#displayPhone').text(currentRecord.phoneNumber); }
    if (currentRecord.emailAddress != null && currentRecord.emailAddress != "") { $('#displayContactColumn, #displayEmailItem').show(); $('#displayEmail').text(currentRecord.emailAddress);}

    // Display the panel
    $('#editableDisplay').hide();
    $('#readOnlyDisplay').show();

}

// Edits a record when pressing the 'Edit' button or triggered after creating a new entry
function editRecord(recordId) {
    // Set the currentRecord from the addressBookRecords
    addressBookRecords.forEach((element) => {
        if (element.id == recordId) {
            currentRecord = element;
            $(".address-book-record[data-id='" + currentRecord.id + "']").addClass("active");
        }
    });

    //Set current user pic inside edit window
    var userPhoto = $(".address-book-record[data-id='" + currentRecord.id + "'] img").prop('src');
    $('#editPhoto').attr("src", userPhoto);

    //Clear photo input field
    $("#photoUpload").val(null);

    // Populate the editable fields
    $('#inputFirstName').val(currentRecord.firstName);
    $('#inputLastName').val(currentRecord.lastName);
    $('#inputAddress').val(currentRecord.address);
    $('#inputAddressLine2').val(currentRecord.addressLine2);
    $('#inputCity').val(currentRecord.city);
    $('#inputProvinceState').val(currentRecord.provinceState);
    $('#inputPostalZip').val(currentRecord.postalZip);
    $('#selectCountry').val(currentRecord.country);
    $('#inputPhoneNumber').val(currentRecord.phoneNumber);
    $('#inputEmailAddress').val(currentRecord.emailAddress);
;
    // Show the panel and disable the Edit button
    $('#readOnlyDisplay').hide();
    $('#editableDisplay').show();
    $("#editButton").prop('disabled', true);
}

// Saves the current editing entry
function saveEntry() {
    // Validate all entries which contain the "data-required" attribute
    // If validation fails, display an error message and an indicator on the fields
    var validated = true;

    $("[data-required]").each(function () {
        if (!$(this).val()) {
            validated = false
            $(this).css("border-color", "red");           
        }
    });

    if (!validated) {
        toastr.error("First and Last Name are required");
        setTimeout(function () {
            $("[data-required]").removeAttr("style");
        }, 2000);
        return;
    }

    // Update the currentRecord with the data entered in
    currentRecord.firstName = $('#inputFirstName').val();
    currentRecord.lastName = $('#inputLastName').val();
    currentRecord.address = $('#inputAddress').val();
    currentRecord.addressLine2 = $('#inputAddressLine2').val();
    currentRecord.city = $('#inputCity').val();
    currentRecord.provinceState = $('#inputProvinceState').val();
    currentRecord.postalZip = $('#inputPostalZip').val();
    currentRecord.country = $('#selectCountry').val();
    currentRecord.phoneNumber = $('#inputPhoneNumber').val();
    currentRecord.emailAddress = $('#inputEmailAddress').val();

    // Create a $formData object, attach the photo if necessary, and include the currentRecord as part of the payload
    var $formData = new FormData();

    //Attach currentRecord keys and values into the payload
    for (const key in currentRecord) {
        $formData.append(key, currentRecord[key]);
    }

    //Attach photo to payload if given one
    if ($('#photoUpload').prop('files').length > 0) {
        $formData.append("userPhoto", $('#photoUpload')[0].files[0]);
    }

    // Save the record, re-sort and display if successful
    $.ajax({
        url: "Home/SaveEntry",
        type: "POST",
        data: $formData,
        processData: false,
        contentType: false,
        beforeSend: showLoading()
    }).done(function (data) {
        if (data.result) {
            addressBookRecords.forEach((element) => {
                if (element.id == data.recordId) element = currentRecord;
            });
            $('#editableDisplay').hide();
            sortRecords();
            displayRecords(data.recordId);
            hideLoading();
            return;
        }
        hideLoading();
        toastr.error(data.error, "Failed to Save Entry");
    }).fail(function (xhr) {
        hideLoading();
        toastr.error(xhrErrorMessage(xhr), "Failed to Save Entry");
    });

}

// Deletes the current editing entry
function deleteEntry() {
    // Delete via the DeleteEntry action in the controller.
    // On successful deletion, remove the record from the addressBookRecords array and update the display
    $.ajax({
        url: "Home/DeleteEntry",
        type: "POST",
        data: { recordid: currentRecord.id },
        beforeSend: showLoading()
    }).done(function (data) {
        if (data.result) {
            //Remove the record from the addressBookRecords
            addressBookRecords.forEach(function (element, index, array) {
                if (element.id == data.recordId) {
                    array.splice(index, 1);
                }
            });

            //Update the display
            displayRecords();

            $('#editableDisplay,#readOnlyDisplay').hide();

            hideLoading();
            return;
        }
        hideLoading();
        toastr.error(data.error, "Failed to Delete Entry");
    }).fail(function (xhr) {
        hideLoading();
        toastr.error(xhrErrorMessage(xhr), "Failed to Delete Entry");
    });
}