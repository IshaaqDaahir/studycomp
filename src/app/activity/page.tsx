import Image from "next/image";
import Link from "next/link";
import { fetchFromDjango } from "@/lib/api";
import { formatDistanceToNow } from 'date-fns';

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
        messagesList: Message[];       
        query?: string;      
    };

export default async function ActivityComponent({ messagesList, query }: ActivityComponentProps) {
    const defaultMessages = await fetchFromDjango('api/messages/');

  return (
    <div className="activities">
      <div className="activities__header">
        <h2>{query ? `Activity for "${query}"` : 'Recent Activities'}</h2>
      </div>
      {query ? (
        messagesList?.length > 0 ? (
          messagesList.map(message => (
            <div key={message.id} className="activities__box">
                <div className="activities__boxHeader roomListRoom__header">
                    <Link href={`/profile/${message.user.id}/`} className="roomListRoom__author">
                        <div className="avatar avatar--small">
                            <Image src={message.user.avatar} width={32} height={32} alt="Message User Avatar" />
                        </div>
                        <p>
                            @{message.user.username}
                            <span>{formatDistanceToNow(new Date(message.created))} ago</span>
                        </p>
                    </Link>

                    <div className="roomListRoom__actions">
                        <Link href={`/delete-message/${message.id}/`}>
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                            <title>remove</title>
                            <path
                                d="M27.314 6.019l-1.333-1.333-9.98 9.981-9.981-9.981-1.333 1.333 9.981 9.981-9.981 9.98 1.333 1.333 9.981-9.98 9.98 9.98 1.333-1.333-9.98-9.98 9.98-9.981z"
                            ></path>
                            </svg>
                        </Link>
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
          <p>No activity found matching "{query}"</p>
        )
      ) : (
        <div>
            {defaultMessages.map((message: Message) => (
                <div key={message.id} className="activities__box">
                    <div className="activities__boxHeader roomListRoom__header">
                        <Link href={`/profile/${message.user.id}/`} className="roomListRoom__author">
                            <div className="avatar avatar--small">
                                <Image src={message.user.avatar} width={32} height={32} alt="Message User Avatar" />
                            </div>
                            <p>
                                @{message.user.username}
                                <span>{formatDistanceToNow(new Date(message.created))} ago</span>
                            </p>
                        </Link>

                        <div className="roomListRoom__actions">
                            <Link href={`/delete-message/${message.id}/`}>
                                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                                <title>remove</title>
                                <path
                                    d="M27.314 6.019l-1.333-1.333-9.98 9.981-9.981-9.981-1.333 1.333 9.981 9.981-9.981 9.98 1.333 1.333 9.981-9.98 9.98 9.98 1.333-1.333-9.98-9.98 9.98-9.981z"
                                ></path>
                                </svg>
                            </Link>
                        </div>
                    </div>
                    <div className="activities__boxContent">
                        <p>replied to post in “<Link href={`/room/${message.room.id}`}>{message.room.name}</Link>”</p>
                        <div className="activities__boxRoomContent">
                            {message.body}
                        </div>
                    </div>
                </div>
            ))}
        </div>
      )}
    </div>
  );
}