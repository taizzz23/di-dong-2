import {
    createUserWithEmailAndPassword,
    User as FirebaseUser,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
    updateProfile
} from "firebase/auth";
import {
    doc,
    serverTimestamp,
    setDoc,
    updateDoc
} from "firebase/firestore";
import { auth, db } from "./firebaseConfig";

// Đăng ký user
export async function registerUser(
  email: string,
  password: string,
  name: string
) {
  try {
    console.log("🚀 Starting registration for:", email);
    
    // 1. Tạo user trong Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    // 2. Cập nhật displayName trong profile
    await updateProfile(user, {
      displayName: name
    });

    // 3. Lưu thêm info user vào Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email,
      name,
      displayName: name,
      photoURL: null,
      role: "user",
      emailVerified: false,
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastLoginAt: null,
    });

    console.log("✅ User registered successfully:", user.uid);

    return {
      uid: user.uid,
      email: user.email,
      name,
    };
  } catch (error) {
    console.error("❌ Registration error:", error);
    throw error;
  }
}

// Đăng nhập user
export async function loginUser(
  email: string,
  password: string
): Promise<{
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}> {
  try {
    console.log("🔐 Attempting login for:", email);
    
    const userCredential = await signInWithEmailAndPassword(
      auth, 
      email, 
      password
    );

    const user = userCredential.user;
    
    console.log("✅ Login successful:", user.uid);
    
    // Cập nhật lastLoginAt trong Firestore
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        lastLoginAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (firestoreError) {
      console.warn("⚠️ Could not update lastLoginAt:", firestoreError);
    }

    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    };
  } catch (error) {
    console.error("❌ Login error:", error);
    throw error;
  }
}

// Đăng xuất
export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
    console.log("✅ Logout successful");
  } catch (error) {
    console.error("❌ Logout error:", error);
    throw error;
  }
}

// Quên mật khẩu
export async function resetPassword(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log("✅ Password reset email sent to:", email);
  } catch (error) {
    console.error("❌ Password reset error:", error);
    throw error;
  }
}

// Kiểm tra user đã đăng nhập chưa
export function getCurrentUser(): FirebaseUser | null {
  return auth.currentUser;
}