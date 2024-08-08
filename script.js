document.addEventListener('DOMContentLoaded', function() {
    const initialSymbols = ['🔞', '🔞', '🔞']; 
    document.getElementById('symbol1').innerText = initialSymbols[0];
    document.getElementById('symbol2').innerText = initialSymbols[1];
    document.getElementById('symbol3').innerText = initialSymbols[2];
    document.getElementById('symbol4').innerText = initialSymbols[0];
    document.getElementById('symbol5').innerText = initialSymbols[1];
    document.getElementById('symbol6').innerText = initialSymbols[2];
	document.getElementById('symbol7').innerText = initialSymbols[0];
    document.getElementById('symbol8').innerText = initialSymbols[1];
    document.getElementById('symbol9').innerText = initialSymbols[2];
	const balanceElem = document.getElementById('balance');
	const initialBalance = users[currentUser]?.balance || 0;
    balanceElem.innerText = `balance: Rp.${formatCurrency(initialBalance)}`;
});
const symbols = ['🍒', '🍋', '🍊', '🍉', '🍇','⚡'];
const values = {
    '🍒': 1000,
    '🍋': 2000,
    '🍊': 3000,
    '🍉': 4000,
    '🍇': 5000,
	'⚡': 10000
};

const maxRecentSpins = 10;
let recentSpins = [];
let spinsSinceSpecial = 1;
const specialSymbol = '⚡';

let currentBetAmount = 0; 

let totalUsedBalance = 0;


function formatCurrency(value) {
    return value.toLocaleString('id-ID'); 
}

function getRandomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

const requiredBalanceForSpecialSymbol = 150000; 

function getSymbol() {
    if (totalUsedBalance >= requiredBalanceForSpecialSymbol && spinsSinceSpecial >= 5) {
        spinsSinceSpecial = 0;
        totalUsedBalance = 0; 
        return specialSymbol;
    }
    return getRandomSymbol();
}


function calculateWinnings(symbols, betAmount) {
    const uniqueSymbols = new Set(symbols);
    if (uniqueSymbols.size === 1) {
        const symbol = symbols[0];
        if (symbol === specialSymbol) {
            return values[specialSymbol] * 20;
        }
        return values[symbol] * 10;
    }
    return 0;
}
function spin(count, betAmount) {
    let totalWinnings = 0;
    let totalWinningSpins = 0;

    document.querySelectorAll('.symbol').forEach(symbol => {
        symbol.classList.add('spinning');
    });

    let delay = 0;
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const reel1Symbols = [
                getSymbol(),
                getSymbol(),
                getSymbol()
            ];
            const reel2Symbols = [
                getSymbol(),
                getSymbol(),
                getSymbol()
            ];
			const reel3Symbols = [
                getSymbol(),
                getSymbol(),
                getSymbol()
            ];

            spinsSinceSpecial++;
			totalUsedBalance += betAmount;

            const winnings1 = calculateWinnings(reel1Symbols, betAmount);
            const winnings2 = calculateWinnings(reel2Symbols, betAmount);
            const winnings3 = calculateWinnings(reel3Symbols, betAmount);

            const totalWinningsForThisSpin = winnings1 + winnings2 + winnings3;

            if (totalWinningsForThisSpin > 0) {
                totalWinnings += totalWinningsForThisSpin;
                totalWinningSpins += 1;
				showMessage(`You Win Rp.${formatCurrency(totalWinningsForThisSpin)} + ${formatCurrency(betAmount)} + ${formatCurrency(betAmount / 2)}!`);
            }

            document.getElementById('symbol1').innerText = reel1Symbols[0];
            document.getElementById('symbol2').innerText = reel1Symbols[1];
            document.getElementById('symbol3').innerText = reel1Symbols[2];
            document.getElementById('symbol4').innerText = reel2Symbols[0];
            document.getElementById('symbol5').innerText = reel2Symbols[1];
            document.getElementById('symbol6').innerText = reel2Symbols[2];
            document.getElementById('symbol7').innerText = reel3Symbols[0];
            document.getElementById('symbol8').innerText = reel3Symbols[1];
            document.getElementById('symbol9').innerText = reel3Symbols[2];

            recentSpins.push(...reel1Symbols, ...reel2Symbols, ...reel3Symbols);
            if (recentSpins.length > maxRecentSpins) {
                recentSpins = recentSpins.slice(recentSpins.length - maxRecentSpins);
            }          
        }, delay);
        delay += 950;
    }
    setTimeout(() => {
        document.querySelectorAll('.symbol').forEach(symbol => {
            symbol.classList.remove('spinning');
        });

        if (totalWinningSpins > 0) {
            totalWinnings += (betAmount * totalWinningSpins) + (betAmount / 2);
        }
        updateBalance(totalWinnings);

        if (totalWinningSpins > 0) {
             showMessage(`Win + Bonus Rp.${formatCurrency(totalWinnings)} (${totalWinningSpins} winnings by betting Rp.${formatCurrency(betAmount)})!`);
        }
    }, delay);
}

function showMessage(message) {
    const messageElem = document.getElementById('message');
    messageElem.innerText = message;
    messageElem.classList.remove('hidden');
    messageElem.classList.add('show');

    setTimeout(() => {
        messageElem.classList.remove('show');
        messageElem.classList.add('hide');
        setTimeout(() => {
            messageElem.classList.add('hidden');
            messageElem.classList.remove('hide');
        }, 500);
    }, 2000);
}

document.querySelectorAll('.bet-btn').forEach(button => {
    button.addEventListener('click', function() {
        const betAmount = parseInt(this.getAttribute('data-amount'), 10);

        if (currentBetAmount === betAmount) {
            this.classList.remove('active');
            currentBetAmount = 0;
            document.getElementById('spin-one').removeAttribute('data-bet');
            document.getElementById('spin-ten').removeAttribute('data-bet');
        } else {
            document.querySelectorAll('.bet-btn').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            currentBetAmount = betAmount;
            document.getElementById('spin-one').setAttribute('data-bet', betAmount);
            document.getElementById('spin-ten').setAttribute('data-bet', betAmount);
        }
        
        this.innerText = `bet Rp.${formatCurrency(betAmount)}`;
    });
});

document.getElementById('spin-one').addEventListener('click', function() {
    const count = 1;
    const betAmount = currentBetAmount || 10000;
    const balance = parseInt(document.getElementById('balance').innerText.replace('balance: Rp.', '').replace(/\./g, ''), 10);
    if (balance <= 0) {
        showMessage('balance runs out!');
        return;
    }
    const totalCost = betAmount * count;
    if (balance < totalCost) {
        showMessage('Insufficient Balance To Spin!');
        return;
    }
    updateBalance(-totalCost);
    spin(count, betAmount);
});

document.getElementById('spin-ten').addEventListener('click', function() {
    const count = 10;
    const betAmount = currentBetAmount || 10000;
    const balance = parseInt(document.getElementById('balance').innerText.replace('balance: Rp.', '').replace(/\./g, ''), 10);
    if (balance <= 0) {
        showMessage('balance runs out!');
        return;
    }
    const totalCost = betAmount * count;
    if (balance < totalCost) {
        showMessage('Insufficient Balance To Spin!');
        return;
    }
    updateBalance(-totalCost);
    spin(count, betAmount);
});
const defaultUsers = { //ID Users & Password
    'user1': {
		name: 'user nana',
        password: 'password1',
        balance: 1500000,
        role: 'user'
    },
    'user2': {
		name: 'Tobrut',
        password: 'password2',
        balance: 1500000,
        role: 'user'
    },
	'user3': {
		name: 'Duit Ni....',
        password: 'password3',
        balance: 1500000,
        role: 'user'
    }
};

const users = JSON.parse(localStorage.getItem('users')) || defaultUsers;

localStorage.setItem('users', JSON.stringify(users));

let currentUser = null;

function loadUsers() {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
        Object.assign(users, JSON.parse(storedUsers));
    }
}

document.getElementById('login-button').addEventListener('click', function() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loginMessageElem = document.getElementById('login-message');
	const users = JSON.parse(localStorage.getItem('users')) || {};
    console.log("Attempting login for username:", username); // Debug

    if (users[username] && users[username].password === password) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('loggedInUser', username);
		currentUser = username;
		document.getElementById('user-name').innerText = `${currentUser.name}`;
		document.getElementById('balance').innerText = `balance: Rp.${formatCurrency(users[currentUser].balance)}`;
        document.getElementById('login-form').style.display = 'none'; 
        document.getElementById('slot-machine').style.display = 'block';  
		updateUserInterface(username);
	} else {
        loginMessageElem.innerText = 'Wrong User ID or Password!';
    }
});
function updateUserInterface(username) {
    const users = JSON.parse(localStorage.getItem('users'));
    const user = users[username];
    if (user) {
        document.getElementById('balance').innerText = `balence: Rp.${formatCurrency(user.balance)}`;
        document.getElementById('user-name').innerText = `${user.name}`;
    }
}

function updateBalance(amount) {
    if (currentUser) {
        users[currentUser].balance += amount;
		if (users[currentUser].balance < 0) {
            users[currentUser].balance = 0;
        }
        document.getElementById('balance').innerText = `balance: Rp.${formatCurrency(users[currentUser].balance)}`;
        saveUsers(); 
        if (amount < 0) {
            totalUsedBalance += Math.abs(amount);
        }
    }
}

document.getElementById('toggle-user-password').addEventListener('click', function() {
    const passwordInput = document.getElementById('password');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        this.innerText = '🙈'; 
    } else {
        passwordInput.type = 'password';
        this.innerText = '👁️'; 
    }
});
document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const loggedInUser = localStorage.getItem('loggedInUser');

    if (isLoggedIn === 'true' && loggedInUser) {
		currentUser = loggedInUser;
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('slot-machine').style.display = 'block';
        updateUserInterface(loggedInUser);
    } else {
        document.getElementById('login-form').style.display = 'block';
        document.getElementById('slot-machine').style.display = 'none';
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const infoIcon = document.getElementById('info-icon');
    const infoPanel = document.getElementById('info-panel');
    const closeInfoPanel = document.getElementById('close-info-panel');

    infoIcon.addEventListener('click', function() {
        infoPanel.style.display = infoPanel.style.display === 'block' ? 'none' : 'block';
    });

    closeInfoPanel.addEventListener('click', function() {
        infoPanel.style.display = 'none';
    });
});document.addEventListener('DOMContentLoaded', function() {
    const infoIconslot = document.getElementById('info-icon-slot');
    const infoPanelslot = document.getElementById('info-panel-slot');
    const closeInfoPanelslot = document.getElementById('close-info-panel-slot');

    infoIconslot.addEventListener('click', function() {
        infoPanelslot.style.display = infoPanelslot.style.display === 'block' ? 'none' : 'block';
    });

    closeInfoPanelslot.addEventListener('click', function() {
        infoPanelslot.style.display = 'none';
    });
});

document.getElementById('logout-button').addEventListener('click', function() {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('slot-machine').style.display = 'none';
});

function saveUsers() {
    localStorage.setItem('users', JSON.stringify(users));
}

