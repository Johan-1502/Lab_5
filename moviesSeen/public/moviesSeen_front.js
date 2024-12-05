new Vue({
    el: '#app',
    data() {
        return {
            dataUser: [{
                nameUser: 'sebas',
                movie: 'alien',
                dateSeen: "2024 - 12-05T05:00:00.000Z"
            },
            {
                nameUser: 'sebas',
                movie: 'fragmentado',
                dateSeen: "2024 - 12-05T05:00:00.000Z"
            },
            {
                nameUser: 'sebas',
                movie: 'fragmentado',
                dateSeen: "2024 - 12-05T05:00:00.000Z"
            },
            {
                nameUser: 'sebas',
                movie: 'Superman',
                dateSeen: "2024 - 12-05T05:00:00.000Z"
            }
            ],
            ipMonitorBack: 'localhost',
            portMonitorBack: 6006,
            //socket: null,
            isModalVisible: true,
            nameUser: ''
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

            this.socket.on('userInfo', (data) => {
                this.dataUser = data;
            });
        },
        async getUserInfo(){
            let response = await fetch(`http://${this.ipMonitorBack}:${this.portMonitorBack}/getUser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name:this.nameUser})
            })
            let variable = await response.json();
            console.log(variable);
            
        }
    },
    mounted() {
        this.socket();
    }
});
