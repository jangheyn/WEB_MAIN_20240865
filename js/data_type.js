let number = 5;
let str = "문자열 입력";
let prime = 1.5123;
let is_ok = true;
let is_not = false;
let undefi;
let empty = null;
console.log(undefi, empty);

const sym1 = Symbol('test');
let symbolVar1 = sym1;
const airline = ["비행기", 320, "airbus", ["V1", true]];
const obj1 = {};
const obj2 = {
    name: "John Doe",
    age: 30,
    isMale: true,
};
console.log(symbolVar1.toString());
console.log(obj1, obj2, airline);

const users = new Map();
users.set("user1", {
    id: 1, password: "password123",
});
users.set("user2", {
    id: 2, password: "password456",
});
for (const [username, user] of users) {
    console.log(`사용자 이름: ${username}`, `ID: ${user.id}`);
    console.log(`비밀번호: ${user.password}`);
}

const usernames = new Set();
usernames.add("user1");
usernames.add("user2");
for (const username of usernames) {
    console.log(`사용자 이름: ${username}`);
}
