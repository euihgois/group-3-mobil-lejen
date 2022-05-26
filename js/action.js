const db_ID = {//data ID & Password
    orangBiasa: {
        password: 'ahok2periode',
        wallet: 200_000
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
        image: 'dummyImage',
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
    skin5: {
        image: 'dummyImage',
        price: 900_000,
        stock: 10,
        rarity: 'legend'
    },
}

let user = 'orangBiasa'; //diambil dr getElement sign in, untuk dummy
let userWallet = db_ID[user].wallet;//untuk display
let tempWallet = userWallet;
let collectedMoney = 0;

let userChart = [];//untuk display, setiap element berbentuk object {value: <nama skin>, cancelable: <true/false>}

let itemClicked1 = 'skin2'; //diambil dr getElement di tombol item list apabila user mengklik tombol
let itemClicked2 = 'skin3';
let displayChange; //untuk display kembalian

//function getMoney untuk mengambil user wallet sejumlah nominal di tombol
function getMoney(nominal) {//asumsi parameter bertipe Number, jika tidak perlu dimodifikasi
    if (userWallet >= nominal) {
        userWallet -= nominal;
        collectedMoney += nominal;
    }
}

//function calculcation akan melakukan update untuk kedua data base ketika tombol, jika bisa ada status yang memberitahu bahwa uang kurang
function calculation(skin) {//tergantung skinnya apa yang dipencet
    if (collectedMoney >= db_skin[skin].price) {
        collectedMoney -= db_skin[skin].price;//duit di vending berkurang
        db_skin[skin].stock--; //stock berkurang
        userChart.push({value: skin, cancelable: true}); //item masuk chart
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
    userChart = [];
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
    const gachaPrice = 10_000;
    if (userWallet < gachaPrice) {//biar end function excetion jika user wallet kurang
        return;
    }

    const RANGE = 100;
    let randomNumber = Math.ceil(Math.random() * RANGE);//memperoleh angka antara 1 sampai RANGE
    let rarity = 'legend';
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

//test case
// console.log(userWallet, collectedMoney, userChart, db_skin[itemClicked1].stock, db_skin[itemClicked2].stock, '<<<1');
// getMoney(150_000);
// console.log(userWallet, collectedMoney, userChart, db_skin[itemClicked1].stock, db_skin[itemClicked2].stock, '<<<2');
// calculation(itemClicked1);
// console.log(userWallet, collectedMoney, userChart, db_skin[itemClicked1].stock, db_skin[itemClicked2].stock, '<<<3');
// calculation(itemClicked2);
// console.log(userWallet, collectedMoney, userChart, db_skin[itemClicked1].stock, db_skin[itemClicked2].stock, '<<<4');
// gacha();
// console.log(userWallet, collectedMoney, userChart, db_skin[itemClicked1].stock, db_skin[itemClicked2].stock, '<<<5');
// reset();
// console.log(userWallet, collectedMoney, userChart, db_skin[itemClicked1].stock, db_skin[itemClicked2].stock, '<<<6');
// checkOut();
// console.log(userWallet, collectedMoney, userChart, db_skin[itemClicked1].stock, db_skin[itemClicked2].stock, '<<<7');

//abaikan yang bawah karena dom belom kelar
// function startButton() {//ketika masuk pertama kali, ada tombol "Masuk", apabila diklik, layar ter-hide dan muncul form ID & Password
//     document.getElementById("startDisplay").style.display = "none";
// }

// function signInChecker() {//function untuk pengecekan ID & password
//     let inputID = document.getElementById("inputID").innerText; //belum tentu form
//     let inputPass = document.getElementById("inputPass").innerText;

//     if (!(inputID in db_ID)) {
//         // alert('ID belum terdaftar'); //pengennya ada box dengan button 'ok' pake createElement seperti ini
//         // let displaySignIn = document.getElementById('displaySignIn')
//         // let displayMessage = document.createElement('div');
//         // let message = document.createElement('p');
//         // message.innerText = 'ID belum terdaftar';
//         // displayMessage.appendChild(message);
//         // displaySignIn.appendChild(displayMessage);
        
//         inputID = '';
//         inputPass = '';
//     } else if (inputPass !== db_ID[inputID].password) {
//         alert('Password salah, silahkan ulangi kembali');
//         inputPass = ''
//     } else {
//         document.getElementById("signInDisplay").style.display = "none"; //jika benar, display dibuat hidden
//     }
// }


// let signInButton = document.getElementById("signInButton");
// signInButton.addEventListener('click', signInChecker()); //pengecekan ID & Password apabila tombol sign in diklik

// let userCash = db_ID[document.getElementById("inputID").innerText].wallet; //untuk memperoleh saldo user
// let tempCash = userCash;//diperlukan untuk reset function
// document.getElementById('statusSaldo') = userCash; //untuk display saldo pertama kali


// //button untuk setiap skin, isi element dengan nomor skin dengan display invisible
// let button1 = document.getElementById('button1'); //skin1
// let button2 = document.getElementById('button2'); //skin2
// let button3 = document.getElementById('button3'); //dst.
// let button4 = document.getElementById('button4');
// let button5 = document.getElementById('button5');
// let button6 = document.getElementById('button6');

// let chart = [];//keranjang bisa kita andaikan sebagai sebuah sequence dengan isi kode skin
// let displayChart = document.getElementById('chart');//menampilakn sejumlah barang yang sudah diklik

// function calculation(code) { //diisi oleg variable button(1 - 6)
//     userCash -= db_skin[code.innerText]; //update cash
//     db_skin[code.innerText].stock--; //dikurangi setiap diklik
//     chart.push(code);
//     let newItem = document.createElement('img');
//     newItem.value = db_skin.image;
//     let 
// }

// button1.addEventListener('click', calculation(button1.innerText)); //untuk contoh ketika button diklik, sisanya nanti jika sudah berhasil

// function cancel() {//function seperti fungsi undo (ctrl + z)
//     let lastItem = chart[chart.length - 1];
//     userCash += db_skin[lastItem];
//     db_skin[lastItem].stock++;
// }

// function reset() {//remove seluruh item di chart dan mengembalikan uang user ke awal
//     chart = [];
//     userCash = tempCash;
// }

// function checkOut() {//function berguna untuk menghilangkan uang secara permanen setelah melakukan transaksi

// }