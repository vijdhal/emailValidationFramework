const { sendEmail } = require("../utils/emailSender");
const { getEmails } = require("../utils/emailChecker");
const { readTestDataFromExcel } = require("../utils/excelReader");
require("dotenv").config();

test("Send email and validate response", async () => {
  const excelName = "testData";
  const sheetName = "email";
  const testName = "EmailTestCase1";

  // Read test data from Excel
  const testData = readTestDataFromExcel(excelName, sheetName, testName);

  // Send an email
  const emailDetails = {
    from: testData.FromEmail,
    to: testData.ToEmail,
    subject: testData.Subject,
    text: testData.Body,
    html: `<b>${testData.Body}</b>`,
  };
  console.log(emailDetails);

  const messageId = await sendEmail(emailDetails);
  console.log("Email sent with ID:", messageId);

  // Wait and check for response email
  const searchCriteria = ["UNSEEN", ["HEADER", "SUBJECT", testData.ResponseSubject]];
  const emails = await getEmails(searchCriteria, 1);

  expect(emails.length).toBeGreaterThan(0); // Ensure at least one response email
  const response = emails[0];

  // Validate response details
 // expect(response.from).toContain(testData.ExpectedFrom);
 // expect(response.subject).toBe(testData.ResponseSubject);
  expect(response.body).toContain(testData.ResponseBody);
}, 30000);