<template>
  <div
    class="mx-auto bg-linear-to-br min-h-screen p-8 bg-[url('/background.png')] bg-cover bg-center bg-no-repeat"
  >
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <!-- Pizze v-for -->
      <div
        v-for="pizza in pizze"
        :key="pizza.naziv"
        :class="[
          'bg-inherit rounded-xl overflow-hidden cursor-pointer transition-all duration-300',
          odabrana_pizza?.naziv === pizza?.naziv
            ? 'ring-4 ring-orange-300 shadow-lg shadow-orange-300/50 scale-[1.02]'
            : 'hover:scale-[1.01]',
        ]"
        @click="odaberiPizzu(pizza)"
      >
        <div
          class="w-full h-48 flex items-center justify-center bg-inherit overflow-hidden rounded-xl"
        >
          <img :src="pizza.slika_url" :alt="pizza.slika_url" class="w-full h-full object-cover" />
        </div>

        <div class="p-6">
          <div class="flex items-center space-x-3 mb-4">
            <h2 class="text-lg font-bold text-orange-500 tracking-wide">{{ pizza.naziv }}</h2>

            <div class="flex space-x-2">
              <div
                v-for="sastojak in pizza.sastojci"
                class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-slate-50 font-semibold text-xs"
              >
                <v-icon :name="ikoneSastojaka[sastojak]"></v-icon>
              </div>
            </div>
          </div>

          <div class="space-y-2">
            <div
              v-for="(cijena, velicina) in pizza.cijene"
              class="flex justify-between text-gray-700"
            >
              <span class="font-medium">{{
                velicina.charAt(0).toUpperCase() + velicina.slice(1)
              }}</span>
              <span>€{{ cijena }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <OrderFooter
      v-if="odabrana_pizza != null"
      :odabrana-pizza="odabrana_pizza"
      @close="odabrana_pizza = null"
    />
  </div>
</template>

<script setup>
import OrderFooter from './OrderFooter.vue'
import { addIcons } from 'oh-vue-icons'
import {
  GiTomato,
  GiCheeseWedge,
  GiSlicedMushroom,
  IoLeafSharp,
  CoHotjar,
  GiMilkCarton,
  GiBellPepper,
  LaPepperHotSolid,
  GiCannedFish,
  GiGarlic,
  FaBacon,
  GiHamShank,
} from 'oh-vue-icons/icons'

addIcons(
  GiTomato,
  GiCheeseWedge,
  GiSlicedMushroom,
  IoLeafSharp,
  GiBellPepper,
  GiHamShank,
  LaPepperHotSolid,
  GiCannedFish,
  GiGarlic,
  FaBacon,
  CoHotjar,
  GiMilkCarton,
)

import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'

let odabrana_pizza = ref(null)
let pizze = ref([])
const URL_express = 'http://localhost:3000'

const ikoneSastojaka = {
  rajčica: 'gi-tomato',
  sir: 'gi-cheese-wedge',
  gljive: 'gi-sliced-mushroom',
  bosiljak: 'io-leaf-sharp',
  paprika: 'gi-bell-pepper',
  šunka: 'gi-ham-shank',
  'feferoni ljuti': 'la-pepper-hot-solid',
  tunjevina: 'gi-canned-fish',
  'crveni luk': 'gi-garlic',
  panceta: 'fa-bacon',
  kulen: 'co-hotjar',
  vrhnje: 'gi-milk-carton',
}

function odaberiPizzu(novaPizza) {
  odabrana_pizza.value = novaPizza
  console.log(`Odabrana pizza je ${odabrana_pizza.value.naziv}`)
}

async function dohvati_pizze() {
  try {
    let response = await axios.get(`${URL_express}/pizze`)
    pizze.value = response.data
    console.log(`Dohvaćene pizze s backenda: ${pizze.value.map((pizza_obj) => pizza_obj.naziv)}`)
  } catch (error) {
    console.error(`Greška: ${error}`)
  }
}

onMounted(() => {
  dohvati_pizze()

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      odabrana_pizza.value = null // poništavamo odabir pizze
    }
  })
})
</script>
