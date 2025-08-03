"use client"

import RoomForm from "@/app/components/room-form/RoomFormComponent";
import { fetchFromDjango } from "@/lib/api";
import { useEffect, useState } from "react";
import { use } from 'react'

type Topic = {
    id: string | number;
    name: string    
}

type Room = {
    id: string | number;
    name: string;
    description?: string;
    host: {
        id: string | number;
        username: string;
        email: string;
        name: string;
        bio?: string;
        avatar?: string;
    };
    topic: Topic;
    participants?: Array<{
        id: string | number;
        username: string;
    }>;
    updated: string;
    created: string;
};

type EditRoomComponentProps = {
    params: Promise<{ roomId: string }>;
};

export default function EditRoomComponent({ params }: EditRoomComponentProps) {
    const [room, setRoom] = useState<Room | null>(null);
    const [topics, setTopics] = useState<Topic[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { roomId } = use(params)

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch room data
                const roomData = await fetchFromDjango(`api/rooms/${roomId}/`);
                
                // Fetch topics
                const topicsData = await fetchFromDjango('api/topics/');
                
                setRoom(roomData);
                setTopics(topicsData);
            } catch (err: unknown) {
                setError(
                    typeof err === "object" && err !== null && "message" in err
                        ? String((err as { message: unknown }).message)
                        : "Failed to load data"
                );
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, [roomId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    
    return (
        <RoomForm
            topics={topics}
            room={
                room
                    ? {
                        id: typeof room.id === "string" ? parseInt(room.id as string, 10) : room.id,
                        name: room.name,
                        description: room.description ?? "",
                        topic: room.topic,
                    }
                    : undefined
            }
        />
    );
}