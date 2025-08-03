import Image from "next/image";
import Link from "next/link";
import { fetchFromDjango } from '@/lib/api';

// Types Declaration
    type CurrentRoomId = {
        currentRoomId: number | string; 
    };

    type Room = {
        id: string | number;
        length: number; 
        avatar: string; 
        username: string;
    };

export default async function RoomParticipantsComponent({ currentRoomId }: CurrentRoomId) {
    const data = await fetchFromDjango("api/rooms/");

    // Filter room by the current room ID - returns an array
    const rooms = data.filter((room: Room) => room.id == currentRoomId);
    
    // Get the first (and should be only) room that matches
    const room = rooms[0];

    if (!room) {
        return "No room found with this Id";  
    }

    const participants = room.participants || [];

    return (
        <div className="participants">
            <h3 className="participants__top">Participants <span>({participants.length} Joined)</span></h3>
            <div className="participants__list scroll">
                {participants.map((participant: Room) => (
                    <Link key={participant.id} href={`/profile/${participant.id}/`} className="participant">
                        <div className="avatar avatar--medium">
                            <Image src={participant.avatar} width={32} height={32} alt="User Avatar" />
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

