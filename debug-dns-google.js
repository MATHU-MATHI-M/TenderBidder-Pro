const dns = require('dns');

// Force usage of Google DNS
try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
    console.log('Set DNS servers to 8.8.8.8 and 8.8.4.4');
} catch (e) {
    console.error('Failed to set DNS servers:', e);
}

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
