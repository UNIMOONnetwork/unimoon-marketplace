import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCAaKqJAFwkqrGEcDFCe_M_u-iwZ21HLcE',
  authDomain: 'unimoon-67e1d.firebaseapp.com',
  projectId: 'unimoon-67e1d',
  storageBucket: 'unimoon-67e1d.appspot.com',
  messagingSenderId: '30338275002',
  appId: '1:30338275002:web:bb35749dd80b26db36d483',
};

const firebaseApp = initializeApp(firebaseConfig);

// Get a reference to the storage service, which is used to create references in your storage bucket
const storage = getStorage(firebaseApp);

export { storage };
