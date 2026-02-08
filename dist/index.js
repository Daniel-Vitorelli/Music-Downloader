import fastify from 'fastify';
const server = fastify();
server.get('/', async (request, reply) => {
    return 'Server Listening';
});
const port = process.env.PORT || 8080;
server.listen({ port: +port }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});
//# sourceMappingURL=index.js.map