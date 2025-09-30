"use client"

import Image from "next/image";
import Link from "next/link";
import { fetchFromDjango } from '@/lib/api';
import avatar from "../../../public/images/avatar.svg";
import { useEffect, useState } from 'react';

// Types Declaration
    type CurrentRoomId = {
        currentRoomId: number | string; 
    };

    type Participant = {
        id: string | number;
        avatar: string; 
        username: string;
    };

    type Room = {
        id: string | number;
        participants: Participant[];
    };

export default function RoomParticipantsComponent({ currentRoomId }: CurrentRoomId) {
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchParticipants = async () => {
            try {
                const data = await fetchFromDjango("api/rooms/");
                const rooms = data.filter((room: Room) => room.id == currentRoomId);
                const room = rooms[0];
                
                if (room) {
                    setParticipants(room.participants || []);
                } else {
                    setError('Room not found');
                }
            } catch (err) {
                setError('Failed to load participants');
                console.error('Participants fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchParticipants();
    }, [currentRoomId]);

    if (loading) {
        return (
            <div className="participants">
                <h3 className="participants__top">Participants <span>(Loading...)</span></h3>
                <div className="participants__list">
                    <p>Loading participants...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="participants">
                <h3 className="participants__top">Participants</h3>
                <div className="participants__list">
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="participants">
            <h3 className="participants__top">Participants <span>({participants.length} Joined)</span></h3>
            <div className="participants__list scroll">
                {participants.map((participant: Participant) => (
                    <Link key={participant.id} href={`/profile/${participant.id}/`} className="participant">
                        <div className="avatar avatar--medium">
                            <Image src={participant.avatar || avatar} width={32} height={32} alt="Participant Avatar" />
                        </div>
                        <p>
                            {participant.username}
                            <span>@{participant.username}</span>
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    );
}

