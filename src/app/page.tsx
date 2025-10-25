'use client';

import NavBar from "@/components/navbar/NavBar";
import TopicsComponent from "@/components/topics/TopicsComponent";
import FeedComponent from "@/components/feed/FeedComponent";
import Link from "next/link";
import { Suspense, useEffect, useState } from 'react';
import { fetchFromDjango } from "@/lib/api";
import ActivityComponent from "../components/activity/ActivityComponent";
import AuthWrapper from "@/components/AuthWrapper";
import { useSearchParams } from 'next/navigation';

// Types Declaration
type Message = {
    id: string | number;
    name: string;
    user: {id: number, avatar: string, username: string};
    created: string;
    room: {name: string, id: number};
    body: string;
}; 

type Room = {
    id: string | number;
    host: {id: string | number, avatar: string, username: string};
    participants: {length: number};
    topic: {name: string};
    created: string;
    name: string;
};

type Topic = {
    id: string | number;
    name: string;
};

function HomePageContent() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [topics, setTopics] = useState<Topic[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [searchResults, setSearchResults] = useState<{ rooms: Room[]; topics?: Topic[] }>({ 
        rooms: [],  
        topics: [] 
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';

    useEffect(() => {
        const fetchData = async () => {
            setError('');
            
            try {
                if (query) {
                    const searchData = await fetchFromDjango(`api/search/?q=${query}`);
                    setSearchResults({
                        rooms: searchData.rooms,
                        topics: searchData.topics
                    });
                } else {
                    const [roomsResponse, topicsResponse, messagesResponse] = await Promise.all([
                        fetchFromDjango('api/rooms/').catch(() => []),
                        fetchFromDjango('api/topics/').catch(() => []),
                        fetchFromDjango('api/messages/').catch(() => [])
                    ]);

                    setRooms(roomsResponse);
                    setTopics(topicsResponse);
                    setMessages(messagesResponse);
                }
            } catch {
                setError(query ? 'Error fetching search results.' : 'Error fetching data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [query]);

    return(
        <main className="layout layout--3">
            <div className="container">
                {/* Topics Component */}
                <div>
                    <TopicsComponent 
                        topics={query ? searchResults.topics || [] : topics}
                        rooms={query ? searchResults.rooms : rooms}
                        query={query}
                        loading={loading}
                    />
                </div>
                
                {/* Room List Start */}
                <div className="roomList">
                    <div className="mobile-menu">
                        <form className="header__search" action="#" method="GET">
                            <label>
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                                <title>search</title>
                                <path
                                d="M32 30.586l-10.845-10.845c1.771-2.092 2.845-4.791 2.845-7.741 0-6.617-5.383-12-12-12s-12 5.383-12 12c0 6.617 5.383 12 12 12 2.949 0 5.649-1.074 7.741-2.845l10.845 10.845 1.414-1.414zM12 22c-5.514 0-10-4.486-10-10s4.486-10 10-10c5.514 0 10 4.486 10 10s-4.486 10-10 10z"
                                ></path>
                            </svg>
                            <input name="q" placeholder="Search for posts" />
                            </label>
                        </form>
                        <div className="mobile-menuItems">
                            <Link className="btn btn--main btn--pill" href="/search-topics">Browse Topics</Link>
                            <Link className="btn btn--main btn--pill" href="/activity">Recent Activities</Link>
                        </div>
                    </div>

                    <div className="roomList__header">
                        <div>
                            <h2>Study Room</h2>
                            <p>
                                {loading ? 'Loading rooms...' : 
                                 query ? `${searchResults.rooms.length} Rooms available for ${query}` : 
                                 `${rooms.length} Rooms available`}
                            </p>
                            {error && <span style={{ color: 'red' }}>{error}</span>}
                        </div>

                        <AuthWrapper fallback={!query ? <Link className="btn btn--main" href="/login">Login to Create Room</Link> : null}>
                            {!query && (
                                <Link className="btn btn--main" href="/create-room">
                                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                                    <title>add</title>
                                    <path
                                        d="M16.943 0.943h-1.885v14.115h-14.115v1.885h14.115v14.115h1.885v-14.115h14.115v-1.885h-14.115v-14.115z"
                                    ></path>
                                    </svg>
                                    {rooms.length === 0 ? 'Create First Room' : 'Create Room'}
                                </Link>
                            )}
                        </AuthWrapper>
                    </div>

                    {/* Feed Component */}
                    <div>
                        <FeedComponent 
                            roomsList={query ? searchResults.rooms : rooms} 
                            query={query}
                            loading={loading}
                        />
                    </div>
                </div>
                {/* Room List End */}

                {/* Activity Component */}
                <div>
                    <ActivityComponent 
                        messageList={messages}
                        query={query}
                        loading={loading}
                    />
                </div>
            </div>
        </main>
    );
}

export default function HomePage() {
    return(
        <div>
            <NavBar />
            <Suspense fallback={<div>Loading...</div>}>
                <HomePageContent />
            </Suspense>
        </div>
    );
}