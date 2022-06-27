using System;
using System.Threading.Tasks;
using System.Web.Mvc;
using ITSMCodingTest.Helpers;
using ITSMCodingTest.Models;

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
                // << YOUR CODE HERE >>
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
                // << YOUR CODE HERE >>
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
                // << YOUR CODE HERE >>
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
                    // << YOUR CODE HERE >>

                    // Validate that the required fields have values
                    // << YOUR CODE HERE >>

                    var allowedExtensions = new[] {".jpg", ".jpeg", ".png", ".gif", ".bmp"};
                    for (var i = 0; i < Request.Files.Count; i++)
                    {
                        // Get the file if it exists, and if not, just carry on
                        // << YOUR CODE HERE >>

                        // Check that the file has a valid name
                        // << YOUR CODE HERE >>

                        // Validate the file size is less than 1MB
                        // << YOUR CODE HERE >>

                        // Check that the photo is the correct type from the allowedExtensions
                        // << YOUR CODE HERE >>

                        // All is well, save the image to memory, and then drop it in the Uploads folder with the Id as the name in PNG format
                        // << YOUR CODE HERE >>
                    }

                    // Update all record properties and save changes
                    // << YOUR CODE HERE >>
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
                // << YOUR CODE HERE >>
            }
            catch (Exception e)
            {
                return FailedResult(e);
            }
        }
    }
}