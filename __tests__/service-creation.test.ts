import { createService } from '@/actions/service-actions';
import { ServiceFormData } from '@/app/(protected)/services/new/validations/service-form.validation';
import { createService as createServiceAPI } from '@/app/(protected)/services/services.api';

// Mock the auth function to return a session
jest.mock('@/auth', () => ({
  auth: jest.fn().mockResolvedValue({
    user: { id: '1', supplierId: '1' }, // Assuming user ID 1 is a valid supplier
  }),
}));

// Mock the createServiceAPI function
jest.mock('@/app/(protected)/services/services.api', () => ({
  createService: jest.fn().mockResolvedValue({ success: true }),
}));

describe('createService Action', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should create a service successfully with valid data', async () => {
    // Arrange
    const mockData: ServiceFormData = {
        name: 'Test Service',
        description: 'This is a test service with a description long enough to pass validation.',
        serviceType: 'Tour',
        serviceCategory: 'Adventure',
        sizeTour: 10,
        ytLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        images: {
          imgBanner: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
          imgAlbum: [
            'https://res.cloudinary.com/demo/image/upload/sample.jpg',
            'https://res.cloudinary.com/demo/image/upload/sample.jpg',
            'https://res.cloudinary.com/demo/image/upload/sample.jpg',
          ],
        },
        price: 100,
        dates: [{ startDate: '2025-12-01', endDate: '2025-12-07', price: 120 }],
        stateFrom: 'Jalisco',
        cityFrom: 'Guadalajara',
        stateTo: 'Quintana Roo',
        cityTo: 'Cancun',
        transportProviderID: '1',
        hotelProviderID: '1',
        packs: [{ name: 'Basic', description: 'Basic package', qty: 1, price: 100 }],
        itinerary: [{ id: 1, title: 'Arrival', date: '2025-12-01', time: '14:00', description: 'Arrival at the hotel', location: 'Hotel' }],
        includes: ['Flight', 'Hotel'],
        excludes: ['Meals'],
        faqs: [{ id: '1', question: 'Is breakfast included?', answer: 'Yes, breakfast is included.' }],
    };

    // Act
    const result = await createService(mockData);

    // Assert
    expect(result).toEqual({ success: 'Service created successfully!' });
    expect(createServiceAPI).toHaveBeenCalledTimes(1);
    const serviceData = (createServiceAPI as jest.Mock).mock.calls[0][0];
    expect(serviceData.supplierId).toBe(1);
    expect(serviceData.name).toBe('Test Service');
  });

  it('should return an error if validation fails', async () => {
    // Arrange
    const invalidData = { name: '' } as unknown as ServiceFormData; // Invalid data

    // Act
    const result = await createService(invalidData);

    // Assert
    expect(result).toEqual({ error: 'Invalid fields!' });
    expect(createServiceAPI).not.toHaveBeenCalled();
  });
});
