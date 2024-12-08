import { Webhook } from 'svix';
import { WebhookEvent } from '@clerk/nextjs/server';
import { createUser } from '@/lib/actions/user.actions';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        // Get the headers
        const headerPayload = Object.fromEntries(req.headers.entries());
        const svix_id = headerPayload["svix-id"];
        const svix_timestamp = headerPayload["svix-timestamp"];
        const svix_signature = headerPayload["svix-signature"];

        if (!svix_id || !svix_timestamp || !svix_signature) {
            return new NextResponse('Error occured -- no svix headers', {
                status: 400
            })
        }

        // Get the body
        const payload = await req.json()
        const body = JSON.stringify(payload);

        // Create a new Svix instance with your webhook secret
        const wh = new Webhook(process.env.WEBHOOK_SECRET || '');

        let evt: WebhookEvent

        // Verify the payload with the headers
        try {
            evt = wh.verify(body, {
                "svix-id": svix_id,
                "svix-timestamp": svix_timestamp,
                "svix-signature": svix_signature,
            }) as WebhookEvent
        } catch (err) {
            console.error('Error verifying webhook:', err);
            return new NextResponse('Error occured', {
                status: 400
            })
        }

        // Handle the webhook
        const eventType = evt.type;

        if (eventType === 'user.created') {
            const { id, email_addresses, image_url, first_name, last_name, username } = evt.data;

            const user = {
                clerkId: id,
                email: email_addresses[0].email_address,
                username: username || email_addresses[0].email_address.split('@')[0],
                firstName: first_name || '',
                lastName: last_name || '',
                photo: image_url || '',
            }

            const newUser = await createUser(user);

            return NextResponse.json({ message: 'OK', user: newUser })
        }

        return new NextResponse('', { status: 200 })
    } catch (error) {
        console.error('Error in webhook handler:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
