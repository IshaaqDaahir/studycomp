"use client"

import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { fetchFromDjango } from "@/lib/api";

export default function DeleteRoomPage() {
    const router = useRouter();
    const { roomId } = useParams();
    const [roomName, setRoomName] = useState("");
    const [loading, setLoading] = useState(true);

    // Fetch room details on mount
    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const roomData = await fetchFromDjango(`api/rooms/${roomId}/`);
                setRoomName(roomData.name);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch room:", error);
                setLoading(false);
            }
        };

        fetchRoom();
    }, [roomId]);

    const handleDelete = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                alert('You need to log in first');
                return;
            }

            await fetchFromDjango(`api/rooms/${roomId}/delete/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            router.push("/");
        } catch (error: any) {
            alert(`Failed to delete room: ${error.message}`);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <main className="delete-item layout">
            <div className="container">
                <div className="layout__box">
                    <div className="layout__boxHeader">
                        <div className="layout__boxTitle">
                            <Link href="/">
                                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                    viewBox="0 0 32 32">
                                    <title>arrow-left</title>
                                    <path
                                        d="M13.723 2.286l-13.723 13.714 13.719 13.714 1.616-1.611-10.96-10.96h27.625v-2.286h-27.625l10.965-10.965-1.616-1.607z">
                                    </path>
                                </svg>
                            </Link>
                            <h3>Back</h3>
                        </div>
                    </div>
                    <div className="layout__body">
                        <form className="form" onSubmit={handleDelete}>
                            <div className="form__group">
                                <p>Are you sure you want to delete "{roomName}"?</p>
                            </div>
                            <div className="for__group">
                                <button className="btn btn--main" type="submit">Confirm</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}