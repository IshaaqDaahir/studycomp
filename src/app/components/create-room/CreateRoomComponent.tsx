import RoomFormComponent from "../room-form/RoomFormComponent";
import { fetchFromDjango } from "@/lib/api";

export default async function CreateRoomComponent() {
  const topics = await fetchFromDjango('api/topics/');
  
  return <RoomFormComponent topics={topics} />;
}