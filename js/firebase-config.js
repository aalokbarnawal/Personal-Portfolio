/**
 * Aalok Barnawal — Firebase & Cloudinary Service Configuration
 */

const firebaseConfig = {
  apiKey: "AIzaSyCMpAsirvEKurfVvXnjMKZD-hF3Yqr5Dqs",
  authDomain: "portfolio-aalok-26.firebaseapp.com",
  projectId: "portfolio-aalok-26",
  storageBucket: "portfolio-aalok-26.firebasestorage.app",
  messagingSenderId: "250614840874",
  appId: "1:250614840874:web:8699e6b1be3d288cdd8d53",
  measurementId: "G-97HYWWCRGD",
};

const cloudinaryConfig = {
  cloudName: "tqwlcy09",
  uploadUrl: "https://api.cloudinary.com/v1_1/tqwlcy09/image/upload",
  defaultUploadPreset: "portfolio_uploads",
};

// Global Firebase instance references
let firebaseApp = null;
let firestoreDb = null;
let firebaseAuth = null;

/**
 * Initialize Firebase if SDK is loaded
 */
function initFirebase() {
  if (typeof firebase !== "undefined" && !firebaseApp) {
    try {
      firebaseApp = firebase.initializeApp(firebaseConfig);
      firestoreDb = firebase.firestore();
      firebaseAuth = firebase.auth();
    } catch (err) {
      console.warn("Firebase initialization notice:", err);
    }
  }
  return { firebaseApp, firestoreDb, firebaseAuth };
}

/**
 * Fetch portfolio data from Firestore collection 'portfolio'
 * Reads individual section documents (hero, about, whoIAm, services, skills, process, contact).
 */
async function fetchPortfolioData() {
  initFirebase();

  if (!firestoreDb) {
    console.info("Firestore not initialized, using local seed data.");
    return typeof portfolioSeedData !== "undefined" ? portfolioSeedData : null;
  }

  try {
    const portfolioCol = firestoreDb.collection("portfolio");
    const snapshot = await portfolioCol.get();

    if (!snapshot.empty) {
      const combined = {};
      snapshot.forEach((doc) => {
        const id = doc.id;
        const data = doc.data();
        if (id === "services" || id === "process" || id === "projects") {
          combined[id] = data.items || data;
        } else if (id !== "content") {
          combined[id] = data;
        }
      });

      // Merge with seedData to guarantee all keys exist
      if (typeof portfolioSeedData !== "undefined") {
        return deepMerge(portfolioSeedData, combined);
      }
      return combined;
    } else {
      console.info(
        "No documents found in 'portfolio' collection. Falling back to seed data.",
      );
      return typeof portfolioSeedData !== "undefined"
        ? portfolioSeedData
        : null;
    }
  } catch (error) {
    console.warn(
      "Could not fetch from Firestore (using seed data fallback):",
      error,
    );
    return typeof portfolioSeedData !== "undefined" ? portfolioSeedData : null;
  }
}

/**
 * Save updated portfolio sections to individual documents under 'portfolio' collection:
 *   - portfolio/hero
 *   - portfolio/about
 *   - portfolio/whoIAm
 *   - portfolio/services
 *   - portfolio/skills
 *   - portfolio/process
 *   - portfolio/contact
 *   - portfolio/projects
 */
async function savePortfolioData(data) {
  initFirebase();

  if (!firestoreDb) {
    throw new Error(
      "Firestore is not initialized. Check your Firebase SDK scripts.",
    );
  }

  try {
    const batch = firestoreDb.batch();
    const portfolioCol = firestoreDb.collection("portfolio");
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();

    if (data.hero) {
      batch.set(
        portfolioCol.doc("hero"),
        { ...data.hero, updatedAt: timestamp },
        { merge: true },
      );
    }
    if (data.about) {
      batch.set(
        portfolioCol.doc("about"),
        { ...data.about, updatedAt: timestamp },
        { merge: true },
      );
    }
    if (data.whoIAm) {
      batch.set(
        portfolioCol.doc("whoIAm"),
        { ...data.whoIAm, updatedAt: timestamp },
        { merge: true },
      );
    }
    if (data.services) {
      const payload = Array.isArray(data.services)
        ? { items: data.services }
        : data.services;
      batch.set(
        portfolioCol.doc("services"),
        { ...payload, updatedAt: timestamp },
        { merge: true },
      );
    }
    if (data.skills) {
      batch.set(
        portfolioCol.doc("skills"),
        { ...data.skills, updatedAt: timestamp },
        { merge: true },
      );
    }
    if (data.process) {
      const payload = Array.isArray(data.process)
        ? { items: data.process }
        : data.process;
      batch.set(
        portfolioCol.doc("process"),
        { ...payload, updatedAt: timestamp },
        { merge: true },
      );
    }
    if (data.contact) {
      batch.set(
        portfolioCol.doc("contact"),
        { ...data.contact, updatedAt: timestamp },
        { merge: true },
      );
    }
    if (data.projects) {
      const payload = Array.isArray(data.projects)
        ? { items: data.projects }
        : data.projects;
      batch.set(
        portfolioCol.doc("projects"),
        { ...payload, updatedAt: timestamp },
        { merge: true },
      );
    }

    await batch.commit();
    return { success: true };
  } catch (error) {
    console.error("Error saving portfolio sections to Firestore:", error);
    throw error;
  }
}

/**
 * Upload an image file to Cloudinary
 * Uses unsigned upload preset — zero secrets stored in code.
 */
async function uploadToCloudinary(
  file,
  uploadPreset = cloudinaryConfig.defaultUploadPreset,
) {
  if (!file) {
    throw new Error("No file provided for upload.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  try {
    const response = await fetch(cloudinaryConfig.uploadUrl, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (response.ok && data.secure_url) {
      return {
        success: true,
        url: data.secure_url,
        publicId: data.public_id,
        width: data.width,
        height: data.height,
        format: data.format,
      };
    } else {
      const errorMsg = data.error?.message || "Cloudinary upload failed.";
      if (errorMsg.includes("preset") || errorMsg.includes("upload_preset")) {
        throw new Error(
          `Cloudinary unsigned preset '${uploadPreset}' is required. Please enable an unsigned preset named '${uploadPreset}' in your Cloudinary Dashboard (Settings > Upload > Add upload preset).`,
        );
      }
      throw new Error(errorMsg);
    }
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
}

/**
 * Helper to deep merge objects
 */
function deepMerge(target, source) {
  const output = { ...target };
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          output[key] = source[key];
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        output[key] = source[key];
      }
    });
  }
  return output;
}

function isObject(item) {
  return item && typeof item === "object" && !Array.isArray(item);
}
