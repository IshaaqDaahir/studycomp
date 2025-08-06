import RoomFormComponent from "../../components/room-form/RoomFormComponent";
import { fetchFromDjango } from "@/lib/api";

export default async function CreateRoomComponent() {
  let topics = [];
  try {
    topics = await fetchFromDjango('api/topics/');
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error fetching topics:', error.message);
    } else {
      console.error('Error fetching topics:', error);
    }
  }
  return <RoomFormComponent topics={topics} />;
}