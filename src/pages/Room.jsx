import React, { useState, useEffect } from 'react';
import client, { databases } from '../appwriteConfig';
import { ID, Query, Role, Permission } from 'appwrite';
import { Trash } from 'react-feather';
import Header from '../components/Header';
import { useAuth } from '../utils/AuthContext';

const Room = () => {

    const { user } = useAuth();

    const [messages, setMessages] = useState([]);
    const [messageBody, setMessageBody] = useState('');

    useEffect(() => {
        getMessages();

        const unsubscribe = client.subscribe(`databases.${import.meta.env.VITE_APPWRITE_DB_ID}.collections.${import.meta.env.VITE_APPWRITE_COLLECTION_ID_MESSAGES}.documents`, res => {
            // Callback will be executed on changes for documents A and all files.
            // console.log(res);
            if (res.events.includes('databases.*.collections.*.documents.*.create')) {
                console.log('A MESSAGE WAS CREATED');
                setMessages(prevState => [...prevState, res.payload]);

            }
            if (res.events.includes('databases.*.collections.*.documents.*.delete')) {
                console.log('A MESSAGE WAS DELETED!');
                setMessages(prevState => [...prevState.filter(message => message.$id !== res.payload.$id)]);
            }
        });

        return () => {
            unsubscribe();
        }
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            user_id: user.$id,
            username: user.name,
            body: messageBody
        }

        const permissions = [
            Permission.write(Role.user(user.$id))
        ]

        const res = await databases.createDocument(
            import.meta.env.VITE_APPWRITE_DB_ID, // databaseId
            import.meta.env.VITE_APPWRITE_COLLECTION_ID_MESSAGES, // collectionId
            ID.unique(), // documentId
            payload, // data
            permissions // permissions (optional)
        );

        console.log(res);

        // setMessages([...messages, res])

        setMessageBody('');
    }

    const getMessages = async () => {
        const res = await databases.listDocuments(
            import.meta.env.VITE_APPWRITE_DB_ID, // databaseId
            import.meta.env.VITE_APPWRITE_COLLECTION_ID_MESSAGES, // collectionId
            [
                // Query.orderDesc('$createdAt'),
                Query.limit(500) // pagination
            ] // queries (optional)
        )
        setMessages(res.documents);
    }

    const deleteMessage = async (messageId) => {
        await databases.deleteDocument(
            import.meta.env.VITE_APPWRITE_DB_ID, // databaseId
            import.meta.env.VITE_APPWRITE_COLLECTION_ID_MESSAGES, // collectionId
            messageId // documentId
        );
        // setMessages([...messages.filter(message => message.$id !== messageId)]);
    }

    return (
        <main className='container'>
            <Header />
            <div className='room--container'>
                <div>
                    {messages.map((message) => (
                        <div key={message.$id} className='message--wrapper'>
                            <div className='message--header'>
                                <p>
                                    {message?.username ? (
                                        <span>{message.username}</span>
                                    ) : (
                                        <span>Anonymous User</span>
                                    )}
                                    <small className='message--timestamp'>
                                        {/* undefined tells JavaScript to use the user's system locale settings to format the date and time instead of a specific language and region. */}
                                        {/* hour set to numeric to only show 1 digit rather than 2 */}
                                        {new Date(message.$createdAt).toLocaleString(undefined, {
                                            hour12: true,
                                            hour: 'numeric',
                                            minute: '2-digit',
                                            second: '2-digit'
                                        })}
                                    </small>
                                </p>
                                {message.$permissions.includes(`delete(\"user:${user.$id}\")`) && (
                                    <Trash
                                        className="delete--btn"
                                        onClick={() => deleteMessage(message.$id)} />
                                )}
                            </div>
                            <div className='message--body'>
                                <span>{message.body}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <form onSubmit={handleSubmit} id='message--form'>
                    <div>
                        <textarea
                            onChange={(e) => setMessageBody(e.target.value)}
                            value={messageBody}
                            maxLength='500'
                            placeholder='Type your message...'
                            required>
                        </textarea>
                    </div>
                    <div className='send-btn--wrapper'>
                        <input
                            className='btn btn--secondary'
                            type='submit'
                            value='Send'
                        />
                    </div>
                </form>
            </div>
        </main>
    )
}

export default Room;