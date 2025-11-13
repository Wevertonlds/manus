import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
  host: process.env.DATABASE_URL?.split('@')[1]?.split('/')[0] || 'localhost',
  user: process.env.DATABASE_URL?.split('://')[1]?.split(':')[0] || 'root',
  password: process.env.DATABASE_URL?.split(':')[2]?.split('@')[0] || '',
  database: process.env.DATABASE_URL?.split('/').pop() || 'lobianco',
});

try {
  await connection.execute(
    'INSERT INTO settings (whatsapp, facebook, instagram) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE whatsapp=?, facebook=?, instagram=?',
    ['5511999999999', 'https://facebook.com/lobiancoinvestimentos', 'https://instagram.com/lobiancoinvestimentos', '5511999999999', 'https://facebook.com/lobiancoinvestimentos', 'https://instagram.com/lobiancoinvestimentos']
  );
  console.log('Settings inseridas com sucesso!');
} catch (error) {
  console.error('Erro ao inserir settings:', error);
} finally {
  await connection.end();
}
