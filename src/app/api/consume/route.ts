import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  let timeout: NodeJS.Timeout | null = null;

  const stream = await prisma.user.stream({
    name: "user-create-events",
    create: {},
  });

  const resetTimeout = () => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      console.log("No events for 5 seconds. Stopping stream.");
      stream.cancel(); // Stop the generator
    }, 5000); // 5-second timeout
  };

  // Initialize the timeout before the loop
  resetTimeout();

  try {
    for await (const event of stream) {
      console.log(event); // Do something with the event
      resetTimeout(); // Reset the timeout with each new event
    }
  } catch (error) {
    console.error("Error consuming events:", error);
  } finally {
    if (timeout) {
      clearTimeout(timeout);
    }
  }

  return new Response("Finished consuming queued events.");
}
