'use strict';

const { createTestBuilder } = require('../../../../test/helpers/builder');
const { createStrapiInstance } = require('../../../../test/helpers/strapi');
const { createAuthRequest } = require('../../../../test/helpers/request');

const builder = createTestBuilder();
let strapi;
let rq;

const ct = {
  name: 'withpassword',
  attributes: {
    field: {
      type: 'password',
    },
  },
};

describe('Test type password', () => {
  beforeAll(async () => {
    await builder.addContentType(ct).build();

    strapi = await createStrapiInstance({ ensureSuperAdmin: true });
    rq = await createAuthRequest({ strapi });
  }, 60000);

  afterAll(async () => {
    await strapi.destroy();
    await builder.cleanup();
  }, 60000);

  test('Create entry with value input JSON', async () => {
    const res = await rq.post('/content-manager/explorer/application::withpassword.withpassword', {
      body: {
        field: 'somePassword',
      },
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.field).toBeUndefined();
  });

  test.todo('Should be private by default');

  test('Create entry with value input Formdata', async () => {
    const res = await rq.post('/content-manager/explorer/application::withpassword.withpassword', {
      body: {
        field: '1234567',
      },
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.field).toBeUndefined();
  });

  test('Reading entry returns correct value', async () => {
    const res = await rq.get('/content-manager/explorer/application::withpassword.withpassword');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    res.body.forEach(element => {
      expect(element.field).toBeUndefined();
    });
  });

  test('Updating entry sets the right value and format', async () => {
    const res = await rq.post('/content-manager/explorer/application::withpassword.withpassword', {
      body: {
        field: 'somePassword',
      },
    });

    const updateRes = await rq.put(
      `/content-manager/explorer/application::withpassword.withpassword/${res.body.id}`,
      {
        body: {
          field: 'otherPwd',
        },
      }
    );

    expect(updateRes.statusCode).toBe(200);
    expect(updateRes.body).toMatchObject({
      id: res.body.id,
    });
    expect(res.body.field).toBeUndefined();
  });
});
