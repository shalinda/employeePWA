const DB_NAME = 'EmployeeDB';
const DB_VERSION = 1;
const STORE_NAME = 'employees';

function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = (event) => {
            reject('Error opening IndexedDB:', event);
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
            }
        };
    });
}

function saveEmployeeToIndexedDB(employee) {
    return new Promise(async (resolve, reject) => {
        const db = await openDB();
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.add(employee);

        request.onsuccess = () => {
            resolve('Employee added to IndexedDB');
        };

        request.onerror = (event) => {
            reject('Error adding employee to IndexedDB:', event);
        };
    });
}

function getEmployeesFromIndexedDB() {
    return new Promise(async (resolve, reject) => {
        const db = await openDB();
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        request.onerror = (event) => {
            reject('Error retrieving employees from IndexedDB:', event);
        };
    });
}

function deleteEmployeeFromIndexedDB(id) {
    return new Promise(async (resolve, reject) => {
        const db = await openDB();
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(id);

        request.onsuccess = () => {
            resolve('Employee deleted from IndexedDB');
        };

        request.onerror = (event) => {
            reject('Error deleting employee from IndexedDB:', event);
        };
    });
}
