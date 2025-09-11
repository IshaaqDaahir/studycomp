import Image from "next/image";
import Link from "next/link";
import { fetchFromDjango } from "@/lib/api";
import { formatDistanceToNow } from 'date-fns';
import avatar from "../../../public/images/avatar.svg";
import MessageDeleteButton from "./MessageDeleteButton";

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

export default async function RoomConversationComponent({ currentRoomId }: CurrentRoomId) {
    const messages = await fetchFromDjango("api/messages/");

    // Filter messages by room ID
    const roomMesssages = messages.filter((message: Message) => message.room.id == currentRoomId);

    return (
        <div className="room__conversation">
            <div className="threads scroll">
                {roomMesssages.map((message: Message) => (
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
                ))}
            </div>
        </div>
    );
}

