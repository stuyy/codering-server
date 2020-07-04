import supertest from 'supertest';
import server from '../../src/app';
const request = supertest(server);


describe('testing organization endpoint', () => {

  beforeEach((done) => done());

  it('calls organization endpoint when not authorized', async () => {
    const res = await request.get('/api/github/organizations');
    expect(res.status).toBe(403);
  });

})