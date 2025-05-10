import Link from "next/link";
import { fetchFromDjango } from "@/lib/api";

export default async function TopicsComponent() {
    const topics = await fetchFromDjango('api/topics/');

    return(
        <div className="topics">
            <div className="topics__header">
                <h2>Browse Topics</h2>
            </div>
            <ul className="topics__list">
                <li>
                    <Link href="/" className="active">All <span>100 Rooms</span></Link>
                </li>

                {/* {% for topic in topics %} */}
                    <li>
                        <Link href="/">Topic Name<span>10 Rooms</span></Link>
                    </li>
                {/* {% endfor %} */}
            </ul>
            <Link className="btn btn--link" href="/search-topics">
                More
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                    <title>chevron-down</title>
                    <path d="M16 21l-13-13h-3l16 16 16-16h-3l-13 13z"></path>
                </svg>
            </Link>
        </div>
    );
}