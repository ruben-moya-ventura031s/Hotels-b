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

test('GET/ reviews debe retornar todo los reviews ', async () => {
    const res = await request(app).get('/reviews').set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200);
});

test('POST/ reviews debe retornar el elemento creado', async () => {
    const body = {
        rating: 5,
        comment: "hola soy un test"
    }
    const res = await request(app).post('/reviews').send(body).set('Authorization', `Bearer ${token}`)
    id = res.body.id
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.comment).toBe(body.comment);
});

test('PUT/ reviews/:id debe retornar el elemento modificado por su id', async () => {
    const body = {
        comment: "hola soy un test"
    }
    const res = await request(app).put(`/reviews/${id}`).send(body).set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200);
    expect(res.body.comment).toBe(body.comment);
});

test('DELETE/ reviews/:id eliminara los elemnetos segun su id', async () => {
    const res = await request(app).delete(`/reviews/${id}`).set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(204);
});