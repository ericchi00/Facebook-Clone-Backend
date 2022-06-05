/* eslint-disable no-undef */
import request from 'supertest';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import app from '../app.js';

let token = '';
beforeAll(async () => {
	token = jwt.sign(
		{ id: '62991a74a96aa84ad9dd9b6d', email: 'luffy@luffy.com' },
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
	request(app).get('/api/profile/62991a74a96aa84ad9dd9b6d').expect(401, done);
});

test('login returns 500', (done) => {
	request(app)
		.post('/auth/login')
		.send({ email: 'test@test.com', password: 'test@test.com' })
		.expect(500, done);
});

test('it should return profile json data', (done) => {
	request(app)
		.get('/api/profile/62991a74a96aa84ad9dd9b6d')
		.set('Authorization', `Bearer ${token}`)
		.expect(200, done);
});

test('it should return 200 when getting posts', (done) => {
	request(app)
		.get('/api/posts')
		.set('Authorization', `Bearer ${token}`)
		.expect(200, done);
});
