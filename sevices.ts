import { db } from '@/FirebaseConfig';
import { doc, setDoc, collection, addDoc,getDocs, deleteDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/FirebaseConfig';

/**
 * Save a task under: Users => [userDocId] => Tasks => [taskDoc]
 * @param userDocId - Firestore document ID of the user
 * @param form - Task data object
 * @param taskDocId - (optional) existing task document ID to update
 * @returns Promise<boolean> - true if success, false if failed
 */
export const handleSaveTask = async (
    userDocId: string,
    form: any,
    taskDocId?: string
): Promise<boolean> => {
    try {
        if (!userDocId) throw new Error('User document ID is required');

        if (taskDocId) {
            // Update existing task
            const taskRef = doc(db, 'Users', userDocId, 'Tasks', taskDocId);
            await setDoc(taskRef, form, { merge: true });
            console.log('Task updated successfully');
        } else {
            // Create new task
            const tasksCollection = collection(db, 'Users', userDocId, 'Tasks');
            await addDoc(tasksCollection, form);
            console.log('Task created successfully');
        }

        return true;
    } catch (error) {
        console.error('Error saving task:', error);
        return false;
    }
};




/**
 * Generic function to get all documents from a subcollection
 * @param parentCollection Parent collection name (e.g. 'Users')
 * @param docId Document ID inside the parent collection (e.g. user UID)
 * @param subcollectionName Subcollection name (e.g. 'Tasks')
 * @returns Array of documents with their ID
 */
export const getSubcollectionData = async (
  parentCollection: string,
  docId: string,
  subcollectionName: string
): Promise<any[]> => {
  try {
    if (!parentCollection || !docId || !subcollectionName) {
      throw new Error('Invalid arguments passed to getSubcollectionData');
    }

    const subcollectionRef = collection(db, parentCollection, docId, subcollectionName);
    const snapshot = await getDocs(subcollectionRef);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching subcollection data:', error);
    return [];
  }
};


export const deleteTaskFromFirestore = async (
  userId: string,
  taskId: string
): Promise<void> => {
  try {
    const taskRef = doc(db, 'Users', userId, 'Tasks', taskId);
    await deleteDoc(taskRef);
    console.log(`Task ${taskId} deleted successfully.`);
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};


/**
 * Updates fields in a user's task document.
 *
 * @param userId - The UID of the user.
 * @param taskId - The ID of the task document.
 * @param updatedFields - An object containing the fields to update.
 */
export const updateTaskInFirestore = async (
  userId: string,
  taskId: string,
  updatedFields: Partial<{
    title: string;
    description: string;
    dueDate: string;
    priority: string;
    status: string;
  }>
): Promise<void> => {
  try {
    const taskRef = doc(db, 'Users', userId, 'Tasks', taskId);
    await updateDoc(taskRef, updatedFields);
    console.log(`Task ${taskId} updated successfully.`);
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};



/**
 * Logs in a user using email and password
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<{ uid: string; sessionId: string }>}
 */
export const loginWithEmail = async (
  email: string,
  password: string
): Promise<{ uid: string; sessionId: string }> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const sessionId = await user.getIdToken(); 
    const uid = user.uid;

    return { uid, sessionId };
  } catch (error: any) {
    throw new Error(error.message);
  }
};
