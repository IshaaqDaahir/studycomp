'use client';

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import RoomConversationComponent from "@/components/room-conversation/RoomConversationComponent";
import RoomParticipantsComponent from "@/components/room-participants/RoomParticipantsComponent";
import MessageForm from "@/components/message-form/MessageFormComponent";
import avatar from "../../../public/images/avatar.svg";
import RoomActionButtons from "@/components/room/RoomActionButtons";
import RoomWrapper from "@/components/room/RoomWrapper";
import { fetchFromDjango } from '@/lib/api';

interface Room {
    id: number;
    name: string;
    description: string;
    created: string;
    host: {
        id: number;
        username: string;
        avatar: string;
    };
    topic?: {
        name: string;
    };
}

interface RoomPageContentProps {
    roomId: string | number;
}

export default function RoomPageContent({ roomId }: RoomPageContentProps) {
    const [room, setRoom] = useState<Room | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const roomResponse = await fetchFromDjango(`api/rooms/${roomId}/`);
                const roomData = Array.isArray(roomResponse) ? roomResponse[0] : roomResponse;
                setRoom(roomData);
            } catch (err) {
                setError('Failed to load room. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchRoom();
    }, [roomId]);

    if (loading) {
        return (
            <main className="room_layout">
                <div className="container">
                    <div className="room">
                        <div className="room__top">
                            <div className="room__topLeft">
                                <Link href="/">
                                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                                        <title>Go Back</title>
                                        <path d="M13.723 2.286l-13.723 13.714 13.719 13.714 1.616-1.611-10.96-10.96h27.625v-2.286h-27.625l10.965-10.965-1.616-1.607z"></path>
                                    </svg>
                                </Link>
                                <h3>Loading Room...</h3>
                            </div>
                        </div>
                        <div className="room__box">
                            <p>Loading room details...</p>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    if (error || !room) {
        return (
            <main className="room_layout">
                <div className="container">
                    <div className="room">
                        <div className="room__top">
                            <div className="room__topLeft">
                                <Link href="/">
                                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                                        <title>Go Back</title>
                                        <path d="M13.723 2.286l-13.723 13.714 13.719 13.714 1.616-1.611-10.96-10.96h27.625v-2.286h-27.625l10.965-10.965-1.616-1.607z"></path>
                                    </svg>
                                </Link>
                                <h3>Room Not Found</h3>
                            </div>
                        </div>
                        <div className="room__box">
                            <p>{error || 'Room not found'}</p>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="layout layout--2">
            <div className="container">
                <RoomWrapper roomId={roomId}>
                    <div className="room">
                        <div className="room__top">
                            <div className="room__topLeft">
                                <Link href="/">
                                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                                        <title>Go Back</title>
                                        <path d="M13.723 2.286l-13.723 13.714 13.719 13.714 1.616-1.611-10.96-10.96h27.625v-2.286h-27.625l10.965-10.965-1.616-1.607z"></path>
                                    </svg>
                                </Link>
                                <h3>Study Room</h3>
                            </div>
                            <div className="room__topRight">
                                <RoomActionButtons roomId={room.id} hostId={room.host.id} />
                            </div>
                        </div>
                        <div className="room__box scroll">
                            <div className="room__header scroll">
                                <div className="room__info">
                                    <h3>{room.name}</h3>
                                    <span>{formatDistanceToNow(new Date(room.created))} ago</span>
                                </div>
                                <div className="room__hosted">
                                    <p>Hosted By</p>
                                    <Link href={`/profile/${room.host.id}/`} className="room__author">
                                        <div className="avatar avatar--small">
                                            <Image 
                                                src={room.host.avatar || avatar}
                                                width={32} 
                                                height={32} 
                                                alt="Room Host Avatar"
                                            />
                                        </div>
                                        <span>@{room.host.username}</span>
                                    </Link>
                                </div>
                                <div className="room__details">
                                    {room.description}
                                </div> 
                                {room.topic && (
                                    <span className="room__topics">{room.topic.name}</span>
                                )}
                            </div>
                            <RoomConversationComponent currentRoomId={room.id} />
                        </div>
                        <MessageForm roomId={room.id} />
                    </div>
                </RoomWrapper>
                <RoomParticipantsComponent currentRoomId={room.id} />
            </div>
        </main>
    );
}