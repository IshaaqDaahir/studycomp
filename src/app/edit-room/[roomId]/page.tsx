"use client"

import RoomForm from "@/app/components/room-form/page";
import { fetchFromDjango } from "@/lib/api";
import { useEffect, useState } from "react";

export default function EditRoomPage({ params }: { params: { roomId: string } }) {
    const [room, setRoom] = useState<any>(null);
    const [topics, setTopics] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch room data
                const roomData = await fetchFromDjango(`api/rooms/${params.roomId}/`);
                
                // Fetch topics
                const topicsData = await fetchFromDjango('api/topics/');
                
                setRoom(roomData);
                setTopics(topicsData);
            } catch (err: any) {
                setError(err.message || "Failed to load data");
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, [params.roomId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    
    return <RoomForm topics={topics} room={room} />;
}