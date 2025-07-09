"use client"

import { FormEvent, useState } from "react";
import { fetchFromDjango } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function MessageForm({ roomId }: { roomId: number | string }) {
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

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

            await fetchFromDjango(`api/rooms/${roomId}/create-message/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ body: message })
            });

            setMessage(""); // Clear input after successful send
            router.refresh(); // Refresh to show new message
        } catch (err: any) {
            setError(err.message || "Failed to send message");
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