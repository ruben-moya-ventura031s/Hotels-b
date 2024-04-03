const request = require('supertest')
const app = require('../app')

let id;
let token;

test('POST/ users debe retornar el elemento creado', async () => {
    const body = {
        firstName: "Micael", 
        lastName: "Moya", 
        email: "miki123.2013@gmail.com", 
        password: "miki1234", 
        gender: "MALE"
    }
    const res = await request(app).post('/users').send(body)
    id = res.body.id
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.firstName).toBe(body.firstName);
});

test('POST / users/login debe hacer un login', async () => {
    const body = {
        email: "miki123.2013@gmail.com", 
        password: "miki1234"
    }
    const res = await request(app).post('/users/login').send(body)
    token = res.body.token
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe(body.email);
});

test('GET/ users debe retornar todo los usuarios ', async () => {
    const res = await request(app).get('/users').set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
});

test('PUT/ users/:id debe retornar el elemento modificado por su id', async () => {
    const body = {
        firstName: "Micael actializado", 
    }
    const res = await request(app).put(`/users/${id}`).send(body).set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200);
    expect(res.body.firstName).toBe(body.firstName);
});



test('POST / users/login debe dar credenciales incorecta un error', async () => {
    const body = {
        email: "isaac@gmail.com", 
        password: "isaac1234"
    }
    const res = await request(app).post('/users/login').send(body)
    expect(res.status).toBe(401);
});

test('DELETE/ users/:id se eliminar los elementos segun su id', async () => {
    const res = await request(app).delete(`/users/${id}`).set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(204);
});