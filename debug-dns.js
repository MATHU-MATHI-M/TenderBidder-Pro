const dns = require('dns');

const hostname = '_mongodb._tcp.tenderbidder.ye82tko.mongodb.net';

console.log(`Resolving SRV for ${hostname}...`);

dns.resolveSrv(hostname, (err, addresses) => {
    if (err) {
        console.error('DNS Resolution Error:', err);
        console.error('Code:', err.code);
        console.error('Syscall:', err.syscall);
        console.error('Hostname:', err.hostname);
    } else {
        console.log('SRV Records found:', addresses);
    }
});

// Also try to resolve the base hostname without the SRV prefix, just to check
const baseHostname = 'tenderbidder.ye82tko.mongodb.net';
console.log(`Resolving A/CNAME for ${baseHostname}...`);
dns.lookup(baseHostname, (err, address, family) => {
    if (err) {
        console.error('Base Hostname Lookup Error:', err);
    } else {
        console.log('Base Hostname Resolved:', address);
    }
});
