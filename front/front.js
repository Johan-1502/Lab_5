new Vue({
    el: '#app',
    data() {
        return {
            movies: [
                { name: 'Alien', img: 'alien.jpg' },
                { name: 'Avengers 3', img: 'avengers3.jpg' },
                { name: 'Cuervo', img: 'cuervo.jpg' },
                { name: 'Deadpool 3', img: 'deadpool3.jpg' },
                { name: 'Fragmentado', img: 'fragmentado.jpg' },
                { name: 'Gray Man', img: 'grayman.jpg' },
                { name: 'Rápidos y furiosos', img: 'rapidos.jpg' },
                { name: 'Sherlock Holmes', img: 'sherlock.jpg' },
                { name: 'Spiderman No Way Home', img: 'spiderman.jpg' },
                { name: 'Superman', img: 'superman.jpg' },
                { name: 'Transformers', img: 'Transformers.jpg' },
                { name: 'Tron', img: 'Tron.jpg' },
                { name: 'Venom 2', img: 'venom2.jpg' },
                { name: 'Cuervo', img: 'cuervo.jpg' },
                { name: 'Agente 007', img: 'agente007.jpg' },
                { name: 'Fragmentado', img: 'fragmentado.jpg' },
            ],
            isModalVisible: false, 
            selectedMovie: '',
            userName:'',
            userAge:Infinity,
            parentsEmail:'',
            ipProducer: 'localhost',
            portProduer: '3000'
        };
    },
    methods: {
        showModal(movie) {
            this.selectedMovie = movie.name;
            this.isModalVisible = true;
        },
        closeModal() {
            this.isModalVisible = false;
            this.selectedMovie= '';
            this.userName='';
            this.userAge=Infinity;
            this.parentsEmail='';
        },
        async newVisit(){
            let response = await fetch(`http://${this.ipProducer}:${this.portProduer}/newVisit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name:this.userName, movie:this.selectedMovie, age:this.userAge, mail:this.parentsEmail})
            })
            console.log(this.selectedMovie);   
            this.closeModal();         
            console.log(this.selectedMovie);   
        }
    },
    computed: {
        isUnder18() {
            return this.userAge < 18;
        }
    }
});
