class Proizvod {
  constructor(id, naziv, cijena, velicine, opis, slike, karakteristike, boje) {
    this.id = id;
    this.naziv = naziv;
    this.cijena = cijena;
    this.velicine = velicine;
    this.opis = opis;
    this.slike = slike;
    this.karakteristike = karakteristike;
    this.boje = boje;
  }
}
const proizvodi = [
  new Proizvod(
    1,
    "Obična crna majica",
    80,
    ["XS", "S", "M", "L"],
    "Crna majica",
    [
      "https://freshcleantees.com/cdn/shop/files/CREWNECKSBlack_737x980.jpg?v=1714777751",
      "https://isto.pt/cdn/shop/files/Classic_T-shirt_Black_1_4b42b483-c2cf-46f6-805c-90bd905b4338.webp?v=1685716490",
      "https://www.activetruth.com.au/cdn/shop/files/CLASSIC-BAMBOO-T-SHIRT-BACK-BLACK_grande.png?v=1711585087",
      "https://modes.com/cdn/shop/files/MODEST_000_BLACK-111_17ce1673-7dc5-4f3a-87af-f7e192b8711c.jpg?v=1696611310&width=1100",
    ],
    ["100% pamuk"],
    ["Crna"]
  ),
  new Proizvod(
    2,
    "Levi's 501 traperice",
    110,
    ["S", "M", "L"],
    "Levi's 501",
    [
      "https://lsco.scene7.com/is/image/lsco/295020228-alt3-pdp-lse?fmt=jpeg&qlt=70&resMode=sharp2&fit=crop,1&op_usm=0.6,0.6,8&wid=2000&hei=1840",
      "https://lsco.scene7.com/is/image/lsco/362000124-front-pdp-lse?fmt=jpeg&qlt=70&resMode=sharp2&fit=crop,1&op_usm=0.6,0.6,8&wid=2000&hei=1840",
      "https://static.qns.digital/img/p/2/5/8/7/3/2/1/2587321.jpg",
      "https://lsco.scene7.com/is/image/lsco/005010114-front-pdp?fmt=jpeg&qlt=70&resMode=sharp2&fit=crop,1&op_usm=0.6,0.6,8&wid=2000&hei=1840",
    ],
    ["70% pamuk, 28% liocel, 2% elastan", "Traper tkanina"],
    ["Crna", "Plava"]
  ),
  new Proizvod(
    3,
    "Zimska kapa",
    40,
    ["One size"],
    "Zimska kapa",
    [
      "https://malizakladi.hr/media/catalog/product/cache/ee595ad2b94fe9d840a6c7a940b85399/j/a/jamiks-zimska-kapa-kelsi-grey-jze141j563-001.jpg",
      "https://kiky.store/cdn/shop/products/zimska-kapa-vln5-kiky-bijela-419497.jpg?v=1635644636&width=1445",
      "https://media.dm-static.com/images/f_auto,q_auto,c_fit,h_440,w_500/v1728867101/products/pim/3856027505342-360766094/toplo-meko-zimska-kapa-s-pomponom-crna",
      "https://apismarket.hr/image_style/product_image/Documents/Products/156046/158011_retrc346-black_ash-a1.jpg.webp?1728378091",
    ],
    [
      "Materijal vanjske tkanine: 100% akril",
      "Vrsta podstave: Blago obloženo",
      "Tkanina: Pletivo",
      "Upute za održavanje: Samo ručno pranje",
    ],
    ["Bijela", "Plava", "Crna", "Crvena"]
  ),
];
export { proizvodi, Proizvod };
