import RoomFormComponent from "../../components/room-form/RoomFormComponent";
import { fetchFromDjango } from "@/lib/api";

export const dynamic = 'force-dynamic';

export default async function CreateRoomPage() {
  let topics = [];
  try {
    const response = await fetchFromDjango('api/topics/');

    // Handle both array and paginated responses
    topics = Array.isArray(response) 
      ? response 
      : response?.results || [];

  } catch {
    // Error fetching topics - silently handle for production
  }
  return <RoomFormComponent topics={topics} />;
}