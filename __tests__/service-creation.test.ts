import { createService } from '@/actions/service-actions';
import { serviceFormSchema, ServiceFormData } from '@/app/(protected)/services/new/validations/service-form.validation';
import { db } from '@/lib/db';
import { auth } from '@/auth';

// Mock the auth function to return a session
jest.mock('@/auth', () => ({
  auth: jest.fn().mockResolvedValue({
    user: { id: '1' }, // Assuming user ID 1 is a valid supplier
  }),
}));

// Mock the database
jest.mock('@/lib/db', () => ({
  db: {
    supplier: {
      findUnique: jest.fn(),
    },
    service: {
      create: jest.fn(),
    },
  },
}));

describe('createService Action', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should create a service successfully with valid data', async () => {
    // Arrange
    const mockSupplier = { id: 1, name: 'Test Supplier' };
    (db.supplier.findUnique as jest.Mock).mockResolvedValue(mockSupplier);
    (db.service.create as jest.Mock).mockResolvedValue({ id: 1, name: 'Test Service' });

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
    expect(db.supplier.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(db.service.create).toHaveBeenCalledTimes(1);
    console.log('Jest Test Passed: Service created successfully!');
  });

  it('should return an error if validation fails', async () => {
    // Arrange
    const invalidData = { name: '' } as unknown as ServiceFormData; // Invalid data

    // Act
    const result = await createService(invalidData);

    // Assert
    expect(result).toEqual({ error: 'Invalid fields!' });
    expect(db.service.create).not.toHaveBeenCalled();
    console.log('Jest Test Passed: Handled invalid data correctly.');
  });

  it('should return an error if the supplier is not found', async () => {
    // Arrange
    (db.supplier.findUnique as jest.Mock).mockResolvedValue(null);
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
    expect(result).toEqual({ error: 'Supplier profile not found for the current user.' });
    expect(db.service.create).not.toHaveBeenCalled();
    console.log('Jest Test Passed: Handled supplier not found.');
  });
});
