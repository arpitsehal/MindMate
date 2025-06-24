const { getAll } = require('./database');

(async () => {
  const users = await getAll('SELECT id, email, points, streak, last_activity_date FROM users');
  console.log('User streak/points info:');
  users.forEach(user => {
    console.log(`ID: ${user.id}, Email: ${user.email}, Points: ${user.points}, Streak: ${user.streak}, Last Activity: ${user.last_activity_date}`);
  });
})(); 