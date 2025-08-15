import NavBar from "@/components/navbar/NavBar";
import TopicsComponent from "@/components/topics/TopicsComponent";
import { fetchFromDjango } from "@/lib/api";
import { Suspense } from "react";


// Types Declaration
type TopicsPageProps = {
    searchParams: Promise<{ q?: string }>; 
};

type Topic = {
    id: string | number;
    name: string;
};

type Room = {
    id: string | number;
    host: {id: string | number, avatar: string, username: string};
    participants: {length: number};
    topic: {name: string};
    created: string;
    name: string;
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
    return(
        <Suspense fallback={<div>Loading topics...</div>}>
            <div><NavBar /></div>
            <div>
                <TopicsComponent 
                    topics={query ? searchResults.topics || [] : topics}
                    rooms={query ? searchResults.rooms : rooms}
                    query={query}
                />
            </div>
        </Suspense>
    )
}