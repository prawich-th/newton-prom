import { readFileSync } from "fs";
import { join } from "path";
import prisma from "../lib/prisma";

interface CSVRow {
  NICKNAME: string;
  FULLNAME: string;
  YEAR: string;
  TRACK: string;
  ROOM: string;
  "TICKET TYPE": string;
  EMAIL: string;
  "IN SYSTEM": string;
  "TICKET ID": string;
}

function parseCSV(csvContent: string): CSVRow[] {
  const lines = csvContent.split("\n").filter((line) => line.trim() !== "");
  const headers = lines[0].split(",").map((h) => h.trim());
  const records: CSVRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim());
    const record: any = {};

    headers.forEach((header, index) => {
      record[header] = values[index] || "";
    });

    records.push(record as CSVRow);
  }

  return records;
}

async function importCSVData() {
  try {
    console.log("Starting CSV import...");

    // Read the CSV file
    const csvPath = join(process.cwd(), "src/data/TICKET ID - reimport.csv");
    const csvContent = readFileSync(csvPath, "utf-8");

    // Parse CSV content
    const records = parseCSV(csvContent);

    console.log(`Found ${records.length} records in CSV`);

    // Filter only records that are in system and have ticket IDs
    const validRecords = records.filter(
      (record) =>
        record["IN SYSTEM"] === "TRUE" &&
        record["TICKET ID"] &&
        record["TICKET ID"].trim() !== ""
    );

    console.log(`${validRecords.length} records are valid for import`);

    let importedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const record of validRecords) {
      try {
        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
          where: {
            OR: [{ email: record.EMAIL }, { id: record["TICKET ID"] }],
          },
        });

        if (existingUser) {
          console.log(
            `Skipping existing user: ${record.NICKNAME} ${record.FULLNAME} (${record.EMAIL})`
          );
          skippedCount++;
          continue;
        }

        // Clean and validate data
        const year = parseInt(record.YEAR);
        if (isNaN(year)) {
          console.log(
            `Invalid year for ${record.NICKNAME} ${record.FULLNAME}: ${record.YEAR}`
          );
          errorCount++;
          continue;
        }

        // Normalize track names
        let normalizedTrack = record.TRACK;
        if (record.TRACK.includes("BIZ")) {
          normalizedTrack = "Business";
        } else if (record.TRACK === "No Track") {
          normalizedTrack = "Other";
        }

        // Normalize ticket type
        let normalizedTicketType = record["TICKET TYPE"];
        if (normalizedTicketType === "STAFF") {
          normalizedTicketType = "Staff";
        } else if (normalizedTicketType === "Regular") {
          normalizedTicketType = "Normal";
        }

        // Create user
        const user = await prisma.user.create({
          data: {
            id: record["TICKET ID"],
            name: record.NICKNAME + " " + record.FULLNAME,
            email: record.EMAIL,
            year: year,
            track: normalizedTrack,
            room: record.ROOM,
            school: "Newton",
            t_type: normalizedTicketType,
            t_purchasedBy: record.FULLNAME,
            t_disabled: false,
            t_checkedIn: false,
            t_checkedInAt: null,
            last_agent: "Automated Registration Agent",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });

        console.log(`Imported: ${user.name} (${user.id})`);
        importedCount++;
      } catch (error) {
        console.error(
          `Error importing ${record.NICKNAME} ${record.FULLNAME}:`,
          error
        );
        errorCount++;
      }
    }

    console.log("\n=== Import Summary ===");
    console.log(`Total records processed: ${records.length}`);
    console.log(`Valid records: ${validRecords.length}`);
    console.log(`Successfully imported: ${importedCount}`);
    console.log(`Skipped (already exists): ${skippedCount}`);
    console.log(`Errors: ${errorCount}`);
  } catch (error) {
    console.error("Import failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the import if this script is executed directly
if (require.main === module) {
  importCSVData();
}

export { importCSVData };
