/**
 * seed.js — начальные данные для MongoDB
 * Запуск: npm run seed
 * ВНИМАНИЕ: ОЧИЩАЕТ все коллекции перед заполнением!
 */
require('dotenv').config();
const mongoose    = require('mongoose');
const Pet         = require('./models/Pet');
const User        = require('./models/User');
const Application = require('./models/Application');
const { DonationGoal } = require('./models/Donation');

const SEED_PETS = [
  { name: 'Барсик',  species: 'cat',    breed: 'Сибирский',            age: 2, ageUnit: 'years',  gender: 'male',   size: 'medium', status: 'available', color: 'Рыжий',        vaccinated: true,  sterilized: true,  featured: true,  description: 'Ласковый и игривый кот, который обожает людей. Не против собак и детей. Очень умный — уже знает несколько команд.' },
  { name: 'Белла',   species: 'dog',    breed: 'Лабрадор-метис',       age: 3, ageUnit: 'years',  gender: 'female', size: 'large',  status: 'available', color: 'Золотистая',   vaccinated: true,  sterilized: true,  featured: true,  description: 'Добрейшая собака с бесконечным запасом любви. Отлично ладит с детьми, знает основные команды.' },
  { name: 'Пушок',   species: 'rabbit', breed: 'Карликовый баран',     age: 8, ageUnit: 'months', gender: 'male',   size: 'small',  status: 'available', color: 'Белый с серым',vaccinated: true,  sterilized: false, featured: false, description: 'Пушистый малыш с огромными ушами. Спокойный, ручной, любит когда его гладят.' },
  { name: 'Рекс',    species: 'dog',    breed: 'Немецкая овчарка',     age: 5, ageUnit: 'years',  gender: 'male',   size: 'large',  status: 'available', color: 'Чёрно-рыжий',  vaccinated: true,  sterilized: false, featured: true,  description: 'Умный и верный пёс с отличной дрессировкой. Знает более 20 команд.' },
  { name: 'Муся',    species: 'cat',    breed: 'Шотл. вислоухая',      age: 1, ageUnit: 'years',  gender: 'female', size: 'small',  status: 'reserved',  color: 'Серая',        vaccinated: true,  sterilized: true,  featured: false, description: 'Спокойная и флегматичная кошечка. Обожает лежать на коленях.' },
  { name: 'Тёма',    species: 'dog',    breed: 'Джек Рассел',          age: 4, ageUnit: 'months', gender: 'male',   size: 'small',  status: 'available', color: 'Бело-рыжий',   vaccinated: true,  sterilized: false, featured: false, description: 'Энергичный щенок, полный жизни! Быстро обучается, очень социальный.' },
  { name: 'Нюша',    species: 'cat',    breed: 'Беспородная',          age: 4, ageUnit: 'years',  gender: 'female', size: 'medium', status: 'available', color: 'Трёхцветная',  vaccinated: true,  sterilized: true,  featured: false, description: 'Трёхцветная красавица с характером! Самодостаточная кошка.' },
  { name: 'Граф',    species: 'dog',    breed: 'Доберман-метис',       age: 2, ageUnit: 'years',  gender: 'male',   size: 'large',  status: 'adopted',   color: 'Чёрный с рыжим',vaccinated: true, sterilized: true,  featured: false, description: 'Элегантный и умный пёс. Очень привязан к хозяину.' },
  { name: 'Клёпа',   species: 'cat',    breed: 'Мейн-кун',             age: 6, ageUnit: 'months', gender: 'female', size: 'medium', status: 'available', color: 'Пятнистая',    vaccinated: true,  sterilized: false, featured: true,  description: 'Королева с характером! Любит высоту и наблюдать за миром с книжного шкафа.' },
  { name: 'Бублик',  species: 'dog',    breed: 'Корги-метис',          age: 1, ageUnit: 'years',  gender: 'male',   size: 'small',  status: 'available', color: 'Рыжий',        vaccinated: true,  sterilized: false, featured: true,  description: 'Маленький, но гордый. Бублик — настоящая душа компании.' },
  { name: 'Снежка',  species: 'cat',    breed: 'Турецкая ангора',      age: 3, ageUnit: 'years',  gender: 'female', size: 'medium', status: 'available', color: 'Белая',        vaccinated: true,  sterilized: true,  featured: false, description: 'Белоснежная принцесса с голубыми глазами. Тихая и нежная.' },
  { name: 'Марс',    species: 'dog',    breed: 'Хаски-метис',          age: 2, ageUnit: 'years',  gender: 'male',   size: 'large',  status: 'available', color: 'Серо-белый',   vaccinated: true,  sterilized: true,  featured: false, description: 'Красавец с голубыми глазами. Энергичный и дружелюбный.' },
];

const SEED_USERS = [
  { name: 'Администратор', email: 'admin@shelter.ru',   password: 'admin123',   phone: '+7 (999) 000-00-00', role: 'admin'   },
  { name: 'Менеджер',      email: 'manager@shelter.ru', password: 'manager123', phone: '+7 (999) 000-00-01', role: 'manager' },
];

const SEED_GOALS = [
  { title: 'Лечение Барсика',      emoji: '🏥', description: 'Барсику нужна операция по удалению кисты. Помогите ему выздороветь!',          targetAmount: 25000, raisedAmount: 12400, active: true },
  { title: 'Новые вольеры',        emoji: '🏗️', description: 'Строим комфортные вольеры для крупных собак — просторные и тёплые.',            targetAmount: 80000, raisedAmount: 31000, active: true },
  { title: 'Корм на месяц',        emoji: '🍖', description: 'Ежемесячный сбор на качественный корм для всех 40+ питомцев приюта.',            targetAmount: 35000, raisedAmount: 35000, active: false },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB подключена');

    await Promise.all([
      Pet.deleteMany({}),
      User.deleteMany({}),
      Application.deleteMany({}),
      DonationGoal.deleteMany({}),
    ]);
    console.log('🗑️  Старые данные удалены');

    await Pet.insertMany(SEED_PETS);
    console.log(`🐾 Питомцев: ${SEED_PETS.length}`);

    for (const u of SEED_USERS) await new User(u).save();
    console.log(`👤 Пользователей: ${SEED_USERS.length}`);

    await DonationGoal.insertMany(SEED_GOALS);
    console.log(`💛 Целей сборов: ${SEED_GOALS.length}`);

    console.log('\n✅ База данных заполнена!');
    console.log('   admin@shelter.ru    / admin123');
    console.log('   manager@shelter.ru  / manager123');
  } catch (err) {
    console.error('❌ Ошибка:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
