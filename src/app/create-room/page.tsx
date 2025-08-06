import RoomFormComponent from "../../components/room-form/RoomFormComponent";
import { fetchFromDjango } from "@/lib/api";

export default async function CreateRoomComponent() {
  let topics = [];
  try {
    topics = await fetchFromDjango('api/topics/');
  } catch (error: any) {
    // Optionally log error or show a message
    console.error('Error fetching topics:', error.message);
  }
  return <RoomFormComponent topics={topics} />;
}