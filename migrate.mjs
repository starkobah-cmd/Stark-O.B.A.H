import fs from "fs";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = JSON.parse(fs.readFileSync("firebase-applet-config.json", "utf-8"));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const localDb = JSON.parse(fs.readFileSync("data/db.json", "utf-8"));

async function run() {
  const collections = ["media", "posts", "leads", "pages", "redirects"];
  for (const coll of collections) {
    if (localDb[coll] && Array.isArray(localDb[coll])) {
      console.log(`Migrating ${coll}...`);
      for (const item of localDb[coll]) {
        try {
          if (item.id) {
            await setDoc(doc(db, coll, item.id), item);
            console.log(`- Migrated ${item.id}`);
          }
        } catch (e) {
          console.error(`- Failed to migrate ${item.id}`, e);
        }
      }
    }
  }
  console.log("Migration complete.");
  process.exit(0);
}
run();
