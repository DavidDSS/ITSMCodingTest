using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Mvc;
using ITSMCodingTest.Helpers;
using ITSMCodingTest.Models;
using Newtonsoft.Json;

namespace ITSMCodingTest.Controllers
{
    public class HomeController : BaseController
    {
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// Retrieves a list of countries from the countries.json helper.
        /// Original API from https://restcountries.eu/rest/v2/all
        /// Used for the Country selector
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public JsonResult GetCountries()
        {
            try
            {
                // Read the countries.json file within the Helpers folder and map to a list of CountryView, sorted alphabetically
                List<CountryView> countryList= new List<CountryView>();

                using (StreamReader reader = new StreamReader(Server.MapPath(@"~\Helpers\countries.json")))
                {
                    string countriesJson = reader.ReadToEnd();
                    countryList = JsonConvert.DeserializeObject<List<CountryView>>(countriesJson);

                    //Sort by Alphabetical Order
                    countryList.Sort((a, b) => string.Compare(a.Name, b.Name));
                }
                return SuccessResult(countryList); ;
            }
            catch (Exception e)
            {
                return FailedResult(e);
            }
        }

        /// <summary>
        /// Adds a new entry into the AddressRecords table using the AddressBookEntities database framework. Once the record is added, the generated Id of the record is returned back.
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public async Task<JsonResult> AddEntry()
        {
            try
            {
                // Add a new AddressRecord entry to the Entities
                AddressRecord newRecord;
                using (var db = new AddressBookEntities())
                {
                    newRecord = new AddressRecord { FirstName = "New", LastName = "New" };
                    db.AddressRecords.Add(newRecord);
                    db.SaveChanges();
                }
                return SuccessResult(newRecord.Id);
            }
            catch (Exception e)
            {
                return FailedResult(e);
            }
        }

        /// <summary>
        /// Retrieves all of the AddressRecord records, sorted alphabetically by last name and then by first name.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<JsonResult> GetAllEntries()
        {
            try
            {
                // Retrieve all of the records
                using (var db = new AddressBookEntities())
                {
                    //Sort by Last Name and then by First Name
                    var records = db.AddressRecords.ToList().OrderBy(person => person.LastName).ThenBy(person => person.FirstName);
                    return SuccessResult(records);
                }
            }
            catch (Exception e)
            {
                return FailedResult(e);
            }
        }

        /// <summary>
        /// Retrieves the record data provided in the object's Id property and then updates all properties in the record that are editable.
        /// Remember, First and Last Name are required, and a photo may be provided. Check that the photo is a jpeg, gif, png, or bmp before allowing it to upload,
        /// and ensure the image is less than 1MB to allow upload. If all checks pass, save the image as a PNG to the Uploads folder.
        /// </summary>
        /// <param name="recordData"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<JsonResult> SaveEntry(AddressRecord recordData)
        {
            try
            {
                using (var db = new AddressBookEntities())
                {
                    // Try to retrieve the record, and fail if the record doesn't exist
                    var record = db.AddressRecords.Where(entry => entry.Id == recordData.Id).Single();

                    // Validate that the required fields have values
                    if(String.IsNullOrEmpty(recordData.FirstName) || String.IsNullOrEmpty(recordData.LastName))
                    {
                        return FailedResult("First and Last Name Required");
                    }

                    var allowedExtensions = new[] {".jpg", ".jpeg", ".png", ".gif", ".bmp"};
                    for (var i = 0; i < Request.Files.Count; i++)
                    {
                        // Get the file if it exists, and if not, just carry on
                        var photo = Request.Files[0];

                        // Check that the file has a valid name
                        if (String.IsNullOrEmpty(photo.FileName) ||
                        (photo.FileName.IndexOfAny(Path.GetInvalidFileNameChars()) >= 0)) { 
                            return FailedResult("Invalid Image Name");
                        }

                        // Validate the file size is less than 1MB
                        if (photo.ContentLength >= 1000000) return FailedResult("Invalid Image Size. Max Size Allowed is 1MB");

                        // Check that the photo is the correct type from the allowedExtensions
                        bool validExtension = false;
                        if (photo.ContentType.Contains("image"))
                        {
                            validExtension = allowedExtensions.Any(item => photo.FileName.EndsWith(item, StringComparison.OrdinalIgnoreCase));
                        }
                        if (!validExtension) return FailedResult("Invalid Image Type or Extension");

                        // All is well, save the image to memory, and then drop it in the Uploads folder with the Id as the name in PNG format
                        var imageExtension = Path.GetExtension(photo.FileName);

                        string savedFileName = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Uploads");
                        savedFileName = Path.Combine(savedFileName, Path.GetFileName(recordData.Id.ToString()+".png"));

                        photo.SaveAs(savedFileName);
                    }

                    // Update all record properties and save changes
                    record.FirstName = recordData.FirstName;
                    record.LastName = recordData.LastName;
                    record.Address = recordData.Address;
                    record.AddressLine2 = recordData.AddressLine2;
                    record.City = recordData.City;
                    record.ProvinceState = recordData.ProvinceState;
                    record.PostalZip = recordData.PostalZip;
                    record.Country = recordData.Country;
                    record.PhoneNumber = recordData.PhoneNumber;
                    record.EmailAddress = recordData.EmailAddress;
                    db.SaveChanges();

                    return SuccessResult(recordData.Id);
                }
            }
            catch (Exception e)
            {
                return FailedResult(e);
            }
        }

        /// <summary>
        /// Deletes an entry from the Address Book
        /// </summary>
        /// <param name="recordId"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<JsonResult> DeleteEntry(int recordId)
        {
            try
            {
                // Get the record to delete, and fail if the record does not exist
                using (var db = new AddressBookEntities())
                {
                    var record = db.AddressRecords.Where(entry => entry.Id == recordId).Single();
                    db.AddressRecords.Remove(record);
                    db.SaveChanges();
                }
                return SuccessResult(recordId);
            }
            catch (Exception e)
            {
                return FailedResult(e);
            }
        }
    }
}