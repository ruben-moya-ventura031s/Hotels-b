const request = require('supertest')
const app = require('../app')

let id;
let token;

beforeAll(async () => {
    const res = await request(app).post('/users/login').send({
        email: "test@gmail.com", 
        password: "test1234", 
    })
    token = res.body.token
})

test('GET/ hotels debe retornar todo los hotels ', async () => {
    const res = await request(app).get('/hotels')
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
});

test('POST/ hotels debe retornar el elemento creado', async () => {
    const body = {
    name: "test",
    description: "test",
    Price: 743,
    Address: "test",
    lat: 48.875838090473664,
    lon: 2.300348641089383
    }
    const res = await request(app).post('/hotels').send(body).set('Authorization', `Bearer ${token}`)
    id = res.body.id
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.name).toBe(body.name);
});

test('PUT/ hotels/:id debe retornar el elemento modificado por su id', async () => {
    const body = {
        Address: "test"
    }
    const res = await request(app).put(`/hotels/${id}`).send(body).set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200);
    expect(res.body.Address).toBe(body.Address);
});

test('DELETE/ hotels/:id eliminara los elemnetos segun su id', async () => {
    const res = await request(app).delete(`/hotels/${id}`).set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(204);
});