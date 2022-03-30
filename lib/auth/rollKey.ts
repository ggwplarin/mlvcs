import crypto from 'crypto';

export default function rollKey() {
    return crypto.randomBytes(32).toString('hex')
}