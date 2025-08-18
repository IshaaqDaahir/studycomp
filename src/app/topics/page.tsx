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

type TopicsPageProps = {
    searchParams: Promise<{ q?: string }>; 
};

export default async function TopicsPage({ searchParams }: TopicsPageProps) {
    let topics: Topic[] = [];
    let rooms: Room[] = [];
    let searchResults: { rooms: Room[]; topics?: Topic[] } = { 
            rooms: [], 
            topics: [] 
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
            searchResults = {
                rooms: Array.isArray(searchData?.rooms) 
                    ? searchData.rooms 
                    : searchData?.rooms?.results || [],
                topics: Array.isArray(searchData?.topics) 
                    ? searchData.topics 
                    : searchData?.topics?.results || []
            };
        } else {
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
    } catch (error: unknown) {
        errorMsg = query ? 'Error fetching search results.' : 'Error fetching initial data.';
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

    // Remove duplicate topics and filter by search if needed
    const uniqueTopics = [
        ...new Map(
            topics
                .filter(topic => !query || topic.name.toLowerCase().includes(query.toLowerCase()))
                .map(topic => [topic.name, topic])
        ).values()
    ] as Topic[];

    // Empty state
    if (uniqueTopics.length === 0) {
        return (
            <div className="topics__mobile">
                <div className="topics__header__mobile">
                    <h2>{query ? `No topics found for "${query}"` : "No Topics Yet"}</h2>
                </div>
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
                    <h2>{query ? `Topics matching "${query}"` : "Topics List"}</h2>
                </div>
                <div className="topics__list__mobile">
                    <ul className="topics__list">
                        <li>
                            <Link href="/" className={!query ? `active` : ''}>
                                All <span>{rooms.length}</span>
                            </Link>
                        </li>

                        {uniqueTopics.map(topic => (
                            <li key={topic.id}>
                                <Link 
                                    href={`/?q=${topic.name.toLowerCase()}`} 
                                    className={query === topic.name ? 'active' : ''}
                                >
                                    {topic.name}
                                    <span>{topicCounts[topic.name] || 0}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                    {!query && (
                        <Link className="btn btn--link" href="/search-topics">
                            More
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                                <title>chevron-down</title>
                                <path d="M16 21l-13-13h-3l16 16 16-16h-3l-13 13z"></path>
                            </svg>
                        </Link>
                    )}
                </div>
            </div>
        </Suspense>
    );
}