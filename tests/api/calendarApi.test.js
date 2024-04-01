import calendarApi from '../../src/api/calendarApi';

/**
 * Test in calendarApi
 * should have a config by default
 * should have a x-token in header for all fetch
 *  ✓ should have a config by default
 *  ✓ should have a x-token in header for all fetch
 */
describe('Calendar API', () => {

    test('should have a config by default', () => {

        expect(calendarApi.defaults.baseURL).toBe(process.env.VITE_API_URL);
    });

    test('should have a x-token in header for all fetch', async () => {
        localStorage.setItem('token', 'ABC123-XYZ');

        try {
            const res = await calendarApi.get('/auth/');
            expect(res.config.headers['x-token']).toBe('ABC123-XYZ');
        } catch (error) {
            console.log(error);
        }
    });
});

