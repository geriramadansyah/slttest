document.addEventListener('DOMContentLoaded', function() {
    const Ida86 = 'adm';
    const aP87 = '5juta'; 

    document.getElementById('admin-login-button').addEventListener('click', function() {
        const username = document.getElementById('admin-username').value;
        const password = document.getElementById('admin-password').value;

        if (username === Ida86 && password === aP87) {
            document.getElementById('admin-login-form').style.display = 'none';
            document.getElementById('admin-dashboard').style.display = 'block';
            loadUsers();
        } else {
            document.getElementById('admin-login-message').innerText = 'invalid username or password!';
        }
    });

    document.getElementById('logout-button').addEventListener('click', function() {
        document.getElementById('admin-dashboard').style.display = 'none';
        document.getElementById('admin-login-form').style.display = 'block';
    });

    function loadUsers() {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    console.log(users);
    const userList = document.getElementById('user-list');
    userList.innerHTML = '';

    for (const [username, user] of Object.entries(users)) {
        const li = document.createElement('li');
        li.innerText = `${user.name} ${username} balance - Rp.${formatCurrency(user.balance)}`;
        li.addEventListener('click', function() {
            editUser(username);
        });
        userList.appendChild(li);
    }
}

function editUser(username) {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const user = users[username];
    if (user) {
        document.getElementById('edit-username').value = username;
        document.getElementById('edit-name').value = user.name;
        document.getElementById('edit-password').value = user.password;
        document.getElementById('edit-balance').value = user.balance;
        document.getElementById('edit-user-form').style.display = 'block';
    }
}

document.getElementById('save-user-button').addEventListener('click', function() {
    const username = document.getElementById('edit-username').value;
    const name = document.getElementById('edit-name').value;
    const password = document.getElementById('edit-password').value;
    const balance = parseInt(document.getElementById('edit-balance').value, 10);

    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[username]) {
        users[username].name = name;
        users[username].password = password;
        users[username].balance = balance;
        localStorage.setItem('users', JSON.stringify(users));
        loadUsers();
        document.getElementById('edit-user-form').style.display = 'none';
    }
});


    document.getElementById('cancel-edit-button').addEventListener('click', function() {
        document.getElementById('edit-user-form').style.display = 'none';
    });

    function formatCurrency(value) {
        return value.toLocaleString('id-ID');
    }
	saveUsers();
});
document.getElementById('toggle-admin-password').addEventListener('click', function() {
    const passwordInput = document.getElementById('admin-password');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        this.innerText = '🙈'; 
    } else {
        passwordInput.type = 'password';
        this.innerText = '👁️'; 
    }
});
document.getElementById('toggle-edit-password').addEventListener('click', function() {
    const passwordInput = document.getElementById('edit-password');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        this.innerText = '🙈'; 
    } else {
        passwordInput.type = 'password';
        this.innerText = '👁️'; 
    }
});
const users = JSON.parse(localStorage.getItem('users')) || defaultUsers;


for (const [username, user] of Object.entries(users)) {
    if (!user.name) {
        user.name = username === 'admin' ? 'Administrator' : `User ${username.slice(-1)}`;
        user.balance = username === 'admin' ? 'Administrator' : ` ${username.slice(-1)}`;
    }
}

localStorage.setItem('users', JSON.stringify(users));
