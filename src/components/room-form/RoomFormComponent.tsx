"use client"

import Link from "next/link";
import {useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { fetchFromDjango } from "@/lib/api";

// Types Declaration
type Topic = {
    id: string | number;
    name: string    
}

type RoomFormProps = {
    topics: Topic[];
    room?: {
        id: number;
        name: string;
        description: string;
        topic: Topic;
    };
}

export default function RoomFormComponent({ topics, room }: RoomFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [availableTopics, setAvailableTopics] = useState<Topic[]>([]);

    // Initialize form with room data if editing
    useEffect(() => {
        // Ensure topics is always an array
        setAvailableTopics(Array.isArray(topics) ? topics : []);

        if (room) {
            (document.querySelector('input[name="room-name"]') as HTMLInputElement).value = room.name;
            (document.querySelector('textarea[name="room-description"]') as HTMLTextAreaElement).value = room.description || '';
            (document.querySelector('input[name="room-topic"]') as HTMLInputElement).value = room.topic.name;
        }
    }, [room, topics]);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSubmitting(true);
        
        const formData = new FormData(event.currentTarget);
        const topic = formData.get("room-topic")?.toString().trim();
        
        // Validate topic
        if (!topic) {
            alert("Please select a topic");
            setIsSubmitting(false);
            return;
        }

        const roomData = {
            name: formData.get("room-name"),
            description: formData.get("room-description"),
            topic: topic,  // Use trimmed topic
        };

        try {
            // Get JWT token from storage
            const token = localStorage.getItem('access_token');
            if (!token) {
                alert('You need to log in first');
                setIsSubmitting(false);
                return;
            }

            let response;
            if (room) {
                // Update existing room
                response = await fetchFromDjango(`api/rooms/${room.id}/update/`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(roomData),
                });
            } else {
                // Create new room
                response = await fetchFromDjango('api/rooms/create/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(roomData),
                });
            }

            // Handle response (could be object or array)
            const createdRoom = Array.isArray(response) ? response[0] : response;
            
            if (createdRoom?.id) {
                router.push(`/room/${createdRoom.id}/`);
                router.refresh();
            } else {
                throw new Error("Failed to get room ID from response");
            } 
        } catch (error: unknown) {
            const errorMsg = (error instanceof Error) ? error.message : String(error);
            alert(`Failed to ${room ? 'update' : 'create'} room: ${errorMsg}`);
        } finally {
            setIsSubmitting(false);
        }
    }

    return(
        <main className="create-room layout">
            <div className="container">
                <div className="layout__box">
                    <div className="layout__boxHeader">
                    <div className="layout__boxTitle">
                        <Link href="/">
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                                <title>arrow-left</title>
                                <path
                                d="M13.723 2.286l-13.723 13.714 13.719 13.714 1.616-1.611-10.96-10.96h27.625v-2.286h-27.625l10.965-10.965-1.616-1.607z">
                                </path>
                            </svg>
                        </Link>
                        <h3>{room ? 'Update' : 'Create'} Study Room</h3>
                    </div>
                    </div>
                    <div className="layout__body">
                        <form className="form" onSubmit={handleSubmit}>
                            <div className="form__group">
                                <label>Enter a Topic</label>
                                <input type="text" name="room-topic" placeholder="Select a topic..." required list="topic-list" defaultValue={room?.topic.name || ''} />
                                <datalist id="topic-list">
                                    <select id="room_topic">
                                        {availableTopics.map((topic: Topic) => (
                                            <option key={topic.id} value={topic.name}>{topic.name}</option>
                                        ))}
                                    </select>
                                </datalist>
                            </div>
                                            
                            <div className="form__group">
                                <label>Room Name</label>
                                <input type="text" name="room-name" placeholder="Enter room name..." required defaultValue={room?.name || ''} />
                            </div>

                            <div className="form__group">
                                <label>Room Description</label>
                                <textarea name="room-description" placeholder="Enter room description..." defaultValue={room?.description || ''} />
                            </div>

                            <div className="form__action">
                                <Link className="btn btn--dark cancel-btn" href={room ? `/room/${room.id}/` : '/'}>Cancel</Link>
                                <button className="btn btn--main" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Processing...' : 'Submit'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    )
}