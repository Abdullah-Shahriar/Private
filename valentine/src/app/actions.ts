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
    const now = new Date();
    const entry: VisitorEntry = {
      name,
      timestamp: now.toISOString(),
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString(),
    };

    let visitors: VisitorEntry[] = [];
    
    // Try to read existing file
    try {
      const fileContent = await fs.readFile(DATA_FILE, "utf-8");
      visitors = JSON.parse(fileContent);
    } catch {
      // File doesn't exist yet, start with empty array
      visitors = [];
    }

    // Add new entry
    visitors.push(entry);

    // Save updated data
    await fs.writeFile(DATA_FILE, JSON.stringify(visitors, null, 2));

    return { success: true };
  } catch (error) {
    console.error("Error saving visitor name:", error);
    return { success: false };
  }
}

export async function getVisitorNames(secretCode: string) {
  try {
    // Verify secret code
    if (secretCode !== "0328") {
      return { success: false, data: [], error: "Invalid code" };
    }

    // Try to read file
    try {
      const fileContent = await fs.readFile(DATA_FILE, "utf-8");
      const visitors: VisitorEntry[] = JSON.parse(fileContent);
      return { success: true, data: visitors };
    } catch {
      // File doesn't exist yet
      return { success: true, data: [] };
    }
  } catch (error) {
    console.error("Error reading visitor names:", error);
    return { success: false, data: [], error: "Failed to read data" };
  }
}
