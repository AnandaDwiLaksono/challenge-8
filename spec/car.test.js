const request = require('supertest');
const app = require('../app/index');
const models = require('../app/models');
const Car = models.Car;

let token = '';

beforeAll(async () => {
    const credentialsLogin = {
        email: 'johnny@binar.co.id',
        password: '123456'
    };

    const response = await request(app).post('/v1/auth/login').send(credentialsLogin);

    token = response.body.accessToken;
})


describe('GET /', () => {
    it('return 200 ok', (done) => {
        request(app)
        .get('/')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, done);
    });
});

describe('GET /v1/cars', () => {
    it('return 200 ok', (done) => {
        request(app)
        .get('/v1/cars')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, done);
    });
});

describe('POST /v1/cars', () => {
    it('return 201 created', async () => {
        const payload = {
            name: "Pajero",
            price: 400000,
            size: "medium",
            image: "www.google.com"
        };

        await request(app)
        .post('/v1/cars')
        .set({Authorization: `Bearer ${token}`})
        .send(payload)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(201);
    });
});

describe('PUT /v1/cars/:id',() => {
    it('return 200 updated', async () => {
        const payloadCreate = {
            name: "CRV",
            price: 250000,
            size: "medium",
            image:"www.google.com"
        };

        const payloadUpdate = {
            name: "CRV Gen 1",
            price: 250000,
            size: "medium",
            image: "www.google.com"
        };

        const car = await Car.create(payloadCreate);

        await request(app)
        .put('/v1/cars/' + car.id)
        .set({Authorization: `Bearer ${token}`})
        .send(payloadUpdate)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
    });
});

describe('DELETE /v1/cars/:id', () => {
    it('respond 204 deleted', async () => {
        const car = await Car.create({
            name: "Xpander",
            price: 400000,
            size: "medium",
            image:"www.google.com",
            isCurrentlyRented: false,
            createdAt: new Date,
            updatedAt: new Date
        });

        await request(app)
        .delete('/v1/cars/' + car.id)
        .set({Authorization: `Bearer ${token}`})
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(204);
    });
});
