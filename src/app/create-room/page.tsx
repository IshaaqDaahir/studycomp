import RoomFormComponent from "../../components/room-form/RoomFormComponent";
import { fetchFromDjango } from "@/lib/api";

export default async function CreateRoomPage() {
  let topics = [];
  try {
    const response = await fetchFromDjango('api/topics/');

    // Handle both array and paginated responses
    topics = Array.isArray(response) 
      ? response 
      : response?.results || [];

  } catch (error: unknown) {
    console.error('Error fetching topics:', 
      error instanceof Error ? error.message : error
    );
  }
  return <RoomFormComponent topics={topics} />;
}