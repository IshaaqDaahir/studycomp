import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from 'date-fns';
import { fetchFromDjango } from "@/lib/api";
import NavBar from "@/components/navbar/NavBar";
import { Suspense } from "react";

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

// Types Declaration
type ActivityPageProps = {
    searchParams: Promise<{ q?: string }>; 
};

export default async function ActivityPage({ searchParams }: ActivityPageProps) {
    let searchResult: { messages: Message[] } = { 
            messages: []
    };
    let errorMsg = '';
    
    const passedQuery = await searchParams;
    const query = passedQuery.q || '';

    // Fetch all data in parallel where possible
    try {
        if (query) {
            // Single fetch for search results
            const searchData = await fetchFromDjango(`api/search/?q=${query}`);

            // Handle paginated response
            searchResult = {
                messages: Array.isArray(searchData?.messages) 
                    ? searchData.messages 
                    : searchData?.messages?.results || [],
            };
        }
    } catch (error: unknown) {
        errorMsg = query ? 'Error fetching search results.' : 'Error fetching initial data.';
        console.error(errorMsg, error);
    }
    const messages: Message[] = await fetchFromDjango('api/messages/');

    // Filter messages based on query
    const filteredMessages = query 
        ? searchResult.messages.filter(message => 
            message.body.toLowerCase().includes(query.toLowerCase()) ||
            message.user.username.toLowerCase().includes(query.toLowerCase()) ||
            message.room.name.toLowerCase().includes(query.toLowerCase())
          )
        : messages;

    return (
        <Suspense fallback={<div>Loading topics...</div>}>
            <div><NavBar /></div>
            <div className="activities__mobile">
                <div className="activities__header__mobile">
                    <h2>{query ? `Activity for "${query}"` : 'Recent Activities'}</h2>
                </div>
                {filteredMessages.length > 0 ? (
                    filteredMessages.map(message => (
                        <div key={message.id} className="activities__box__mobile">
                            <div className="activities__boxHeader roomListRoom__header">
                                <Link href={`/profile/${message.user.id}/`} className="roomListRoom__author">
                                    <div className="avatar avatar--small">
                                        <Image
                                            src={`http://localhost:8000${message.user.avatar}`}
                                            alt="Avatar"
                                            width={100}
                                            height={100}
                                            unoptimized={true}
                                        />
                                    </div>
                                    <p>
                                        @{message.user.username}
                                        <span>{formatDistanceToNow(new Date(message.created))} ago</span>
                                    </p>
                                </Link>

                                <div className="roomListRoom__actions">
                                    <Link href={`/delete-message/${message.id}/`}>
                                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                                        <title>Delete Message</title>
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
                    <p>No activity found{query ? ` matching "${query}"` : ''}</p>
                )} 
            </div>
        </Suspense>
    );
}