new Vue({
    el: '#app',
    data() {
        return {
            name: "nombre",
            movies: [
                { movieName: 'Venom 2', counter: 3 },
                { movieName: 'Tron', counter: 1 },
                { movieName: 'Sherlock Holmes', counter: 1 }
            ]
            ,
            ipMonitorBack: 'localhost',
            portMonitorBack: 6005
        };
    },
    methods: {
        socket() {
            this.socket = io.connect(`http://${this.ipMonitorBack}:${this.portMonitorBack}`, { 'forceNew': true });
            this.socket.on('connect', () => {
                console.log('Conectado al servidor de WebSocket');
            });

            this.socket.on('test', (data) => {
                console.log("En test");
                this.name = data.name;
                console.log(this.name);
            });

            this.socket.on('moviesList', (data) => {
                this.movies = data;
            });
        }
    },
    mounted() {
        this.socket();
    }
});
