"use client"
import Dashboard from '@/components/Dashboard'
import { auth, db, } from '@/lib/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const page = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                router.push("/");
                setLoading(false);
                return;
            }

            // Obtener datos adicionales desde Firestore
            try {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    setUser({ uid: user.uid, email: user.email, ...userDoc.data() });
                } else {
                    setUser({ uid: user.uid, email: user.email });
                }
            } catch (error) {
                console.error("Error obteniendo datos del usuario:", error);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) return <p>Cargando.....</p>

    if (!user) return null;


    return (
        <>
            <Dashboard user={user} />
        </>
    )
}

export default page