"use client"

import Image from "next/image";
import Link from "next/link";
import { fetchFromDjango } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import avatar from "../../../public/images/avatar.svg";
import MessageDeleteButton from "../room-conversation/MessageDeleteButton";
import { useEffect, useState } from 'react';

// Types Declaration
    type CurrentUserId = {
        currentUserId: number | string; 
    };

    type Message = {
        id: string | number;
        name: string;
        user: {id: number, avatar: string, username: string};
        created: string;
        room: {id: number, name: string};
        body: string;
    };

export default function UserActivityComponent({ currentUserId }: CurrentUserId) {
    const [userMessages, setUserMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserMessages = async () => {
            try {
                const messages = await fetchFromDjango('api/messages/');
                const filteredMessages = messages.filter((message: Message) => message.user.id == currentUserId);
                setUserMessages(filteredMessages);
            } catch {
                setError('Failed to load activities');
            } finally {
                setLoading(false);
            }
        };

        fetchUserMessages();
    }, [currentUserId]);

    if (loading) {
        return (
            <div className="activities">
                <div className="activities__header">
                    <h2>Recent Activities</h2>
                </div>
                <p>Loading activities...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="activities">
                <div className="activities__header">
                    <h2>Recent Activities</h2>
                </div>
                <p>{error}</p>
            </div>
        );
    }

    if (userMessages.length === 0) {
        return (
            <div className="activities">
                <div className="activities__header">
                    <h2>Recent Activities</h2>
                </div>
                <p>No activities yet.</p>
            </div>
        );
    }

    return(
        <div className="activities">
            <div className="activities__header">
                <h2>Recent Activities</h2>
            </div>
            {userMessages.map((message: Message) => (
                <div key={message.id} className="activities__box">
                    <div className="activities__boxHeader roomListRoom__header">
                        <Link href={`/profile/${message.user.id}/`} className="roomListRoom__author">
                            <div className="avatar avatar--small">
                                 <Image
                                    src={ message.user.avatar || avatar}
                                    alt="Message User Avatar"
                                    width={100}
                                    height={100}
                                />
                            </div>
                            <p>
                                @{message.user.username}
                                <span>{formatDistanceToNow(new Date(message.created))}</span>
                            </p>
                        </Link>

                        <div className="roomListRoom__actions">
                            <MessageDeleteButton 
                                messageUserId={message.user.id} 
                                deleteUrl={`/delete-message/${message.id}/`}
                            />
                        </div>
                    </div>
                    <div className="activities__boxContent">
                        <p>replied to post in “<Link href={`/room/${message.room.id}/`}>{message.room.name}</Link>”</p>
                        <div className="activities__boxRoomContent">
                            {message.body}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}