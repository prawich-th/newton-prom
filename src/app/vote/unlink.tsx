"use client";

import { disconnectVote } from "@/actions/voteActions";
import StylisedBtn from "@/components/stylisedBtn";

export default function UnlinkButton({ userId }: { userId: string }) {
  return (
    <StylisedBtn onClick={() => disconnectVote(userId)}>
      DEBUG: UNLINK YOUR VOTES
    </StylisedBtn>
  );
}
