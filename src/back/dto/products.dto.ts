import createDebug from 'debug';
const debug = createDebug('products:dto:product');
debug('Loaded module');

import { z } from 'zod';

export const ProductCreateDTO = z
    .object({
        name: z.string().min(3).nonempty(),
        description: z.string(),
        category: z.string().nonempty(),
        price: z.number().int().positive(),
        poster: z.string().url(),
        hasPromo: z.boolean(),
    })
    .strict(); // satisfies z.Schema<Prisma.FilmCreateInput>;

// extract the inferred type
export type FilmCreateDTO = z.infer<typeof ProductCreateDTO>;
