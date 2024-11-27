import { describe, expect, test, beforeAll, afterAll, afterEach } from '@jest/globals';
import mongoose from 'mongoose';
import { createUser, getUser, getUserByClerkId, updateUser, deleteUser } from '../user.actions';

jest.setTimeout(15000); // Increase timeout to 15 seconds

// Mock Next.js server actions
jest.mock('next/dist/client/components/navigation', () => ({
    useRouter: jest.fn(),
    usePathname: jest.fn(),
}));

// Mock revalidatePath
jest.mock('next/cache', () => ({
    revalidatePath: jest.fn(),
}));

describe('User Actions Tests', () => {
    let userId: string;
    let clerkId: string = 'test_clerk_id_123';
    let mongoConnection: typeof mongoose;
    let originalConsoleError: typeof console.error;

    beforeAll(async () => {
        // Connect to test database
        mongoConnection = await mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/imaginet_test');
        // Store original console.error and mock it
        originalConsoleError = console.error;
        console.error = jest.fn();
    });

    afterAll(async () => {
        // Disconnect after all tests
        if (mongoConnection) {
            await mongoConnection.connection.close();
        }
        // Restore console.error
        console.error = originalConsoleError;
    });

    afterEach(async () => {
        // Clean up the test database after each test
        if (mongoConnection && mongoConnection.connection.db) {
            await mongoConnection.connection.db.dropDatabase();
        }
        // Clear mock calls
        (console.error as jest.Mock).mockClear();
    });

    test('should create a new user', async () => {
        const userData = {
            clerkId,
            username: 'testuser',
            firstName: 'Test',
            lastName: 'User',
            planId: 'free',
            email: 'test@example.com',
            photo: 'https://example.com/photo.jpg',
            creditBalance: 10
        };

        const user = await createUser(userData);
        expect(user).toBeTruthy();
        expect(user.username).toBe(userData.username);
        expect(user.email).toBe(userData.email);
        expect(user.creditBalance).toBe(userData.creditBalance);
        expect(user.createdAt).toBeTruthy();
        expect(user.updatedAt).toBeTruthy();

        userId = user._id.toString();
    });

    test('should get user by ID', async () => {
        // First create a user
        const userData = {
            clerkId,
            username: 'testuser',
            firstName: 'Test',
            lastName: 'User',
            planId: 'free',
            email: 'test@example.com',
            photo: 'https://example.com/photo.jpg',
            creditBalance: 10
        };
        const createdUser = await createUser(userData);
        userId = createdUser._id.toString();

        // Then try to get the user
        const user = await getUser(userId);
        expect(user).toBeTruthy();
        expect(user._id.toString()).toBe(userId);
        expect(user.username).toBe(userData.username);
    });

    test('should get user by Clerk ID', async () => {
        // First create a user
        const userData = {
            clerkId,
            username: 'testuser',
            firstName: 'Test',
            lastName: 'User',
            planId: 'free',
            email: 'test@example.com',
            photo: 'https://example.com/photo.jpg',
            creditBalance: 10
        };
        await createUser(userData);

        // Then try to get the user by Clerk ID
        const user = await getUserByClerkId(clerkId);
        expect(user).toBeTruthy();
        expect(user.clerkId).toBe(clerkId);
        expect(user.username).toBe(userData.username);
    });

    test('should update user', async () => {
        // First create a user
        const userData = {
            clerkId,
            username: 'testuser',
            firstName: 'Test',
            lastName: 'User',
            planId: 'free',
            email: 'test@example.com',
            photo: 'https://example.com/photo.jpg',
            creditBalance: 10
        };
        const createdUser = await createUser(userData);
        userId = createdUser._id.toString();

        // Then update the user
        const updateData = {
            username: 'updateduser',
            creditBalance: 20
        };
        const updatedUser = await updateUser(userId, updateData);
        
        expect(updatedUser).toBeTruthy();
        expect(updatedUser.username).toBe(updateData.username);
        expect(updatedUser.creditBalance).toBe(updateData.creditBalance);
        expect(updatedUser.updatedAt).not.toBe(createdUser.updatedAt);
    });

    test('should delete user', async () => {
        // First create a user
        const userData = {
            clerkId,
            username: 'testuser',
            firstName: 'Test',
            lastName: 'User',
            planId: 'free',
            email: 'test@example.com',
            photo: 'https://example.com/photo.jpg',
            creditBalance: 10
        };
        const createdUser = await createUser(userData);
        userId = createdUser._id.toString();

        // Then delete the user
        const deletedUser = await deleteUser(userId);
        expect(deletedUser).toBeTruthy();
        expect(deletedUser._id.toString()).toBe(userId);

        // Verify user is deleted
        await expect(getUser(userId)).rejects.toThrow('User not found');
    });

    test('should handle non-existent user', async () => {
        const nonExistentId = new mongoose.Types.ObjectId().toString();
        
        // Try to get non-existent user
        await expect(getUser(nonExistentId)).rejects.toThrow('User not found');

        // Try to update non-existent user
        const updateData = { username: 'newname' };
        await expect(updateUser(nonExistentId, updateData)).rejects.toThrow('User not found');

        // Try to delete non-existent user
        await expect(deleteUser(nonExistentId)).rejects.toThrow('User not found');
    });

    test('should create a user with correct data structure', async () => {
        const userData = {
            clerkId: 'test_clerk_id_structure',
            username: 'teststructure',
            firstName: 'Test',
            lastName: 'Structure',
            planId: 'free',
            email: 'test.structure@example.com',
            photo: 'https://example.com/photo.jpg',
            creditBalance: 10
        };

        const user = await createUser(userData);
        
        // Verify all required fields are present
        expect(user).toHaveProperty('_id');
        expect(user).toHaveProperty('clerkId', userData.clerkId);
        expect(user).toHaveProperty('username', userData.username);
        expect(user).toHaveProperty('firstName', userData.firstName);
        expect(user).toHaveProperty('lastName', userData.lastName);
        expect(user).toHaveProperty('planId', userData.planId);
        expect(user).toHaveProperty('email', userData.email);
        expect(user).toHaveProperty('photo', userData.photo);
        expect(user).toHaveProperty('creditBalance', userData.creditBalance);
        
        // Verify timestamps
        expect(user).toHaveProperty('createdAt');
        expect(user).toHaveProperty('updatedAt');
        expect(new Date(user.createdAt)).toBeInstanceOf(Date);
        expect(new Date(user.updatedAt)).toBeInstanceOf(Date);

        // Verify data types
        expect(typeof user._id.toString()).toBe('string');
        expect(typeof user.clerkId).toBe('string');
        expect(typeof user.username).toBe('string');
        expect(typeof user.firstName).toBe('string');
        expect(typeof user.lastName).toBe('string');
        expect(typeof user.planId).toBe('string');
        expect(typeof user.email).toBe('string');
        expect(typeof user.photo).toBe('string');
        expect(typeof user.creditBalance).toBe('number');

        // Verify the data in the database matches
        const dbUser = await mongoose.model('User').findById(user._id);
        expect(dbUser).toBeTruthy();
        
        if (dbUser) {
            const dbUserObj = dbUser.toObject();
            expect(dbUserObj).toEqual(expect.objectContaining({
                clerkId: userData.clerkId,
                username: userData.username,
                firstName: userData.firstName,
                lastName: userData.lastName,
                planId: userData.planId,
                email: userData.email,
                photo: userData.photo,
                creditBalance: userData.creditBalance
            }));

            // Verify database timestamps are actual Date objects
            expect(dbUserObj.createdAt).toBeInstanceOf(Date);
            expect(dbUserObj.updatedAt).toBeInstanceOf(Date);
        }
    });
});
