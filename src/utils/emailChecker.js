const imap = require("imap-simple");
const { simpleParser } = require("mailparser");
require("dotenv").config();

const config = {
  imap: {
    user: process.env.EMAIL_USER,
    password: process.env.APP_PASSWORD,
    host: "imap.gmail.com",
    port: 993,
    tls: true,
    tlsOptions: {
      rejectUnauthorized: false, // Bypass self-signed certificate issue
    },
  },
};

async function getEmails(searchCriteria, maxEmails = 10) {
  const connection = await imap.connect({ imap: config.imap });
  await connection.openBox("INBOX");

  const results = await connection.search(searchCriteria, { bodies: ["HEADER", "TEXT"], markSeen: false });

  const emails = await Promise.all(
    results.slice(0, maxEmails).map(async (email) => {
      try {
        const parsed = await simpleParser(email.parts[0].body);
        console.log("Parsed Email:", parsed);

        return {
          from: parsed.from && parsed.from.value 
            ? parsed.from.value.map((v) => v.address).join(", ") 
            : "Unknown Sender",
          to: parsed.to && parsed.to.value 
            ? parsed.to.value.map((v) => v.address).join(", ") 
            : "Unknown Recipient",
          subject: parsed.subject || "No Subject",
          body: parsed.text || "No Body",
          date: parsed.date || "Unknown Date",
        };
      } catch (error) {
        console.error("Error parsing email:", error.message);
        return { from: "Error", to: "Error", subject: "Error", body: "Error", date: "Error" };
      }
    })
  );

  connection.end();
  return emails;
}

module.exports = { getEmails };
