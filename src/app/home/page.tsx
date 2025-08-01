import TopicsComponent from "@/app/components/topics/TopicsComponent";
import FeedComponent from "@/app/components/feed/FeedComponent";
import Link from "next/link";
import { Suspense } from 'react';
import { fetchFromDjango } from "@/lib/api";
import ActivityComponent from "../components/activity/ActivityComponent";

// Types Declaration
    type TopicsComponentProps = {
        searchParams: { q?: string }; 
    };

export default async function HomePage({ searchParams }: TopicsComponentProps) {
    const rooms = await fetchFromDjango('api/rooms/');
    
    const passedQuery = await searchParams;
    const query = passedQuery.q || '';
    const searchResults = query
        ? await fetchFromDjango(`api/search/?q=${query}`)
        : "No room matches your search!";
    
    return(
        <Suspense fallback={<div>Loading dashboard...</div>}>
            <main className="layout layout--3">
                <div className="container">
                
                {/* Topics Component with search results */}
                <Suspense fallback={<div>Loading topics...</div>}>
                    <div><TopicsComponent searchParams={searchParams} /></div>
                </Suspense>
                    
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
                            <Link className="btn btn--main btn--pill" href="/topics">Browse Topics</Link>
                            <Link className="btn btn--main btn--pill" href="/activity">Recent Activities</Link>
                        </div>
                    </div>

                    <div className="roomList__header">
                        <div>
                            <h2>Study Room</h2>
                            <p>{query ? `${searchResults?.rooms.length} Rooms available for ${query}` : `${rooms.length} Rooms available`}</p>
                        </div>

                        {query ? '' : <Link className="btn btn--main" href="/create-room">
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                            <title>add</title>
                            <path
                                d="M16.943 0.943h-1.885v14.115h-14.115v1.885h14.115v14.115h1.885v-14.115h14.115v-1.885h-14.115v-14.115z"
                            ></path>
                            </svg>
                            Create Room
                        </Link>}
                    </div>

                    {/* Feed Component with search results */}
                    <Suspense fallback={<div>Loading rooms...</div>}>
                        <div><FeedComponent roomsList={searchResults?.rooms} query={query} /></div>
                    </Suspense>
                </div>
                {/* Room List End */}

                {/* Activity Component with search results */}
                <Suspense fallback={<div>Loading messages...</div>}>
                    <div><ActivityComponent 
                        messageList={searchResults?.messages || []}
                        query={query} />
                    </div>
                </Suspense>
                </div>
            </main>
        </Suspense>
    );
}