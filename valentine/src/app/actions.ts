"use server";

import { promises as fs } from "fs";
import path from "path";
import { Redis } from "@upstash/redis";

interface VisitorEntry {
  name: string;
  timestamp: string;
  date: string;
  time: string;
}

const DATA_FILE = path.join(process.cwd(), "valentine-visitors.json");
const REDIS_KEY = "valentine-visitors";

// Initialize Redis only if environment variables are available (production)
const redis = process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
  ? new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    })
  : null;

const isProduction = !!redis;

// Migration function: Copy local file data to Redis
async function migrateFileDataToRedis() {
  if (!redis) return; // Only migrate if Redis is available
  
  try {
    console.log("\n📦 ===== CHECKING FOR DATA MIGRATION =====");
    
    // Check if Redis already has data
    const existingRedisData = await redis.get<VisitorEntry[]>(REDIS_KEY);
    if (existingRedisData && existingRedisData.length > 0) {
      console.log("✅ Redis already has", existingRedisData.length, "visitors. No migration needed.");
      return;
    }
    
    // Try to read from local file
    try {
      const fileContent = await fs.readFile(DATA_FILE, "utf-8");
      const fileVisitors: VisitorEntry[] = JSON.parse(fileContent);
      
      if (fileVisitors.length > 0) {
        console.log("📤 Migrating", fileVisitors.length, "visitors from file to Redis...");
        await redis.set(REDIS_KEY, fileVisitors);
        console.log("✅ Migration successful! All file data now in Redis.");
      } else {
        console.log("ℹ️  No file data to migrate.");
      }
    } catch (fileError) {
      console.log("ℹ️  No local file found. Starting fresh with Redis.");
    }
    
    console.log("📦 ===== MIGRATION CHECK COMPLETE =====\n");
  } catch (error) {
    console.error("❌ Migration error:", error);
  }
}

export async function saveVisitorName(name: string) {
  try {
    console.log("\n🌹 ===== SAVE VISITOR NAME CALLED =====");
    console.log("📝 Name to save:", name);
    console.log("🌍 Environment:", isProduction ? "PRODUCTION (Redis)" : "LOCAL (File)");
    
    const now = new Date();
    const entry: VisitorEntry = {
      name,
      timestamp: now.toISOString(),
      date: now.toLocaleDateString("en-US"),
      time: now.toLocaleTimeString("en-US"),
    };
    console.log("📋 Entry to save:", JSON.stringify(entry, null, 2));

    let visitors: VisitorEntry[] = [];

    if (isProduction && redis) {
      // PRODUCTION: Use Redis
      console.log("📁 Using Redis storage");
      try {
        const existingData = await redis.get<VisitorEntry[]>(REDIS_KEY);
        if (existingData && Array.isArray(existingData)) {
          visitors = existingData;
          console.log("✅ Found existing Redis data with", visitors.length, "visitors");
        }
      } catch (error) {
        console.log("ℹ️  No existing Redis data, starting fresh");
      }

      visitors.push(entry);
      console.log("📊 Total visitors after adding:", visitors.length);
      
      await redis.set(REDIS_KEY, visitors);
      console.log("✅ Data saved successfully to Redis!");
    } else {
      // LOCAL: Use File
      console.log("📁 Using file storage:", DATA_FILE);
      try {
        const fileContent = await fs.readFile(DATA_FILE, "utf-8");
        visitors = JSON.parse(fileContent);
        console.log("✅ Found existing file with", visitors.length, "visitors");
      } catch (readError) {
        console.log("ℹ️  File doesn't exist yet, creating new one");
      }

      visitors.push(entry);
      console.log("📊 Total visitors after adding:", visitors.length);
      
      await fs.writeFile(DATA_FILE, JSON.stringify(visitors, null, 2), "utf-8");
      console.log("✅ Data saved successfully to file!");
    }

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
    console.log("🌍 Environment:", isProduction ? "PRODUCTION (Redis)" : "LOCAL (File)");
    
    // Verify secret code
    if (secretCode !== "0328") {
      console.log("❌ Invalid secret code!");
      console.log("🔐 ===== GET VISITOR NAMES END (INVALID CODE) =====\n");
      return { success: false, data: [], error: "Invalid code" };
    }
    
    console.log("✅ Secret code verified!");

    // Migrate file data to Redis if needed
    await migrateFileDataToRedis();

    let visitors: VisitorEntry[] = [];

    if (isProduction && redis) {
      // PRODUCTION: Use Redis
      console.log("📁 Reading from Redis...");
      try {
        const data = await redis.get<VisitorEntry[]>(REDIS_KEY);
        if (data && Array.isArray(data)) {
          visitors = data;
          console.log("✅ Redis data read successfully!");
          console.log("📊 Total visitors found:", visitors.length);
        } else {
          console.log("ℹ️  No data in Redis yet");
        }
      } catch (error) {
        console.log("ℹ️  Error reading Redis, returning empty");
      }
    } else {
      // LOCAL: Use File
      console.log("📁 Reading from file:", DATA_FILE);
      try {
        const fileContent = await fs.readFile(DATA_FILE, "utf-8");
        visitors = JSON.parse(fileContent);
        console.log("✅ File read successfully!");
        console.log("📊 Total visitors found:", visitors.length);
      } catch (readError) {
        console.log("ℹ️  File doesn't exist yet or couldn't be read");
      }
    }

    console.log("👥 Visitor data:", JSON.stringify(visitors, null, 2));
    console.log("🔐 ===== GET VISITOR NAMES END (SUCCESS) =====\n");
    return { success: true, data: visitors };
  } catch (error) {
    console.error("\n❌ ===== ERROR GETTING VISITOR NAMES =====");
    console.error("Error:", error);
    console.error("❌ ===== ERROR END =====\n");
    return { success: false, data: [], error: "Failed to read data" };
  }
}
