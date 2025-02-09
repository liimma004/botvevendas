const TelegramBot = require('node-telegram-bot-api');
const token = '7839054741:AAGZO4sqDXiLPljvHPKk2fzi9niq3wm_48w'; // Substitua pelo seu token
const bot = new TelegramBot(token, { polling: true }); // Inicializa o bot

// Dados do produto
const productPhoto = 'https://i.postimg.cc/pV5KwYF0/500-X500-Capa.png'; // Link direto da imagem
const productDescription = `
Bienvenue dans mon monde 😈 Dans mon VIP vous trouverez :
• Sensuel. •Explicite
• Dim. • Jeux
• Fétiches. •Cosplay🔥
Êtes-vous prêt pour le meilleur contenu auquel vous ne vous êtes jamais abonné ?
😏À bientôt ! Cliquez sur /démarrer💦

• Fellation / orale
• Pénétration anale
• Pénétration vaginale
• Vidéos/photos de chatte
• Vidéos/photos de seins
• Vidéo de masturbation avec Squit
• Vidéos utilisant des accessoires érotiques

Valeurs 👇🏻
Quotidiennement 8 EUR 🇪🇺 🇺🇸 8,26 USD 🇦🇪 30,35
Hebdomadaire 16 EUR 🇪🇺 🇺🇸 16,52 USD 🇦🇪 60,69
Mensuel 64 EUR 🇪🇺 🇺🇸 66,10 USD 🇦🇪 242,76
À vie 250 EUR 🇪🇺 🇺🇸 258,19 USD 🇦🇪 948,30
`;

// Tabelas de preço
const prices = {
    EUR: {
        'TARIF JOURNALIER': '8€ EUR',
        'HEBDOMADAIRE': '16€ EUR',
        'MENSUEL': '64€ EUR',
        'PERMANENT': '250€ EUR',
    },
    USD: {
        'DAILY': '8.26 USD',
        'WEEKLY': '16.52 USD',
        'MONTHLY': '66.10 USD',
        'LIFETIME': '258.19 USD',
    },
    AED: {
        'DAILY': '30.35 AED',
        'WEEKLY': '60.69 AED',
        'MONTHLY': '242.76 AED',
        'LIFETIME': '948.30 AED',
    },
};

// Métodos de pagamento com dados bancários
const paymentMethods = {
    EUR: {
        IBAN: `
💳 **Dados Bancários para EUR 🇪🇺** 💳

• **IBAN**: BE85905272191606

⚠️ **ATENÇÃO** ⚠️
Você deve colocar o valor exato da sua compra. Não adianta colocar o valor errado, pois há verificação. Se isso acontecer, você não será adicionado ao VIP. Caso ocorra por engano, contate o suporte.
`,
    },
    USD: {
        'Swift/BIC': `
💳 **Dados Bancários para USD 🇺🇸** 💳

• **Swift/BIC**: TRWIUS35XXX

⚠️ **ATENÇÃO** ⚠️
Você deve colocar o valor exato da sua compra. Não adianta colocar o valor errado, pois há verificação. Se isso acontecer, você não será adicionado ao VIP. Caso ocorra por engano, contate o suporte.
`,
        Deposit: `
💳 **Dados Bancários para USD 🇺🇸** 💳

• **Deposit**: 331652012800460

⚠️ **ATENÇÃO** ⚠️
Você deve colocar o valor exato da sua compra. Não adianta colocar o valor errado, pois há verificação. Se isso acontecer, você não será adicionado ao VIP. Caso ocorra por engano, contate o suporte.
`,
        'Routing Number': `
💳 **Dados Bancários para USD 🇺🇸** 💳

• **Routing Number**: 084009519

⚠️ **ATENÇÃO** ⚠️
Você deve colocar o valor exato da sua compra. Não adianta colocar o valor errado, pois há verificação. Se isso acontecer, você não será adicionado ao VIP. Caso ocorra por engano, contate o suporte.
`,
    },
    AED: {
        IBAN: `
💳 **Dados Bancários para AED 🇦🇪** 💳

• **IBAN**: GB63TRWI23080110420713

⚠️ **ATENÇÃO** ⚠️
Você deve colocar o valor exato da sua compra. Não adianta colocar o valor errado, pois há verificação. Se isso acontecer, você não será adicionado ao VIP. Caso ocorra por engano, contate o suporte.
`,
    },
};

// Estado do usuário
let userState = {};

// Comando /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    userState[chatId] = {}; // Inicializa o estado do usuário

    // Envia a foto e a descrição do produto
    bot.sendPhoto(chatId, productPhoto, { caption: productDescription })
        .then(() => {
            // Mostra o teclado inline com a opção "Escolher Moeda"
            bot.sendMessage(chatId, 'Escolha uma opção:', {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'Escolher Moeda', callback_data: 'choose_currency' }],
                    ],
                },
            });
        })
        .catch((err) => {
            console.error('Erro ao enviar a foto:', err);
            bot.sendMessage(chatId, 'Desculpe, ocorreu um erro ao carregar a foto do produto.');
        });
});

// Escolha de moeda (teclado inline)
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;

    if (data === 'choose_currency') {
        bot.sendMessage(chatId, 'Escolha a moeda:', {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: 'EUR 🇪🇺', callback_data: 'currency_EUR' },
                        { text: 'USD 🇺🇸', callback_data: 'currency_USD' },
                        { text: 'AED 🇦🇪', callback_data: 'currency_AED' },
                    ],
                ],
            },
        });
    } else if (data.startsWith('currency_')) {
        const currency = data.split('_')[1]; // Extrai a moeda (EUR, USD, AED)
        userState[chatId].currency = currency;

        // Define a bandeira correta para a moeda
        const flag = {
            EUR: '🇪🇺',
            USD: '🇺🇸',
            AED: '🇦🇪',
        }[currency];

        const priceTable = Object.entries(prices[currency])
            .map(([plan, price]) => `• **${plan}** : ${price}`)
            .join('\n');

        const message = `${flag} **PRIX EN ${currency}** ${flag}\n\n${priceTable}`;

        bot.sendMessage(chatId, message, {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Escolher Plano', callback_data: 'choose_plan' }],
                    [{ text: 'Voltar', callback_data: 'choose_currency' }],
                ],
            },
        });
    } else if (data === 'choose_plan') {
        const currency = userState[chatId].currency;

        // Define a bandeira correta para a moeda
        const flag = {
            EUR: '🇪🇺',
            USD: '🇺🇸',
            AED: '🇦🇪',
        }[currency];

        // Cria botões inline para os planos
        const planButtons = Object.keys(prices[currency]).map((plan) => [
            { text: `${plan} ${flag}`, callback_data: `plan_${plan}` },
        ]);

        bot.sendMessage(chatId, `Escolha o plano ${flag}:`, {
            reply_markup: {
                inline_keyboard: [
                    ...planButtons,
                    [{ text: 'Voltar', callback_data: `currency_${currency}` }],
                ],
            },
        });
    } else if (data.startsWith('plan_')) {
        const plan = data.split('_')[1]; // Extrai o plano escolhido
        userState[chatId].plan = plan;

        const currency = userState[chatId].currency;
        const paymentOptions = Object.keys(paymentMethods[currency]).map((method) => [
            { text: method, callback_data: `payment_${method}` },
        ]);

        bot.sendMessage(chatId, 'Escolha o método de pagamento:', {
            reply_markup: {
                inline_keyboard: [
                    ...paymentOptions,
                    [{ text: 'Voltar', callback_data: 'choose_plan' }],
                ],
            },
        });
    } else if (data.startsWith('payment_')) {
        const method = data.split('_')[1]; // Extrai o método de pagamento
        const currency = userState[chatId].currency;

        const paymentInstruction = paymentMethods[currency][method];

        bot.sendMessage(chatId, paymentInstruction, { parse_mode: 'Markdown' });

        // Solicita o envio do comprovante
        bot.sendMessage(chatId, 'Por favor, envie o comprovante de pagamento no chat.', {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Enviar Comprovante', callback_data: 'send_receipt' }],
                    [{ text: 'Voltar', callback_data: `plan_${userState[chatId].plan}` }],
                ],
            },
        });
    }
});

// Receber comprovante
bot.on('document', (msg) => {
    const chatId = msg.chat.id;
    const currency = userState[chatId].currency;
    const plan = userState[chatId].plan;

    // Verifica se o valor do comprovante está correto
    const expectedAmount = prices[currency][plan];
    bot.sendMessage(chatId, `Comprovante recebido. Verificando o valor...`);

    // Simulação de verificação do valor (substitua por lógica real)
    setTimeout(() => {
        const isAmountCorrect = true; // Substitua por lógica real de verificação
        if (isAmountCorrect) {
            bot.sendMessage(chatId, 'Pagamento confirmado! Você será adicionado ao grupo VIP.');
            // Adicionar o usuário ao grupo VIP (substitua pelo ID do grupo)
            const groupId = -1001234567890; // ID do grupo VIP
            bot.addChatMember(groupId, chatId);
        } else {
            bot.sendMessage(chatId, 'Valor incorreto. Você não será adicionado ao VIP. Caso tenha ocorrido um engano, contate o suporte.');
        }
    }, 2000); // Simula um tempo de verificação
});

console.log('Bot está rodando...');