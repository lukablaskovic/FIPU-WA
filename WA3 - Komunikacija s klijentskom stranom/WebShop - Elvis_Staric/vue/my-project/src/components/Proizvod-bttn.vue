<template>
  <div class="row">
    <button
      @click="otvoriProizvod()"
      type="button"
      class="btn btn-primary btn-lg btn-block"
    >
      {{ proizvodi.naziv }}
    </button>
    <br />
  </div>
</template>

<script>
export default {
  name: "ProizvodBttn",
  props: ["proizvodi"],
  methods: {
    otvoriProizvod() {
      this.$router.push({ path: `proizvodi/proizvod/${this.proizvodi.id}` });
    },
  },
};
</script>
