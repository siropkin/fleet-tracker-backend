import { Elysia } from 'elysia';
import parsePositionsBody from '../utils/parsePositionsBody';

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
      ctx.log.debug({ status: response.status }, response.statusText);
      ctx.set.status = response.status;
      throw new Error(response.statusText);
    }
    const body = await response.text();
    const bodyJson = JSON.parse(body);
    const {
      url: _,
      title,
      course,
      teams,
      start,
      stop,
      tags,
      logo,
      ...other
    } = bodyJson;
    return {
      id: bodyJson.url,
      title: bodyJson.title,
      course: bodyJson.course,
      teams: bodyJson.teams,
      start: bodyJson.start,
      stop: bodyJson.stop,
      tags: bodyJson.tags,
      logo: bodyJson.logo,
      other,
    };
  })
  .get('/:id/leaderboard', async (ctx) => {
    ctx.log.debug(ctx.request, 'Request');
    const url = `https://yb.tl/JSON/${ctx.params.id}/leaderboard`;
    ctx.log.debug({ url }, 'Fetching YB');
    const response = await fetch(url);
    if (response.status !== 200) {
      ctx.log.debug({ status: response.status }, response.statusText);
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
      ctx.log.debug({ status: response.status }, response.statusText);
      ctx.set.status = response.status;
      throw new Error(response.statusText);
    }
    const body = await response.arrayBuffer();
    const parsedBody = parsePositionsBody(body);
    // sort by moments
    parsedBody.forEach((position) => {
      position.moments.sort((a, b) => a.at - b.at);
    });
    return parsedBody;
  })
  .get('/:id/teams-positions-latest', async (ctx) => {
    ctx.log.debug(ctx.request, 'Request');
    const url = `https://yb.tl/BIN/${ctx.params.id}/LatestPositions3`;
    ctx.log.debug({ url }, 'Fetching YB');
    const response = await fetch(url);
    if (response.status !== 200) {
      ctx.log.debug({ status: response.status }, response.statusText);
      ctx.set.status = response.status;
      throw new Error(response.statusText);
    }
    const body = await response.arrayBuffer();
    const parsedBody = parsePositionsBody(body);
    // sort by moments
    parsedBody.forEach((position) => {
      position.moments.sort((a, b) => a.at - b.at);
    });
    return parsedBody;
  });

export default races;
