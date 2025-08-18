import Link from "next/link";
import { fetchFromDjango } from "@/lib/api";
import Form from "next/form";
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
    type SearchTopicsComponentProps = {
        searchParams: { q?: string }; 
    };

export default async function SearchTopicsComponent({ searchParams }: SearchTopicsComponentProps) {
    const passedQuery = await searchParams;
    const query = passedQuery.q;

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

    return (
        <Suspense fallback={<div>Please be patient...</div>}>
            <main className="create-room layout">
                <div className="container">
                    <div className="layout__box">
                        <div className="layout__boxHeader">
                            <div className="layout__boxTitle">
                                <Link href="/">
                                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                                        <title>arrow-left</title>
                                        <path
                                        d="M13.723 2.286l-13.723 13.714 13.719 13.714 1.616-1.611-10.96-10.96h27.625v-2.286h-27.625l10.965-10.965-1.616-1.607z"
                                        ></path>
                                    </svg>
                                </Link>
                                <h3>{query ? `Topics matching "${query}"` : "Browse Topics"}</h3>
                            </div>
                        </div>
                
                        <div className="topics-page layout__body">
                            <Form className="header__search" action="">
                                <label>
                                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                                    <title>search</title>
                                    <path
                                    d="M32 30.586l-10.845-10.845c1.771-2.092 2.845-4.791 2.845-7.741 0-6.617-5.383-12-12-12s-12 5.383-12 12c0 6.617 5.383 12 12 12 2.949 0 5.649-1.074 7.741-2.845l10.845 10.845 1.414-1.414zM12 22c-5.514 0-10-4.486-10-10s4.486-10 10-10c5.514 0 10 4.486 10 10s-4.486 10-10 10z"
                                    ></path>
                                </svg>
                                <input name="q" placeholder="Search for topics" />
                                </label>
                            </Form>
                    
                            <ul className="topics__list">
                                <li>
                                    <Link href="/search-topics" className={!query ? `active` : ''}>All <span>{displayRooms.length}</span></Link>
                                </li>
                    
                                {uniqueTopics.map((topic: Topic) => (
                                    <li key={topic.id}>
                                        <Link href={`/?q=${topic.name.toLocaleLowerCase()}`}
                                        className={query === topic.name ? 'active' : ''}>{topic.name} <span>{topicCounts[topic.name] || 0}</span></Link>
                                    </li>
                                ))}    
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
        </Suspense>
    )
}