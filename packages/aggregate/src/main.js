import ConnectedAggregate from './ConnectedAggregate'

export default (socket, url) => id => new ConnectedAggregate(socket, url, id)
