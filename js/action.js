const db_ID = sessionStorage.getItem('db_ID') || {//data ID & Password
    '1': {
        password: '1',
        wallet: 300_000
    },
    'sultanCakung@hotmail.com': {
        password: 'jokowijugamanusia',
        wallet: Infinity
    },
    'orangMiskin@poor.com': {
        password: 'YNTKTS',
        wallet: 0
    }
}

const db_skin = sessionStorage.getItem('db_skin') || {//data untuk skin
    mobil1: {
        image: 'imgs/__custom_showroom_1590435203-removebg-preview.png',// imgs/<nama file>.<extension>
        price: 100_000,
        stock: 10,
        rarity: 'common'
    },
    mobil2: {
        image: 'imgs/r34.png',
        price: 200_000,
        stock: 10,
        rarity: 'common'
    },
    mobil3: {
        image: 'imgs/ford.png',
        price: 800_000,
        stock: 10,
        rarity: 'poor'
    },
    mobil4: {
        image: 'imgs/hi.png',
        price: 350_000,
        stock: 10,
        rarity: 'rare'
    },
    mobil5: {
        image: 'imgs/0-3176_m-removebg-preview.png',
        price: 50_000,
        stock: 10,
        rarity: 'uncommon'
    },
    mobil6: {
        image: 'imgs/halo.png',
        price: 450_000,
        stock: 10,
        rarity: 'legend'
    },
    mobil7: {
        image: 'imgs/download-removebg-preview.png',
        price: 600_000,
        stock: 10,
        rarity: 'legend'
    },
    mobil8: {
        image: 'imgs/Bugatti-Type-57-Barnfind-Artcurial-2019-Auction-01-removebg-preview.png',
        price: 150_000,
        stock: 10,
        rarity: 'legend'
    },
    mobil9: {
        image: 'imgs/2494696-removebg-preview.png',
        price: 850_000,
        stock: 10,
        rarity: 'legend'
    },
    mobil10: {
        image: 'imgs/cadillac-classic-car-classic-eldorado-slammed-hd-wallpaper-preview-removebg-preview.png',
        price: 50_000,
        stock: 10,
        rarity: 'legend'
    },
}

/* state yang akan ditampilkan:
1. userWallet
2. collectedMoney
3. userChart
4. fetchedItems
5. displayChange
*/

let userInput = sessionStorage.getItem('userInput') || 0; //diperlukan agar bisa akses wallet user di db_ID, value diperoleh apabila button sign in dipencet
let userWallet = db_ID[userInput].wallet;//untuk display
let tempWallet = userWallet;//temp untuk function reset
let collectedMoney = 0;//state awal
let userChart = [];//untuk display, setiap element berbentuk object {value: <nama skin>, cancelable: <true/false>}
let displayChange = document.getElementById('displayChange').innerHTML; //untuk display kembalian jika diperlukan
let fetchedItems;
// document.getElementsById('displayChange').value=displayChange;
//function getMoney untuk mengambil user wallet sejumlah nominal di tombol
function getMoney(nominal) {//asumsi parameter bertipe Number, jika tidak maka perlu dimodifikasi
    if (userWallet >= nominal) {
        userWallet -= nominal;
        collectedMoney += nominal;
        document.getElementById('displayChange').innerHTML = collectedMoney;
    }
}

//function calculcation akan melakukan update untuk kedua data base ketika tombol, jika bisa ada status yang memberitahu bahwa uang kurang
function calculation(skin) {//tergantung skinnya apa yang dipencet, jika tombol skin1, masukan 'skin1' pada function, maka calculation('skin')
    if (collectedMoney >= db_skin[skin].price && db_skin[skin].stock) {
        collectedMoney -= db_skin[skin].price;//duit di vending berkurang
        db_skin[skin].stock--; //stock berkurang
        userChart.push({value: skin, cancelable: true}); //item masuk chart
        document.getElementById('displayChange').innerHTML = collectedMoney;
        // document.getElementsById('displayChange').value=collectedMoney;
        updateDisplay(userChart, 'sodaCount');
    }
}

//function remove digunakan untuk function cancel
function remove(index, array) {
    let result = [];
    for (let i = 0; i < array.length; i++) {
        if (i !== index) {
            result.push(array[i]);
        }
    }
    return result;
} 

//function cancel untuk remove item di chart berdasarkan urutan paling akhir
function cancel() {
    for (let i = userChart.length - 1; i >= 0; i--) {
        if (userChart[i].cancelable) {
            let recentItem = userChart[i].value;//mengambil value recent item yang dapat di-cancel
            collectedMoney += db_skin[recentItem].price; //duit kembali
            userChart = remove(i, userChart);
            db_skin[recentItem].stock++; //stock kembali
            // document.getElementsById('displayChange').value=collectedMoney;
            document.getElementById('displayChange').innerHTML = collectedMoney;
            break;
        }
    }
    updateDisplay(userChart, 'sodaCount');
}

//function reset untuk mengembalikan state ke awal
function reset() {
    collectedMoney = 0;//money di vending kosong
    document.getElementById('displayChange').innerHTML = collectedMoney;
    userWallet = tempWallet;//duit kembali
    for (let item of userChart) {//mengemvalikan stock
        db_skin[item.value].stock++;
    }
    userChart = [];//chart dikosongkan
    updateDisplay(userChart, 'sodaCount');
}

//function checktOut mirip seperti reset tetapi state tidak kembali ke awal
function checkOut() {
    displayChange = userWallet; //untuk display kembalian
    userWallet += collectedMoney;
    fetchedItems = userChart;
    userChart = [];
    // displayChange = collectedMoney;
    updateDisplay(userChart, 'sodaCount');
    fetchItem();
    collectedMoney = 0;
    document.getElementById('displayChange').innerHTML = collectedMoney;
    tempWallet = userWallet;
    // document.getElementsById('displayChange').value=collectedMoney;
    // document.getElementById('tempat ambil item yang dibeli') = 'kumpulan gambar mobil yang diambil';//item dalam bentuk kumpulan
}

//function filterByRarity untuk function groupChoice
function filterByRarity(rarity) {
    let result = [];
    for (let skin in db_skin) {
        if (db_skin[skin].rarity === rarity) {
            result.push(skin);
        }
    }
    return result;
}

//function tambahan untuk function gacha, memilih secara random (memiliki chance yang sama karena pseudo-random nya bersifat uniform distribution dalam range tersebut)
function groupChoice(group) {//parameter diperoleh berupa array dari function filterByRarity
    let randomNumber =  Math.floor(Math.random() * group.length); //diperoleh number antara 0 sampai index terakhir array group
    return group[randomNumber];
}

//function gacha memberikan secara acak item dengan harga yang murah
function gacha() { 
    const gachaPrice = 50_000;
    if (collectedMoney < gachaPrice) {//biar end function excetion jika user wallet kurang
        return;
    }

    const RANGE = 100;
    let randomNumber = Math.ceil(Math.random() * RANGE);//memperoleh angka antara 1 sampai RANGE
    let rarity = 'legend'; //flagging
    if (randomNumber < 40) {//klo mau ditampilkan rarity, variable bisa dibuat global
        rarity = 'poor';
    } else if (randomNumber < 75) {
        rarity = 'common';
    } else if (randomNumber < 90) {
        rarity = 'uncommon';
    } else if (randomNumber < 97) {
        rarity = 'rare';
    }
    
    let prize = groupChoice(filterByRarity(rarity));
    collectedMoney -= gachaPrice;
    document.getElementById('displayChange').innerHTML = collectedMoney;
    // document.getElementsById('displayChange').value=collectedMoney;
    userChart.push({value: prize, cancelable: false});
    updateDisplay(userChart, 'sodaCount');
    db_skin[prize].stock--; //sepertinya harus dibuat function update
}

//function signIn digunakan sebagai filter data
function signIn() {
    let inputPassword = document.getElementById('password').value;//box password
    userInput = document.getElementById('email').value; //box id
    sessionStorage.setItem('userInput', userInput);
    sessionStorage.setItem('db_ID', db_ID);
    sessionStorage.setItem('db_skin', db_skin);
    if (userInput in db_ID && inputPassword === db_ID[userInput].password) {
        alert("Login berhasil");
        location.href = 'mobillejen.html';//<file html>
    } 
    else {
        alert("Login gagal");//untuk sementara yang gampang
    }
}

//function signUp digunakan untuk menambah data baru di database
function signUp() {
    let newID = document.getElementById('nama pendaftar').value;//jika sempat kasih fitur filter password yang diizinkan (opsional)
    let newPass = document.getElementById('password user baru').value;
    if (filterID(newID)) {
        db_ID[newID].password = {password: newPass, wallet: 0};//karena pengguna baru wallet kosong, mungkin kasih halaman fitur topup
        location.href = 'kembali ke halaman sign in'
    } else {
        alert('password tidak sesuai kriteria');//versi simpel
    }
}

//function filter ID
// function filterID(str) {
//     const forbidden = [' ', '&', '@'];//hanya perlu dimasukkan saja yang dilarang
//     for (let char of str) {
//         if (forbidden.includes(char)) {
//             return false;
//         }
//     }
//     return true;

//function fetchItem berguna untuk menghilang items yang muncul setelah checkout
function fetchItem() {
    updateDisplay(fetchedItems, 'fetch-box');
}

function getItems() {
    document.getElementById('fetch-box').innerHTML = '';
}

function signOut() {
    sessionStorage.setItem('db_ID', db_ID);
    sessionStorage.setItem('db_skin', db_skin);
    alert("Keluar halaman berhasil");
    location.href = 'index.html';
}

//function addItemOnDisplay berguna untuk menambah element di html
// function addItemOnDisplay() {
//     document.getElementById('display chart').value = '';//mungkin kita remove dulu isinya lalu ganti yang baru
//     for (let item of userChart) {
//         document.getElementById('display chart').value += db_skin[item.value].image; //nambah gambar, cuman mungkin lebih baik langsung dalam bentuk <div> jadi biar langsung teredit
//     }
// }

function updateDisplay(array, id) {
    document.getElementById(id).innerHTML = '';
    for (let mobil of array) {
        document.getElementById(id).innerHTML += `<img width='50px' src=${db_skin[mobil.value].image}>`;
    }
}
//test case
// let skin2 = 'skin2', skin1 = 'skin1'
// console.log(userWallet, collectedMoney, userChart, '<<1');
// getMoney(100_000);
// console.log(userWallet, collectedMoney, userChart,'<<2');
// calculation(skin2);
// console.log(userWallet, collectedMoney, userChart,'<<3');
// calculation(skin1);
// console.log(userWallet, collectedMoney, userChart,'<<4');
// cancel();
// console.log(userWallet, collectedMoney, userChart,'<<5');
// gacha();
// gacha();
// console.log(userWallet, collectedMoney, userChart,'<<6');
// cancel();
// console.log(userWallet, collectedMoney, userChart,'<<7');
// reset();
// console.log(userWallet, collectedMoney, userChart,'<<8');