import { Hono } from "hono";
import { getLastPlayed } from "./lastfm";
import { cors } from "hono/cors";

type Bindings = {
  LASTFM_API_KEY: string;
  LASTFM_USER: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use(
  cors({
    origin: "*",
    allowMethods: ["GET"],
  })
);

app.get("/json", async (c) => {
  const track = await getLastPlayed(c.env.LASTFM_USER, c.env.LASTFM_API_KEY);
  if (!track) {
    return c.json(
      { error: "Failed to fetch last played track" },
      { status: 500 }
    );
  }

  return c.json(track, {
    headers: {
      "Cache-Control": "public, max-age=30, stale-while-revalidate",
    },
  });
});

export default app;
