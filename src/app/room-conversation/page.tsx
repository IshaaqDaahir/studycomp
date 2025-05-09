import Image from "next/image";
import Link from "next/link";
import { fetchFromDjango } from "@/lib/api";
import { formatDistanceToNow } from 'date-fns';

export default async function RoomConversation({ currentRoomId }) {
    const messages = await fetchFromDjango("api/messages/");

    // Filter messages by room ID
    const roomMesssages = messages.filter(message => message.room.id == currentRoomId);

    return (
        <div className="room__conversation">
            <div className="threads scroll">
                {roomMesssages.map((message) => (
                    <div key={message.id} className="thread">
                        <div className="thread__top">
                            <div className="thread__author">
                                <Link href={`/profile/${message.user.id}/`} className="thread__authorInfo">
                                    <div className="avatar avatar--small">
                                        <Image src={message.user.avatar} width={32} height={32} alt="Message User Avatar" />
                                    </div>
                                    <span>@{message.user.username}</span>
                                </Link>
                                <span className="thread__date">{formatDistanceToNow(new Date(message.created))} ago</span>
                            </div>

                            {/* {% if request.user == message.user %} */}
                            <Link href="/delete">
                                <div className="thread__delete">
                                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                                        <title>remove</title>
                                        <path
                                        d="M27.314 6.019l-1.333-1.333-9.98 9.981-9.981-9.981-1.333 1.333 9.981 9.981-9.981 9.98 1.333 1.333 9.981-9.98 9.98 9.98 1.333-1.333-9.98-9.98 9.98-9.981z"
                                        ></path>
                                    </svg>
                                </div>
                            </Link>
                            {/* {% endif %} */}
                        </div>
                        <div className="thread__details">
                            {message.body}
                        </div>
                    </div>
                ))}
            {/* {% endfor %} */}

            </div>
        </div>
    );
}

