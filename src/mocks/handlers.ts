import { rest } from 'msw';

// Mock Data
export const suggestions = [
  'Shoemaker',
  'Show Band',
  'Shoe Store',
  'Retail Shop',
  'Beachwear Shop',
  'Clothing Shop',
  'Accessories Shop',
  'Barber Shop',
  'Gift Shop',
  'Online Beachwear Shop',
];

export const handlers = [
  rest.post('https://ai-qa-wizard-text-similarity-dev-yls6dto53q-uc.a.run.app/inference', async (req, res, ctx) => {
    console.log(req);
    const body = await req.json();
    if (body?.input === 'failme') {
      return res(ctx.status(400, 'Failed successfully'));
    }
    return res(ctx.status(200), ctx.json(suggestions));
  }),
];
