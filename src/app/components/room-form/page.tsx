"use client"

import Link from "next/link";
import {useRouter } from "next/navigation";
import { FormEvent } from "react";
import { fetchFromDjango } from "@/lib/api";

// Types Declaration
type Topic = {
    id: string | number;
    name: string    
}

export default function RoomForm({ topics }: {topics: Topic[]}) {
    const router = useRouter();

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        
        const formData = new FormData(event.currentTarget);
        const topic = formData.get("room-topic")?.toString().trim();
        
        // Validate topic
        if (!topic) {
            alert("Please select a topic");
            return;
        }

        const roomData = {
            name: formData.get("room-name"),
            description: formData.get("room-description"),
            topic: topic,  // Use trimmed topic
        };

        try {
            const response = await fetchFromDjango('api/rooms/create/', {
                method: 'POST',
                body: JSON.stringify(roomData),
            });

            if (response.ok) {
                router.push(`/room/${response.id}/`);
            } else {
                const errorData = await response.json();
                alert(`Failed: ${errorData.error || response.statusText}`);
            }
        } catch (error) {
            alert(error);
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
                        <h3>Create / Update Study Room</h3>
                    </div>
                    </div>
                    <div className="layout__body">
                        <form className="form" action='' onSubmit={handleSubmit}>
                            <div className="form__group">
                                <label>Enter a Topic</label>
                                <input type="text" name="room-topic" placeholder="Select a topic..." required list="topic-list" />
                                <datalist id="topic-list">
                                    <select id="room_topic">
                                        {topics.map((topic: Topic) => (
                                            <option key={topic.id} value={topic.name}>{topic.name}</option>
                                        ))}
                                    </select>
                                </datalist>
                            </div>
                                            
                            <div className="form__group">
                                <label>Room Name</label>
                                <input type="text" name="room-name" placeholder="Enter room name..." required />
                            </div>

                            <div className="form__group">
                                <label>Room Description</label>
                                <textarea name="room-description" placeholder="Enter room description..." required/>
                            </div>

                            <div className="form__action">
                                <Link className="btn btn--dark cancel-btn" href="/">Cancel</Link>
                                <button className="btn btn--main" type="submit">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    )
}