import NavBar from "@/components/navbar/NavBar";
import { fetchFromDjango } from "@/lib/api";
import Link from "next/link";
import { Suspense } from "react";

// Types Declaration
type Topic = {
    id: string | number;
    name: string;
};

type TopicCounts = {
    [key: string]: number;
};

type Room = {
    topic?: {name: string};
};

export default async function TopicsPage() {
    let topics: Topic[] = [];
    let rooms: Room[] = [];
    let errorMsg = '';
    
    // Fetch all data in parallel where possible
    try {
        // Fetch rooms and topics
        const [roomsResponse, topicsResponse] = await Promise.all([
            fetchFromDjango('api/rooms/'),
            fetchFromDjango('api/topics/')
        ]);

        // Handle paginated responses
        rooms = Array.isArray(roomsResponse) 
            ? roomsResponse 
            : roomsResponse?.results || [];
            
        topics = Array.isArray(topicsResponse) 
            ? topicsResponse 
            : topicsResponse?.results || [];
        }
    catch (error: unknown) {
        errorMsg = 'Error fetching initial data.';
        console.error(errorMsg, error);
    }

    // Calculate room counts for each topic
    const topicCounts: TopicCounts = {};
    rooms.forEach((room: Room) => {
        const topicName = room.topic?.name;
        if (topicName) {
            topicCounts[topicName] = (topicCounts[topicName] || 0) + 1;
        }
    });

    // Empty state
    if (topics.length === 0) {
        return (
            <div className="topics__mobile">
                <div className="empty-topics">
                    <p>Be the first to create a topic!</p>
                </div>
            </div>
        );
    }

    return(
        <Suspense fallback={<div>Loading topics...</div>}>
            <div><NavBar /></div>
            <div className="topics__mobile">
                <div className="topics__header__mobile">
                    <h2>Topics List</h2>
                </div>
                <div className="topics__list__mobile">
                    <ul className="topics__list">
                        <li>
                            <Link href="/" className="active">
                                All <span>{rooms.length}</span>
                            </Link>
                        </li>

                        {topics.map(topic => (
                            <li key={topic.id}>
                                <Link 
                                    href={`/?q=${topic.name.toLowerCase()}`} 
                                    className='active'
                                >
                                    {topic.name}
                                    <span>{topicCounts[topic.name] || 0}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <Link className="btn btn--link" href="/search-topics">
                        More
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                            <title>chevron-down</title>
                            <path d="M16 21l-13-13h-3l16 16 16-16h-3l-13 13z"></path>
                        </svg>
                    </Link>
                </div>
            </div>
        </Suspense>
    );
}