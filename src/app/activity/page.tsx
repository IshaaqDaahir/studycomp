import ActivityComponent from "@/components/activity/ActivityComponent";
import { fetchFromDjango } from "@/lib/api";
import { Suspense } from "react";
import NavBar from "@/components/navbar/NavBar";

// Types Declaration
type ActivityPageProps = {
    searchParams: Promise<{ q?: string }>; 
};

type Message = {
    id: string | number;
    name: string;
    user: {id: number, avatar: string, username: string};
    created: string;
    room: {name: string, id: number};
    body: string;
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
    return(
        <Suspense fallback={<div>Loading activities...</div>}>
            <div><NavBar /></div>
            <div>
                <ActivityComponent 
                    messageList={searchResult.messages}
                    query={query} 
                />
            </div>
        </Suspense>
    )
}