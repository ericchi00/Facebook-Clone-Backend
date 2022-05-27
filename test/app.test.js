/* eslint-disable no-undef */
import request from 'supertest';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import app from '../app.js';

let token = '';
beforeAll(async () => {
	token = jwt.sign(
		{ id: '62901c6cecb70001f9935570', email: 'test@test.com' },
		process.env.JWT_TOKEN,
		{
			expiresIn: '1h',
		}
	);
});

afterAll(() => {
	// Closing the DB connection allows Jest to exit successfully.
	mongoose.disconnect();
});

test('it should handle 404 error', (done) => {
	request(app).get('/error').expect(404, done);
});

test('it should respond with 401, unauthorized,', (done) => {
	request(app).get('/users/profile/629006235a505c6db4f60107').expect(401, done);
});

test('login returns 200', (done) => {
	request(app)
		.post('/users/login')
		.send({ email: 'test@test.com', password: 'test@test.com' })
		.expect(200, done);
});

test('it should return profile json data', (done) => {
	request(app)
		.get('/users/profile/629006235a505c6db4f60107')
		.set('Authorization', `Bearer ${token}`)
		.expect(200, done);
});
