import { Elysia } from 'elysia';
import parsePositions from '../utils/parsePositions';

const races = new Elysia()
  .get('/', (ctx) => {
    ctx.log.debug(ctx.request, 'Request');
    return { status: 'ok' };
  })
  .get('/:id/setup', async (ctx) => {
    ctx.log.debug(ctx.request, 'Request');
    const url = `https://yb.tl/JSON/${ctx.params.id}/RaceSetup`;
    ctx.log.debug({ url }, 'Fetching YB');
    const response = await fetch(url);
    if (response.status !== 200) {
      ctx.set.status = response.status;
      throw new Error(response.statusText);
    }
    const body = await response.text();
    const bodyJson = JSON.parse(body);
    const { url: _, course, teams, start, stop, tags, ...other } = bodyJson;
    return {
      id: bodyJson.url,
      course: bodyJson.course,
      teams: bodyJson.teams,
      start: bodyJson.start,
      stop: bodyJson.stop,
      tags: bodyJson.tags,
      other,
    };
  })
  .get('/:id/leaderboard', async (ctx) => {
    ctx.log.debug(ctx.request, 'Request');
    const url = `https://yb.tl/JSON/${ctx.params.id}/leaderboard`;
    ctx.log.debug({ url }, 'Fetching YB');
    const response = await fetch(url);
    if (response.status !== 200) {
      ctx.set.status = response.status;
      throw new Error(response.statusText);
    }
    const body = await response.text();
    return JSON.parse(body);
  })
  .get('/:id/teams-positions-all', async (ctx) => {
    ctx.log.debug(ctx.request, 'Request');
    const url = `https://yb.tl/BIN/${ctx.params.id}/AllPositions3`;
    ctx.log.debug({ url }, 'Fetching YB');
    const response = await fetch(url);
    if (response.status !== 200) {
      ctx.set.status = response.status;
      throw new Error(response.statusText);
    }
    const body = await response.arrayBuffer();
    return parsePositions(body);
  })
  .get('/:id/teams-positions-latest', async (ctx) => {
    ctx.log.debug(ctx.request, 'Request');
    const url = `https://yb.tl/BIN/${ctx.params.id}/LatestPositions3`;
    ctx.log.debug({ url }, 'Fetching YB');
    const response = await fetch(url);
    if (response.status !== 200) {
      ctx.set.status = response.status;
      throw new Error(response.statusText);
    }
    const body = await response.arrayBuffer();
    return parsePositions(body);
  });

export default races;
