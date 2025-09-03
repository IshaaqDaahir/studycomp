import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from 'date-fns';
import { fetchFromDjango } from "@/lib/api";
import NavBar from "@/components/navbar/NavBar";
import { Suspense } from "react";
import avatar from "../../../public/images/avatar.svg";
import MessageDeleteButton from "@/components/room-conversation/MessageDeleteButton";

// Types Declaration
type Message = {
    id: string | number;
    name: string;
    user: {id: number, avatar: string, username: string};
    created: string;
    room: {name: string, id: number};
    body: string;
}; 

type ActivityPage = {
    messageList: Message[];       
    query?: string;      
};

export default async function ActivityPage() {
    const messages: Message[] = await fetchFromDjango('api/messages/');

    return (
        <Suspense fallback={<div>Loading topics...</div>}>
            <div><NavBar /></div>
            <div className="activities__mobile">
                <div className="activities__header__mobile">
                    <h2>Recent Activities</h2>
                </div>
                {messages.length > 0 ? (
                    messages.map(message => (
                        <div key={message.id} className="activities__box__mobile">
                            <div className="activities__boxHeader roomListRoom__header">
                                <Link href={`/profile/${message.user.id}/`} className="roomListRoom__author">
                                    <div className="avatar avatar--small">
                                        <Image
                                            src={message.user.avatar || avatar}
                                            alt="Avatar"
                                            width={100}
                                            height={100}
                                        />
                                    </div>
                                    <p>
                                        @{message.user.username}
                                        <span>{formatDistanceToNow(new Date(message.created))} ago</span>
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
                    ))
                ) : (
                    <p>No activity yet go and start a conversation with your buddy!</p>
                )} 
            </div>
        </Suspense>
    );
}