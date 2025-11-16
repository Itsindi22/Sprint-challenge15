const request = require('supertest');
const server = require('./server');
const db = require('../data/dbConfig');

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

afterAll(async () => {
  await db.destroy();
});

describe('Auth endpoints', () => {
  const user = { username: 'tester', password: 'password123' };

  test('[POST] /api/auth/register creates a new user', async () => {
    const res = await request(server)
      .post('/api/auth/register')
      .send(user);
    expect(res.status).toBe(201);
    expect(res.body.username).toBe(user.username);
  });

  test('[POST] /api/auth/login returns a token on valid credentials', async () => {
    await request(server).post('/api/auth/register').send(user);
    const res = await request(server)
      .post('/api/auth/login')
      .send(user);
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});

describe('Jokes endpoint', () => {
  test('[GET] /api/jokes without token returns 401', async () => {
    const res = await request(server).get('/api/jokes');
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/token required/i);
  });

  test('[GET] /api/jokes with token returns jokes', async () => {
    const user = { username: 'user2', password: 'pass2' };
    await request(server).post('/api/auth/register').send(user);
    const loginRes = await request(server)
      .post('/api/auth/login')
      .send(user);

    const token = loginRes.body.token;

    const res = await request(server)
      .get('/api/jokes')
      .set('Authorization', token);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
