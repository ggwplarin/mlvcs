import crypto from 'crypto';

export default function rollKey() {
    return crypto.randomBytes(64).toString('base64url')
}