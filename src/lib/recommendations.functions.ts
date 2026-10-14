import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";

export const recommendStay = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => z.object({ needs: z.string().trim().min(10).max(1500) }).parse(data))
  .handler(async ({ data }) => {
    const { getHotelRecommendations } = await import("./recommendations.server");
    return getHotelRecommendations(data.needs, getRequest());
  });