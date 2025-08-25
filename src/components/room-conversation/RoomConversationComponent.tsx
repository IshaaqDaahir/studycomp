import Image from "next/image";
import Link from "next/link";
import { fetchFromDjango } from "@/lib/api";
import { formatDistanceToNow } from 'date-fns';
import avatar from "../../../public/images/avatar.svg";
import AuthWrapper from "../AuthWrapper";

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
                            <AuthWrapper>
                                <Link href={`/delete-room-message/${message.id}`}>
                                    <div className="thread__delete">
                                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                                            <title>Delete Message</title>
                                            <path
                                            d="M27.314 6.019l-1.333-1.333-9.98 9.981-9.981-9.981-1.333 1.333 9.981 9.981-9.981 9.98 1.333 1.333 9.981-9.98 9.98 9.98 1.333-1.333-9.98-9.98 9.98-9.981z"
                                            ></path>
                                        </svg>
                                    </div>
                                </Link>
                            </AuthWrapper>
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

