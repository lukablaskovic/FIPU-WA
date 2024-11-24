<template>
  <div class="align-content: center justify-center">
    <h1
      class="text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl"
    >
      <span
        class="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400"
        >Internet trgovina</span
      >
    </h1>
    <br />
    <proizvod-bttn
      class="px-6 mb-5 py-3.5 text-base font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      v-for="proizvod in proizvodi"
      :key="proizvod"
      :proizvodi="proizvod"
    />
    <div class="flex flex-col items-center">
      <p class="flex justify-center">Proizvoda u košarici: {{ kosarica }}</p>
      <br />
      <button
        type="button"
        @click="posaljiNarudzbu"
        class="flex justify-center px-5 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Pošalji narudžbu
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import ProizvodBttn from "../components/Proizvod-bttn.vue";
import { ref } from "vue";
import router from "../router";
export default {
  name: "Proizvodi",
  components: {
    ProizvodBttn,
  },
  data() {
    return {
      proizvodi: [],
    };
  },
  mounted() {
    this.dohvatiProizvode();
    this.kosarica = localStorage.getItem("kosarica");
    if (!this.kosarica) {
      this.kosarica = 0;
    }
  },
  methods: {
    dohvatiProizvode() {
      let proizvodi = [];

      axios
        .get("http://localhost:3000/proizvodi")
        .then((response) => {
          for (let proizvod of response.data) {
            this.proizvodi.push(proizvod);
          }
        })
        .catch((error) => {
          console.error("Error: ", error);
        });
    },
    async posaljiNarudzbu() {
      try {
        let podaci = ref({
          naruceni_proizvodi: JSON.parse(localStorage.getItem("narudzba")),
        });
        let narudzba = JSON.parse(localStorage.getItem("narudzba"));
        let response = await axios.post(
          "http://localhost:3000/narudzbe",
          podaci.value
        );
        console.log(response);
        localStorage.clear();
        router.go();
      } catch (error) {
        console.error("Greška u dohvatu podataka: ", error);
      }
    },
  },
};
</script>
<style scoped lang="css">
.center {
  margin: 100;
  position: absolute;
  top: 25%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
</style>
