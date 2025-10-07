
import { doc, setDoc, Firestore, serverTimestamp } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';

// This type will be generated from backend.json
// For now, we define it manually based on the form schema.
export type UserProfile = {
  uid?: string; // Document ID, which is the Firebase Auth UID
  id: string; // Custom Registration ID like INF001
  email: string;
  photoURL?: string;
  status?: "Active" | "Inactive";
  personalInfo: {
    fullName: string;
    fatherName: string;
    motherName: string;
    mobile: string;
    dob: string;
    gender: "male" | "female" | "other";
    maritalStatus: "single" | "married" | "divorced" | "widowed";
    religion: string;
    caste: string;
    children?: string;
    bloodGroup?: string;
    identificationMark?: string;
    pan: string;
    aadhaar: string;
  };
  address: {
    permanent: string;
    current: string;
  };
  bankDetails: {
    bankName: string;
    accountNumber: string;
    ifsc: string;
    upi?: string;
    bankAddress: string;
  };
  nomineeDetails: {
    nomineeName: string;
    nomineeFatherName: string;
    relationship: string;
    nomineeMobile: string;
    nomineeDob: string;
  };
  createdAt?: any;
  updatedAt?: any;
};


/**
 * Creates or updates a user's profile document in Firestore.
 *
 * @param {Firestore} db - The Firestore instance.
 * @param {string} uid - The user's unique ID from Firebase Auth.
 * @param {UserProfile} data - The user's profile data.
 */
export async function setUserProfile(db: Firestore, uid: string, data: Partial<UserProfile>) {
  const userDocRef = doc(db, 'users', uid);

  const profileData: Partial<UserProfile> = {
      ...data,
      uid: uid, // Add the UID to the document data
      status: data.status || 'Active', // Default status to Active
      updatedAt: serverTimestamp(),
  };

  // Add createdAt only if it's a new document
  if (!data.createdAt) {
    profileData.createdAt = serverTimestamp();
  }


  return setDoc(userDocRef, profileData, { merge: true })
    .catch(async (serverError) => {
      const permissionError = new FirestorePermissionError({
        path: userDocRef.path,
        operation: 'update', // or 'create' depending on context
        requestResourceData: profileData,
      } satisfies SecurityRuleContext);
      
      errorEmitter.emit('permission-error', permissionError);
      // Re-throw the original error to be caught by the caller if needed
      throw serverError;
    });
}
