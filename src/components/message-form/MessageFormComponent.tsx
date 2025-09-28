"use client"

import { FormEvent, useState } from "react";
import { fetchFromDjango } from "@/lib/api";
import { useChannel } from 'ably/react';

export default function MessageFormComponent({ roomId }: { roomId: number | string }) {
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    
    const { channel } = useChannel(`room-${roomId}`);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        setIsSubmitting(true);
        setError("");

        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                setError('You need to log in first!');
                return;
            }

            const newMessage = await fetchFromDjango(`api/rooms/${roomId}/create-message/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ body: message })
            });

            // Publish to Ably for real-time updates
            channel.publish('new-message', newMessage);

            setMessage(""); // Clear input after successful send
        } catch (err: unknown) {
            if (
                err &&
                typeof err === "object" &&
                "message" in (err as object) &&
                typeof (err as { message?: unknown }).message === "string"
            ) {
                setError((err as { message: string }).message);
            } else {
                setError("Failed to send message");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="room__message">
            <form onSubmit={handleSubmit}>
                <input
                    name="body"
                    placeholder="Write your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={isSubmitting}
                />
            </form>
            {error && <div className="error-message">{error}</div>}
        </div>
    );
}