// app/api/recommendations/route.ts

import { NextResponse } from "next/server";

const API_KEY = process.env.NEXT_PUBLIC_TICKETMASTER_KEY;

export async function POST(req: Request) {
  try {
    const { genres } = await req.json();

    if (!genres || !Array.isArray(genres)) {
      return NextResponse.json({ error: "Genres are required" }, { status: 400 });
    }

    const genreIds: string[] = [];

    // Step 1: Get genre IDs
    for (const genre of genres) {
      const encoded = encodeURIComponent(genre);
      const res = await fetch(
        `https://app.ticketmaster.com/discovery/v2/classifications.json?apikey=${API_KEY}&keyword=${encoded}`
      );
      const data = await res.json();
      const classifications = data._embedded?.classifications ?? [];

      classifications.forEach((classification: any) => {
        const genreList = classification.segment?._embedded?.genres ?? [];
        genreList.forEach((g: any) => {
          if (!genreIds.includes(g.id)) genreIds.push(g.id);
        });
      });
    }

    // Step 2: Fetch events
    const allEvents: any[] = [];
    for (const id of genreIds) {
      const eventRes = await fetch(
        `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${API_KEY}&size=1&genreId=${id}`
      );
      const eventData = await eventRes.json();
      const events = eventData._embedded?.events ?? [];
      allEvents.push(...events);
    }

    return NextResponse.json({ events: allEvents });
  } catch (error) {
    console.error("Error in /api/recommendations:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
