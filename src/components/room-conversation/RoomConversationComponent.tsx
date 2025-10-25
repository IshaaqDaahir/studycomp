"use client"

import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from 'date-fns';
import avatar from "../../../public/images/avatar.svg";
import MessageDeleteButton from "./MessageDeleteButton";
import { useChannel } from 'ably/react';
import { useState, useEffect } from 'react';
import { fetchFromDjango } from "@/lib/api";

// Types Declaration
    type CurrentRoomId = {
        currentRoomId: number | string; 
    };

    type Message = {
        id: string | number;
        name: string;
        user: {id: number, avatar: string, username: string};
        created: string;
        room: {id: number};
        body: string;
    };

export default function RoomConversationComponent({ currentRoomId }: CurrentRoomId) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Load initial messages
    useEffect(() => {
        const loadMessages = async () => {
            try {
                const allMessages = await fetchFromDjango('api/messages/');
                const roomMessages = allMessages.filter((msg: Message) => msg.room.id == currentRoomId);
                setMessages(roomMessages);
            } catch {
                // Error loading messages - silently handle for production
            } finally {
                setLoading(false);
            }
        };
        loadMessages();
    }, [currentRoomId]);
    
    // Subscribe to real-time messages
    useChannel(`room-${currentRoomId}`, (message) => {
        if (message.name === 'new-message') {
            setMessages(prev => [...prev, message.data]);
        }
    });

    if (loading) {
        return (
            <div className="room__conversation">
                <div className="threads scroll">
                    <p>Loading messages...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="room__conversation">
            <div className="threads scroll">
                {messages.length === 0 ? (
                    <p>No messages yet. Start the conversation!</p>
                ) : (
                    messages.map((message: Message) => (
                    <div key={message.id} className="thread">
                        <div className="thread__top">
                            <div className="thread__author">
                                <Link href={`/profile/${message.user.id}/`} className="thread__authorInfo">
                                    <div className="avatar avatar--small">
                                        <Image src={message.user.avatar || avatar} width={32} height={32} alt="Message User Avatar" />
                                    </div>
                                    <span>@{message.user.username}</span>
                                </Link>
                                <span className="thread__date">{formatDistanceToNow(new Date(message.created))} ago</span>
                            </div>
                            <MessageDeleteButton 
                                messageUserId={message.user.id} 
                                deleteUrl={`/delete-room-message/${message.id}`}
                            />
                        </div>
                        <div className="thread__details">
                            {message.body}
                        </div>
                    </div>
                    ))
                )}
            </div>
        </div>
    );
}

