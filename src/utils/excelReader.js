const xlsx = require("xlsx");
const path = require("path");

/**
 * Reads test data from an Excel sheet based on the test name
 * @param {string} excelName - Name of the Excel file (without extension)
 * @param {string} sheetName - Sheet name to read data from
 * @param {string} testName - Test case name to match
 * @returns {Object} - Test data for the matching test case
 */
function readTestDataFromExcel(excelName, sheetName, testName) {
  try {
    const filePath = path.resolve(__dirname, `../testData/${excelName}.xlsx`);
    console.log(filePath);
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[sheetName];

    if (!sheet) {
      throw new Error(`Sheet "${sheetName}" not found in "${excelName}.xlsx"`);
    }

    const rows = xlsx.utils.sheet_to_json(sheet, { defval: "" }); // Convert sheet to JSON
    const testData = rows.find((row) => row.testName && row.testName.trim() === testName.trim());
    console.log(testData);

    if (!testData) {
      throw new Error(`Test data for testName "${testName}" not found`);
    }

    return testData; // Return the matched test data
  } catch (error) {
    console.error("Error reading test data from Excel:", error.message);
    throw error;
  }
}

module.exports = { readTestDataFromExcel };