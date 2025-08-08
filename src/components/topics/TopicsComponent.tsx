import Link from "next/link";

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
    topics: Topic[];
    rooms: Room[];
    query?: string;
};

export default function TopicsComponent({ topics, rooms, query }: TopicsComponentProps) {
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
            <div className="topics">
                <div className="topics__header">
                    <h2>{query ? `No topics found for "${query}"` : "No Topics Yet"}</h2>
                </div>
                <div className="empty-topics">
                    <p>Be the first to create a topic!</p>
                </div>
            </div>
        );
    }

    return(
        <div className="topics">
            <div className="topics__header">
                <h2>{query ? `Topics matching "${query}"` : "Browse Topics"}</h2>
            </div>
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
    );
}