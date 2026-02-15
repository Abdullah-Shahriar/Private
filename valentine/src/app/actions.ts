"use server";

import { promises as fs } from "fs";
import path from "path";

interface VisitorEntry {
  name: string;
  timestamp: string;
  date: string;
  time: string;
}

const DATA_FILE = path.join(process.cwd(), "valentine-visitors.json");

export async function saveVisitorName(name: string) {
  try {
    console.log("\n🌹 ===== SAVE VISITOR NAME CALLED =====");
    console.log("📝 Name to save:", name);
    console.log("📁 Data file path:", DATA_FILE);
    
    const now = new Date();
    const entry: VisitorEntry = {
      name,
      timestamp: now.toISOString(),
      date: now.toLocaleDateString("en-US"),
      time: now.toLocaleTimeString("en-US"),
    };
    console.log("📋 Entry to save:", JSON.stringify(entry, null, 2));

    // Get existing visitors from file
    let visitors: VisitorEntry[] = [];
    try {
      const fileContent = await fs.readFile(DATA_FILE, "utf-8");
      visitors = JSON.parse(fileContent);
      console.log("✅ Found existing file with", visitors.length, "visitors");
    } catch (readError) {
      console.log("ℹ️  File doesn't exist yet, creating new one");
      visitors = [];
    }

    // Add new entry
    visitors.push(entry);
    console.log("📊 Total visitors after adding:", visitors.length);

    // Save to file
    console.log("💾 Writing data to file...");
    await fs.writeFile(DATA_FILE, JSON.stringify(visitors, null, 2), "utf-8");
    console.log("✅ Data saved successfully to file!");
    console.log("🌹 ===== SAVE COMPLETED =====\n");

    return { success: true };
  } catch (error) {
    console.error("\n❌ ===== ERROR SAVING VISITOR NAME =====");
    console.error("Error:", error);
    console.error("Stack:", error instanceof Error ? error.stack : "No stack trace");
    console.error("❌ ===== ERROR END =====\n");
    return { success: false, error: String(error) };
  }
}

export async function getVisitorNames(secretCode: string) {
  try {
    console.log("\n🔐 ===== GET VISITOR NAMES CALLED =====");
    console.log("🔑 Secret code provided:", secretCode);
    
    // Verify secret code
    if (secretCode !== "0328") {
      console.log("❌ Invalid secret code!");
      console.log("🔐 ===== GET VISITOR NAMES END (INVALID CODE) =====\n");
      return { success: false, data: [], error: "Invalid code" };
    }
    
    console.log("✅ Secret code verified!");
    console.log("📁 Reading from file:", DATA_FILE);

    // Try to read from file
    try {
      const fileContent = await fs.readFile(DATA_FILE, "utf-8");
      const visitors: VisitorEntry[] = JSON.parse(fileContent);
      console.log("✅ File read successfully!");
      console.log("📊 Total visitors found:", visitors.length);
      console.log("👥 Visitor data:", JSON.stringify(visitors, null, 2));
      console.log("🔐 ===== GET VISITOR NAMES END (SUCCESS) =====\n");
      return { success: true, data: visitors };
    } catch (readError) {
      console.log("ℹ️  File doesn't exist yet or couldn't be read");
      console.log("Error:", readError);
      console.log("🔐 ===== GET VISITOR NAMES END (NO FILE) =====\n");
      return { success: true, data: [] };
    }
  } catch (error) {
    console.error("\n❌ ===== ERROR GETTING VISITOR NAMES =====");
    console.error("Error:", error);
    console.error("❌ ===== ERROR END =====\n");
    return { success: false, data: [], error: "Failed to read data" };
  }
}
