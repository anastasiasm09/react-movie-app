import { requestOptions } from "./utils";

export async function getSessionId(requestToken) {
    try {
        const response = await fetch('https://api.themoviedb.org/3/authentication/session/new', {
            ...requestOptions,
            method: 'POST',
            body: JSON.stringify({ request_token: requestToken }),
        });

        if (!response.ok) {
            const errorMessage = `API Error ${response.status, response.statusText}`;
            throw new Error(errorMessage);
        }

        const data = await response.json();
        const sessionId = data.session_id;
        return sessionId;

    } catch (error) {
        console.error("Error getting session_id:", error);
        throw error;
    }
}

export async function getAccountId(sessionId) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/account?session_id=${sessionId}`, requestOptions)

        if (!response.ok) {
            const errorMessage = `API Error ${response.status}`;
            throw new Error(errorMessage);
        }

        const userData = await response.json();
        const accountId = userData.id;
        return accountId;

    } catch (error) {
        console.error("Error in getAccountDetails:", error);
        throw error;
    }
}

export async function getRequestToken() {
    try {
        const response = await fetch('https://api.themoviedb.org/3/authentication/token/new', requestOptions)

        if (!response.ok) {
            const errorMessage = `API Error ${response.status}`;
            throw new Error(errorMessage);
        }

        const data = await response.json();
        const requestToken = data.request_token;
        return requestToken;

    } catch (error) {
        console.error("Error getting request_token:", error);
        throw error;
    }
}