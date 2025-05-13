import Link from "next/link";
import { fetchFromDjango } from "@/lib/api";

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
    type TopicsComponentProps = {
        searchParams: { q?: string }; 
    };

export default async function TopicsComponent({ searchParams }: TopicsComponentProps) {
    const query = searchParams.q;

    // Fetch both topics and rooms
    const [topics, rooms] = await Promise.all([
        fetchFromDjango(query ? `api/search/?q=${query}` : 'api/topics/'),
        fetchFromDjango(query ? `api/search/?q=${query}` : 'api/rooms/')
    ]);

    // Handle search results or normal data
    const displayRooms = query ? rooms?.rooms || [] : rooms;
    const displayTopics = query ? topics?.topics || [] : topics;

    // Calculate room counts for each topic
    const topicCounts: TopicCounts = {};
    displayRooms.forEach((room: Room) => {
        const topicName = room.topic?.name;
        if (topicName) {
            topicCounts[topicName] = (topicCounts[topicName] || 0) + 1;
        }
    });

    // Remove duplicate topics and filter by search if needed
    const uniqueTopics = [
        ...new Map(
            displayTopics
                .filter((topic: Topic) => !query || topic.name.toLowerCase().includes(query.toLowerCase()))
                .map((topic: Topic) => [topic.name, topic])
        ).values()
    ] as Topic[];

    return(
        <div className="topics">
            <div className="topics__header">
                <h2>{query ? `Topics matching "${query}"` : "Browse Topics"}</h2>
            </div>
            <ul className="topics__list">
                <li>
                    <Link href="/" className={!query ? `active` : ''}>All <span>{displayRooms.length}</span></Link>
                </li>

                {uniqueTopics.map((topic: Topic) => (
                    <li key={topic.id}>
                        <Link href={`/?q=${topic.name.toLocaleLowerCase()}`} 
                        className={query === topic.name ? 'active' : ''}>{topic.name}<span>{topicCounts[topic.name] || 0}</span></Link>
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
    );
}