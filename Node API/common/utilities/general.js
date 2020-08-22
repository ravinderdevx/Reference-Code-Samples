const crypto = require('crypto');

exports.generateSecureString = async (length) => {
    const buffer = await crypto.randomBytes(length);
    return buffer.toString('hex');
}

exports.filterModelName = (string) => {
    return string.split('-').map(function capitalize(part) {
        return part.charAt(0).toUpperCase() + part.slice(1);
    }).join('');
}