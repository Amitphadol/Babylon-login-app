"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setLoading(false);
      } else {
        router.push("/");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Welcome!
        </h1>

        <div className="space-y-4">
          <div>
            <p className="text-gray-600 text-sm">Email</p>
            <p className="text-lg font-semibold text-gray-800">{user?.email}</p>
          </div>

          <div>
            <p className="text-gray-600 text-sm">User ID</p>
            <p className="text-sm font-mono text-gray-600">{user?.uid}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full mt-6 bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}