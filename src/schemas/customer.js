module.exports = () => [customer, organization, person, base];

const base = require('./base');
const person = require('./person');
const organization = require('./organization');

const customer = `
# Party placing the order or paying the invoice
union Customer = Organization | Person
`;
