import { Client, Databases, Account } from 'appwrite';

const client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(import.meta.env.VITE_APPWRITE_PROJ_ID);

export const databases = new Databases(client);
export const account = new Account(client);

export default client;