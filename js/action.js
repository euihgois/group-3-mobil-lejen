const db_ID = {//data ID & Password
    orangBiasa: {
        password: 'ahok2periode',
        wallet: 300_000
    },
    sultanCakung: {
        password: 'jokowijugamanusia',
        wallet: Infinity
    },
    orangMiskin: {
        password: 'YNTKTS',
        wallet: 0
    }
}

const db_skin = {//data untuk skin
    skin1: {
        image: 'imgs/1.png',// imgs/<nama file>.<extension>
        price: 40_000,
        stock: 10,
        rarity: 'common'
    },
    skin2: {
        image: 'dummyImage',
        price: 50_000,
        stock: 10,
        rarity: 'common'
    },
    skin3: {
        image: 'dummyImage',
        price: 20_000,
        stock: 10,
        rarity: 'poor'
    },
    skin4: {
        image: 'dummyImage',
        price: 400_000,
        stock: 10,
        rarity: 'rare'
    },
    skin5: {
        image: 'dummyImage',
        price: 150_000,
        stock: 10,
        rarity: 'uncommon'
    },
    skin6: {
        image: 'dummyImage',
        price: 900_000,
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

let userInput = 'orangBiasa';//diperlukan agar bisa akses wallet user di db_ID, value diperoleh apabila button sign in dipencet
let userWallet = db_ID[userInput].wallet;//untuk display
let tempWallet = userWallet;//temp untuk function reset
let collectedMoney = 0;//state awal
let userChart = [];//untuk display, setiap element berbentuk object {value: <nama skin>, cancelable: <true/false>}
let displayChange; //untuk display kembalian jika diperlukan
let fetchedItems;

//function getMoney untuk mengambil user wallet sejumlah nominal di tombol
function getMoney(nominal) {//asumsi parameter bertipe Number, jika tidak perlu dimodifikasi
    if (userWallet >= nominal) {
        userWallet -= nominal;
        collectedMoney += nominal;
    }
}

//function calculcation akan melakukan update untuk kedua data base ketika tombol, jika bisa ada status yang memberitahu bahwa uang kurang
function calculation(skin) {//tergantung skinnya apa yang dipencet, jika tombol skin1, masukan 'skin1' pada function, maka calculation('skin')
    if (collectedMoney >= db_skin[skin].price) {
        collectedMoney -= db_skin[skin].price;//duit di vending berkurang
        db_skin[skin].stock--; //stock berkurang
        userChart.push({value: skin, cancelable: true}); //item masuk chart
        // addItemOnDisplay();
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
            userChart = remove(i, userChart);
            collectedMoney += db_skin[recentItem].price; //duit kembali
            db_skin[recentItem]++; //stock kembali
            break;
        }
    }
}

//function reset untuk mengembalikan state ke awal
function reset() {
    collectedMoney = 0;//money di vending kosong
    userWallet = tempWallet;//duit kembali
    for (let item of userChart) {//mengemvalikan stock
        db_skin[item.value].stock++;
    }
    userChart = [];//chart dikosongkan
}

//function checktOut mirip seperti reset tetapi state tidak kembali ke awal
function checkOut() {
    displayChange = userWallet; //untuk display kembalian
    userWallet += collectedMoney;
    fetchedItems = userChart;
    userChart = [];
    displayChange = collectedMoney;
    collectedMoney = 0;
    document.getElementById('tempat ambil item yang dibeli') = 'kumpulan gambar mobil yang diambil';//item dalam bentuk kumpulan
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

    let RANGE = 100;
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
    userChart.push({value: prize, cancelable: false});
    db_skin[prize].stock--; //sepertinya harus dibuat function update
}

//function signIn digunakan sebagai filter data
function signIn() {
    let inputPassword = document.getElementById('password');//box password
    userInput = document.getElementById('input'); //box id
    if (userInput in db_ID && inputPassword === db_ID[userInput].password) {
        location.href = 'halaman baru html';//<file html>
    } else {
        alert("Login gagal");//untuk sementara yang gampang
    }
}

//function signUp digunakan untuk menambah data baru di database
function signUp() {
    let newID = document.getElementById('nama pendaftar');//jika sempat kasih fitur filter password yang diizinkan (opsional)
    let newPass = document.getElementById('password user baru');
    if (filterID(newID)) {
        db_ID[newID].password = {password: newPass, wallet: 0};//karena pengguna baru wallet kosong, mungkin kasih halaman fitur topup
        location.href = 'kembali ke halaman sign in'
    } else {
        alert('password tidak sesuai kriteria');//versi simpel
    }
}

//function filter ID
function filterID(str) {
    const forbidden = [' ', '&', '@'];//hanya perlu dimasukkan saja yang dilarang
    for (let char of str) {
        if (forbidden.includes(char)) {
            return false;
        }
    }
    return true;
}

//function fetchItem berguna untuk menghilang items yang muncul setelah checkout
function fetchItem() {
    document.getElementById('tempat ambil item yang dibeli').innerHTML = '';
}

//function addItemOnDisplay berguna untuk menambah element di html
function addItemOnDisplay() {
    document.getElementById('display chart').innerHTML = '';//mungkin kita remove dulu isinya lalu ganti yang baru
    for (let item of userChart) {
        document.getElementById('display chart').innerHTML += db_skin[item.value].image; //nambah gambar, cuman mungkin lebih baik langsung dalam bentuk <div> jadi biar langsung teredit
    }
}

//test case
let skin2 = 'skin2', skin1 = 'skin1'
console.log(userWallet, collectedMoney, userChart, '<<1');
getMoney(100_000);
console.log(userWallet, collectedMoney, userChart,'<<2');
calculation(skin2);
console.log(userWallet, collectedMoney, userChart,'<<3');
calculation(skin1);
console.log(userWallet, collectedMoney, userChart,'<<4');
cancel();
console.log(userWallet, collectedMoney, userChart,'<<5');
gacha();
gacha();
console.log(userWallet, collectedMoney, userChart,'<<6');
cancel();
console.log(userWallet, collectedMoney, userChart,'<<7');
reset();
console.log(userWallet, collectedMoney, userChart,'<<8');
