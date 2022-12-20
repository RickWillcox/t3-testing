import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const exampleRouter = router({
  hello: publicProcedure
    .input(z.object({ text: z.string().nullish() }).nullish())
    .query(({ input }) => {
      return {
        greeting: `Hello ${input?.text ?? "world"}`,
      };
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),
  appendName: publicProcedure
    .input(z.object({ name: z.string().nullish() }))
    .query(({ input }) => {
      const coolThingsToPutAfterAName: string[] = [
        "The Fearless",
        "The Unstoppable",
        "The Intrepid",
        "The Indomitable",
        "The Maverick",
        "The Trailblazer",
        "The Dynamo",
        "The Titan",
        "The Renegade",
        "The Virtuoso",
      ];
      if (!input.name) return { name: "" };
      return {
        name: `${input.name} ${
          coolThingsToPutAfterAName[
            Math.floor(Math.random() * coolThingsToPutAfterAName.length)
          ]
        }`,
      };
    }),
});
