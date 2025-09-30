import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from 'date-fns';
import avatar from "../../../public/images/avatar.svg";
import MessageDeleteButton from "../room-conversation/MessageDeleteButton";

// Types Declaration
type Message = {
    id: string | number;
    name: string;
    user: {id: number, avatar: string, username: string};
    created: string;
    room: {name: string, id: number};
    body: string;
}; 

type ActivityComponentProps = {
    messageList: Message[];       
    query?: string;
    loading?: boolean;      
};

export default function ActivityComponent({ messageList, query, loading }: ActivityComponentProps) {
    
    // Loading state
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

    // Filter messages based on query
    const filteredMessages = query 
        ? messageList.filter(message => 
            message.body.toLowerCase().includes(query.toLowerCase()) ||
            message.user.username.toLowerCase().includes(query.toLowerCase()) ||
            message.room.name.toLowerCase().includes(query.toLowerCase())
          )
        : messageList;

    return (
        <div className="activities">
            <div className="activities__header">
                <h2>{query ? `Activity for "${query}"` : 'Recent Activities'}</h2>
            </div>
            {filteredMessages?.length > 0 ? (
                filteredMessages.map(message => (
                    <div key={message.id} className="activities__box">
                        <div className="activities__boxHeader roomListRoom__header">
                            <Link href={`/profile/${message.user.id}/`} className="roomListRoom__author">
                                <div className="avatar avatar--small">
                                     <Image
                                        src={message.user.avatar || avatar}
                                        alt="Message User Avatar"
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
                <p>No activities found{query ? ` matching "${query}"` : ''}</p>
            )} 
        </div>
    );
}