'use client';

import Link from "next/link";
import { useAuth } from "@/context/auth";
import AuthWrapper from "../AuthWrapper";

interface MessageDeleteButtonProps {
  messageUserId: number;
  deleteUrl: string;
}

export default function MessageDeleteButton({ 
  messageUserId, 
  deleteUrl 
}: MessageDeleteButtonProps) {
  const { user } = useAuth();

  // Only show delete button if user owns the message
  if (!user || user.id !== messageUserId) {
    return null;
  }

  return (
    <AuthWrapper>
      <Link href={deleteUrl}>
        <div className="thread__delete">
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
            <title>Delete Message</title>
            <path
              d="M27.314 6.019l-1.333-1.333-9.98 9.981-9.981-9.981-1.333 1.333 9.981 9.981-9.981 9.98 1.333 1.333 9.981-9.98 9.98 9.98 1.333-1.333-9.98-9.98 9.98-9.981z"
            ></path>
          </svg>
        </div>
      </Link>
    </AuthWrapper>
  );
}