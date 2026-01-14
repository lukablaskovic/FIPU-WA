export const pizze = [
    {
        id: 1,
        naziv: 'Margherita',
        sastojci: ['rajčica', 'sir', 'bosiljak'],
        cijene: { mala: 7.3, srednja: 9.2, jumbo: 16.2 },
        slika_url: 'https://pizzeria-tivoli.com.hr/portal/source/PIZZE/Pizza%20Margherita.jpg'
    },
    {
        id: 2,
        naziv: 'Capricciosa',
        sastojci: ['rajčica', 'sir', 'šunka', 'gljive'],
        cijene: { mala: 7.9, srednja: 9.9, jumbo: 18.0 },
        slika_url: 'https://pizzeria-tivoli.com.hr/portal/source/PIZZE/Pizza%20Capricciosa.jpg'
    },
    {
        id: 3,
        naziv: 'Al Tonno',
        sastojci: ['rajčica', 'sir', 'tunjevina', 'crveni luk'],
        cijene: { mala: 8.7, srednja: 11.7, jumbo: 21.9 },
        slika_url: 'https://pizzeria-tivoli.com.hr/portal/source/PIZZE/Pizza%20Tuna.jpg'
    },
    {
        id: 4,
        naziv: 'Fantasia',
        sastojci: ['rajčica', 'sir', 'gljive', 'šunka', 'paprika', 'panceta', 'vrhnje'],
        cijene: { mala: 9.4, srednja: 12.7, jumbo: 22.2 },
        slika_url: 'https://pizzeria-tivoli.com.hr/portal/source/PIZZE/Pizza%20Fantasia.jpg'
    },
    {
        id: 5,
        naziv: 'Slavonska',
        sastojci: ['rajčica', 'sir', 'kulen', 'panceta', 'feferoni ljuti', 'paprika', 'crveni luk'],
        cijene: { mala: 9.9, srednja: 13.2, jumbo: 22.9 },
        slika_url: 'https://pizzeria-tivoli.com.hr/portal/source/PIZZE/Pizza%20Slavonska.jpg'
    }
];

export const narudzbe = [
    {
        id: 1,
        narucene_pizze: [
            // svaka narudžba sastoji se od jedne ili više naručenih pizza
            {
                // za svaku naručenu pizzu bilježimo naziv, naručenu veličinu i količinu
                naziv: 'Margherita',
                velicina: 'srednja',
                kolicina: 2
            },
            {
                naziv: 'Fantasia',
                velicina: 'jumbo',
                kolicina: 1
            }
        ],
        ukupna_cijena: 40.6, // ukupnu cijenu narudžbe računamo na poslužitelju
        podaci_dostava: {
            prezime: 'Perić',
            adresa: 'Zagrebačka 15, Pula',
            telefon: '091234567'
        }
    }
];
