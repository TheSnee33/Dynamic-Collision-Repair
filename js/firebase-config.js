/**
 * Dynamic Collision Repair - Firebase Customer Database Integration
 * Project: dynamic-d2ba0
 * Console: https://console.firebase.google.com/project/dynamic-d2ba0
 */

(function (window) {
  'use strict';

  // 1. Firebase Configuration for dynamic-d2ba0
  const firebaseConfig = {
    apiKey: window.__FIREBASE_API_KEY__ || "AIzaSy_REPLACE_WITH_YOUR_FIREBASE_WEB_API_KEY",
    authDomain: "dynamic-d2ba0.firebaseapp.com",
    projectId: "dynamic-d2ba0",
    storageBucket: "dynamic-d2ba0.firebasestorage.app",
    messagingSenderId: "dynamic-d2ba0",
    appId: "1:dynamic-d2ba0:web:customer-database"
  };

  let db = null;
  let isFirebaseInitialized = false;

  // Initialize Firebase SDK if available
  function initFirebase() {
    try {
      if (typeof firebase !== 'undefined' && firebase.initializeApp) {
        if (!firebase.apps.length) {
          firebase.initializeApp(firebaseConfig);
        }
        if (firebase.firestore) {
          db = firebase.firestore();
          isFirebaseInitialized = true;
          console.log('[Firebase] Initialized Firestore for project dynamic-d2ba0');
        }
      }
    } catch (err) {
      console.warn('[Firebase] SDK initialization note:', err.message);
    }
  }

  // Attempt immediate init
  initFirebase();

  /**
   * Save a customer record to Firebase Firestore collection 'customers'
   * 
   * Required fields:
   *  - lastName (string)
   *  - firstName (string)
   *  - phone (string)
   *  - email (string)
   * 
   * Optional fields:
   *  - vehicleYear (string / number)
   *  - vehicleMake (string)
   *  - vehicleModel (string)
   *  - vin (string)
   */
  async function saveCustomerToFirebase(customerData) {
    // Validate required fields
    if (!customerData.lastName || !customerData.firstName || !customerData.phone || !customerData.email) {
      throw new Error('Missing required customer information (First Name, Last Name, Phone, and Email are required).');
    }

    const regCode = customerData.registrationCode || ('DC-REG-' + Math.floor(100000 + Math.random() * 900000));
    const nowIso = new Date().toISOString();

    // Standardized Customer Record
    const record = {
      // Required
      lastName: String(customerData.lastName).trim(),
      firstName: String(customerData.firstName).trim(),
      phone: String(customerData.phone).trim(),
      email: String(customerData.email).trim().toLowerCase(),

      // Optional Vehicle Information
      vehicleYear: customerData.vehicleYear ? String(customerData.vehicleYear).trim() : '',
      vehicleMake: customerData.vehicleMake ? String(customerData.vehicleMake).trim() : '',
      vehicleModel: customerData.vehicleModel ? String(customerData.vehicleModel).trim() : '',
      vin: customerData.vin ? String(customerData.vin).trim().toUpperCase() : '',

      // Metadata
      registrationCode: regCode,
      createdAt: nowIso,
      source: customerData.source || 'Website Customer Registration',
      status: 'Active'
    };

    // 1. Always persist to resilient local queue first so customer data is never lost
    try {
      const existing = JSON.parse(localStorage.getItem('dynamic_collision_customers') || '[]');
      existing.unshift(record);
      localStorage.setItem('dynamic_collision_customers', JSON.stringify(existing.slice(0, 500)));
    } catch (localErr) {
      console.warn('[Storage] Local backup warning:', localErr);
    }

    let savedRemote = false;
    let remoteDocId = null;

    // 2. Try Firebase Firestore SDK
    if (db && typeof db.collection === 'function') {
      try {
        const docRef = await db.collection('customers').add({
          ...record,
          serverTimestamp: firebase.firestore.FieldValue ? firebase.firestore.FieldValue.serverTimestamp() : nowIso
        });
        remoteDocId = docRef.id;
        savedRemote = true;
        console.log('[Firebase] Successfully added customer document to Firestore:', remoteDocId);
      } catch (sdkErr) {
        console.warn('[Firebase] Firestore SDK write note:', sdkErr.message);
      }
    }

    // 3. Try Direct Firestore REST API fallback if SDK write didn't succeed
    if (!savedRemote) {
      try {
        const restUrl = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/customers`;
        const restBody = {
          fields: {
            lastName: { stringValue: record.lastName },
            firstName: { stringValue: record.firstName },
            phone: { stringValue: record.phone },
            email: { stringValue: record.email },
            vehicleYear: { stringValue: record.vehicleYear },
            vehicleMake: { stringValue: record.vehicleMake },
            vehicleModel: { stringValue: record.vehicleModel },
            vin: { stringValue: record.vin },
            registrationCode: { stringValue: record.registrationCode },
            createdAt: { stringValue: record.createdAt },
            source: { stringValue: record.source },
            status: { stringValue: record.status }
          }
        };

        const res = await fetch(restUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(restBody)
        });

        if (res.ok) {
          const resJson = await res.json();
          remoteDocId = resJson.name;
          savedRemote = true;
          console.log('[Firebase] Successfully added customer document via REST API:', remoteDocId);
        } else {
          console.warn('[Firebase] REST API response status:', res.status);
        }
      } catch (restErr) {
        console.warn('[Firebase] REST API fallback note:', restErr.message);
      }
    }

    return {
      success: true,
      savedRemote: savedRemote,
      docId: remoteDocId,
      customer: record
    };
  }

  /**
   * Helper to fetch customers (for admin view / customer list)
   */
  async function getCustomersFromFirebase() {
    if (db && typeof db.collection === 'function') {
      try {
        const snapshot = await db.collection('customers').orderBy('createdAt', 'desc').limit(100).get();
        const list = [];
        snapshot.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
        return list;
      } catch (err) {
        console.warn('[Firebase] Query note:', err.message);
      }
    }

    // Fallback to local stored
    try {
      return JSON.parse(localStorage.getItem('dynamic_collision_customers') || '[]');
    } catch {
      return [];
    }
  }

  // Expose to window
  window.DynamicFirebase = {
    config: firebaseConfig,
    init: initFirebase,
    saveCustomer: saveCustomerToFirebase,
    getCustomers: getCustomersFromFirebase
  };

  // Re-run init when window finishes loading in case SDK scripts loaded deferred
  window.addEventListener('load', initFirebase);

})(window);
