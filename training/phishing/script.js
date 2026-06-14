// База данных сценариев фишинга (расширенная база)
const scenarios = [
    {
        subject: "Сброс пароля от корпоративного аккаунта",
        from: "support@company.com",
        body: `Здравствуйте! Мы заметили подозрительную активность. Пожалуйста, сбросьте ваш пароль, перейдя по ссылке: <a href="#">secure-login-portal.com</a>.`,
        isPhishing: true,
        explanation: "Подозрительная ссылка: домен не соответствует официальному домену компании."
    },
    {
        subject: "Ваш платеж не прошел",
        from: "bank.alerts@gmail.com", // Явный признак фишинга - публичный домен
        body: `Уважаемый клиент, ваш недавний платеж не был авторизован. Пожалуйста, войдите в свой аккаунт через эту форму для подтверждения: <a href="#">войти в личный кабинет</a>.`,
        isPhishing: true,
        explanation: "Письмо пришло с публичного почтового адреса (gmail.com), а не с официального домена банка."
    },
    {
        subject: "Обновление политики отпусков на 2025 год",
        from: "HR-Dep@ourcompany.corp",
        body: `Привет всем. Ознакомьтесь, пожалуйста, с новыми правилами отпусков в приложенном документе PDF. Это важно.`,
        isPhishing: false,
        explanation: "Это легитимное письмо от отдела кадров с внутренней информацией. Признаков фишинга нет."
    },
    {
    subject: "Официальное приглашение на ежегодную конференцию",
    from: "events@itconf.ru",
    body: `
        Добрый день!<br>
        Приглашаем Вас принять участие в ежегодной конференции IT-специалистов.<br>
        Подробности мероприятия находятся по адресу: <a href="#">it-conference.ru</a>.<br>
        До встречи!
    `,
    isPhishing: false,
    explanation: "Официальное приглашение на известное событие, признаков фишинга нет."
},
{
    subject: "Срочное уведомление о неоплаченных штрафах ГИБДД",
    from: "gibdd@inform.gov.ru",
    body: `
        Ваше транспортное средство имеет неоплаченные штрафы. Просим оплатить их незамедлительно.<br>
        Инструкция по оплате доступна по ссылке: <a href="#">pay-fines.ru</a>. 
    `,
    isPhishing: true,
    explanation: "Подделка официального письма, поддельный домен (pay-fines.ru), требование срочной оплаты штрафов."
},
{
    subject: "Внимание! Ваш почтовый ящик почти исчерпал лимит хранения",
    from: "support@mail.ru",
    body: `
        Осталось менее 10% свободного места на Вашем ящике.<br>
        Удалите ненужные письма или расширьте объем хранилища по ссылке: <a href="#">upgrade-storage.mail.ru</a>.
    `,
    isPhishing: true,
    explanation: "Использование фальшивого домена (upgrade-storage.mail.ru), попытки заставить пользователя перейти по сомнительным ссылкам."
},
{
    subject: "Вы выиграли поездку на Мальдивы!",
    from: "vacations@happy-travels.ru",
    body: `
        Вы стали счастливым обладателем бесплатной поездки на Мальдивы!<br>
        Узнать подробности и подтвердить поездку можно по ссылке: <a href="#">win-vacation.ru</a>.
    `,
    isPhishing: true,
    explanation: "Попытка привлечь внимание обещаниями бесплатного отдыха, наличие мошеннической ссылки."
},
{
    subject: "Уведомление о доставке посылки",
    from: "logistics@cdek.ru",
    body: `
        Ваша посылка доставлена на указанный адрес.<br>
        Следите за статусом доставки на официальном сайте: <a href="#">cdek.ru</a>.
    `,
    isPhishing: false,
    explanation: "Настоящее уведомление от службы доставки СДЭК, признаков фишинга нет."
},
{
    subject: "Ваш заказ отменен из-за нехватки товаров",
    from: "shop@ozon.ru",
    body: `
        К сожалению, Ваш заказ №XXXXXX был отменен из-за отсутствия товара на складе.<br>
        Детали отмены можно посмотреть в личном кабинете на сайте Ozon.
    `,
    isPhishing: false,
    explanation: "Корректное сообщение от известного российского ритейлера Ozon, признаки фишинга отсутствуют."
},
{
    subject: "Поздравляем с повышением квалификации!",
    from: "training@education-center.ru",
    body: `
        Сердечно поздравляем с успешным прохождением курса повышения квалификации!<br>
        Скачать сертификат можно по следующей ссылке: <a href="#">cert.education-center.ru</a>.
    `,
    isPhishing: false,
    explanation: "Реальное поздравительное письмо от образовательного центра, признаков мошенничества нет."
},
{
    subject: "Ваш компьютер заражен вирусом",
    from: "virus.alert@kaspersky.ru",
    body: `
        Наш антивирус обнаружил вредоносное ПО на вашем компьютере.<br>
        Выполните проверку системы, используя ссылку: <a href="#">check.kaspersky.ru</a>.
    `,
    isPhishing: true,
    explanation: "Попытка ввести в заблуждение пользователей ложным сообщением от Касперского, использование недостоверной ссылки."
},
{
    subject: "Поздравляем с победой в конкурсе фотографий",
    from: "photo.contest@artgallery.ru",
    body: `
        Поздравляем, Ваша фотография победила в конкурсе ArtGallery!<br>
        Информацию о получении награды смотрите по ссылке: <a href="#">awards.artgallery.ru</a>.
    `,
    isPhishing: false,
    explanation: "Подлинное письмо от галереи искусства, признаки мошенничества отсутствуют."
},
{
    subject: "Срочно! Банк требует подтверждение данных",
    from: "confirm@sberbank.ru",
    body: `
        Требуется ваше подтверждение персональных данных.<br>
        Подтвердите данные по ссылке: <a href="#">verify.sberbank.ru</a>.
    `,
    isPhishing: true,
    explanation: "Популярная схема фишинга с использованием имени крупного банка, целью которой является кража личной информации."
},
{
    subject: "Обновление профиля Google Account",
    from: "google.support@gmail.com",
    body: `
        Необходима актуализация Вашего профиля Google Account.<br>
        Актуализируйте профиль по ссылке: <a href="#">update-profile.google.ru</a>.
    `,
    isPhishing: true,
    explanation: "Фишинг-письмо, использующее название известной компании и создание впечатления официальной коммуникации."
},
{
    subject: "Поздравляем с получением кредита!",
    from: "credit@alfabank.ru",
    body: `
        По Вашей кредитной заявке принято положительное решение.<br>
        Подробности можно увидеть на странице личного кабинета: <a href="#">alfa-bank.ru</a>.
    `,
    isPhishing: false,
    explanation: "Настоящий ответ от Альфа-Банка, признаков фишинга нет."
},
{
    subject: "Важно! Аккаунт Facebook временно заблокирован",
    from: "fb.support@facebook.com",
    body: `
        Ваш аккаунт временно приостановлен ввиду нарушений правил.<br>
        Разблокировать аккаунт можно по ссылке: <a href="#">unlock.facebook.com</a>.
    `,
    isPhishing: true,
    explanation: "Типичный способ обмануть пользователей, заставляя поверить в блокировку аккаунта социальной сети."
},
{
    subject: "Поражение устройства Trojan Horse",
    from: "avast@antivirus.cz",
    body: `
        Наш антивирус Avast выявил троянского коня на вашем устройстве.<br>
        Удалите угрозу, следуя инструкции: <a href="#">clean.avast.com</a>.
    `,
    isPhishing: true,
    explanation: "Фиктивное предупреждение от антивируса Avast, направленное на получение доступа к устройству."
},
{
    subject: "Информационное письмо от Сбербанка",
    from: "info@sberbank.ru",
    body: `
        Сбербанк информирует о предстоящих изменениях в тарифах услуг.<br>
        Информация доступна на официальном сайте: <a href="#">sberbank.ru</a>.
    `,
    isPhishing: false,
    explanation: "Нормальная рассылка от Сбербанка, признаков мошенничества нет."
},
{
    subject: "Бесплатная доставка заказа № XXXX",
    from: "delivery@wildberries.ru",
    body: `
        Заказ № XXXX отправляется бесплатно!<br>
        Получите доставку по указанному адресу: <a href="#">track.wildberries.ru</a>.
    `,
    isPhishing: false,
    explanation: "Нормальное письмо от Wildberries, признаков фишинга нет."
},
{
    subject: "Получите зарплату досрочно",
    from: "payroll@yourcompany.ru",
    body: `
        Вашему вниманию предлагается досрочная выдача заработной платы.<br>
        Получить её можно по следующему адресу: <a href="#">early-payment.yourcompany.ru</a>.
    `,
    isPhishing: true,
    explanation: "Приманка для сотрудников компании с предложением раннего получения зарплаты."
},
{
    subject: "Важно! Технический сбой в службе безопасности",
    from: "sec-admin@yandex.ru",
    body: `
        Наблюдается критический технический сбой в системе безопасности.<br>
        Авторизуйтесь для восстановления безопасности: <a href="#">fix-security.yandex.ru</a>.
    `,
    isPhishing: true,
    explanation: "Мошенническое письмо, маскирующееся под техническую проблему Yandex."
},
    // Добавляйте сюда новые сценарии аналогично указанным выше примерам
    // (чем больше сценариев, тем лучше!)
  // 1. ИТ-безопасность (Смена пароля)
  {
    subject: "Срочно: Срок действия пароля истекает",
    from: "it-support@compnay.com",
    body: `
        Уважаемый сотрудник, срок действия вашего пароля истекает через 24 часа.<br>
        Чтобы избежать блокировки учетной записи, обновите пароль сейчас: <a href="#">update-pass-portal.net</a>.
    `,
    isPhishing: true,
    explanation: "Опечатка в домене отправителя (compnay.com вместо company.com), создание ложной срочности, подозрительная ссылка на сторонний ресурс."
  },

  // 2. HR (График отпусков)
  {
    subject: "График отпусков на следующий год",
    from: "hr@corp-portal-internal.ru",
    body: `
        Коллеги, прошу ознакомиться с утвержденным графиком отпусков.<br>
        Если вашего имени нет в списке, срочно свяжитесь с отделом кадров.<br>
        Документ: <a href="#">vacation_schedule_final.exe</a>
    `,
    isPhishing: true,
    explanation: "Файл имеет расширение .exe (исполняемый файл), хотя должен быть .xlsx или .pdf. Это попытка запустить вредоносное ПО."
  },

  // 3. Доставка (Ozon/Wildberries)
  {
    subject: "Ваш заказ задерживается",
    from: "delivery@ozon-logistics-support.ru",
    body: `
        Ваш заказ №492301 не может быть доставлен из-за ошибки в адресе.<br>
        Пожалуйста, уточните данные доставки и оплатите повторную обработку (1 руб.): <a href="#">ozon-track-fix.ru</a>.
    `,
    isPhishing: true,
    explanation: "Фишинг под видом маркетплейса. Неофициальный домен, требование ввести данные карты ради символической суммы."
  },

  // 4. Банк (Блокировка карты)
  {
    subject: "ВАЖНО: Подозрительная активность по карте",
    from: "security@sber-client-alert.com",
    body: `
        Мы зафиксировали попытку входа из другого региона. Ваша карта временно заблокирована.<br>
        Для разблокировки подтвердите личность: <a href="#">sber-id-verify.com</a>.
    `,
    isPhishing: true,
    explanation: "Использование стороннего домена (.com вместо .ru), запугивание блокировкой, ссылка не ведет на официальный сайт банка."
  },

  // 5. Руководитель (CEO Fraud)
  {
    subject: "Срочная задача",
    from: "ivan.director.ceo@gmail.com",
    body: `
        Привет, я сейчас на встрече, не могу говорить. <br>
        Срочно нужно оплатить счет для поставщика, это приоритет.<br>
        Пришли мне свои реквизиты или переведи по номеру карты ниже, компания возместит завтра.
    `,
    isPhishing: true,
    explanation: "Письмо якобы от директора, но с общедоступной почты (@gmail.com). Требование перевести деньги в обход стандартных процедур."
  },

  // 6. Облачное хранилище (Google Drive/Яндекс Диск)
  {
    subject: "Вам предоставили доступ к папке 'Зарплаты 2024'",
    from: "no-reply@goog1e-drive-share.net",
    body: `
        Пользователь Admin поделился с вами папкой.<br>
        Нажмите, чтобы открыть: <a href="#">Открыть документы</a>.
    `,
    isPhishing: true,
    explanation: "Спуфинг бренда (goog1e вместо google), попытка сыграть на любопытстве (зарплаты)."
  },

  // 7. Госуслуги / Налоги
  {
    subject: "Уведомление о налоговом вычете",
    from: "info@gosuslugi-payment.ru",
    body: `
        Вам начислен налоговый вычет в размере 15 000 руб.<br>
        Для получения средств укажите данные карты по ссылке: <a href="#">получить-выплату.рф</a>.
    `,
    isPhishing: true,
    explanation: "Обещание легких денег, ссылка на неофициальный сайт, имитация госпортала."
  },

  // 8. Социальные сети (ВКонтакте/Telegram)
  {
    subject: "Кто-то зашел в ваш аккаунт",
    from: "security@vk-login-support.ru",
    body: `
        Вход из г. Владивосток, устройство iPhone 14.<br>
        Это не вы? Срочно смените пароль: <a href="#">vk-change-pass.ru</a>.
    `,
    isPhishing: true,
    explanation: "Типичная схема кражи аккаунта. Ссылка ведет на фишинговую копию страницы входа."
  },

  // 9. Бухгалтерия (Счет)
  {
    subject: "Счет на оплату №8812 (Просрочено)",
    from: "billing@sklad-service.net",
    body: `
        Добрый день. Вы не оплатили услуги склада.<br>
        Во вложении счет и акт сверки. Прошу оплатить сегодня.<br>
        Вложение: <a href="#">invoice_scan.zip</a>
    `,
    isPhishing: true,
    explanation: "Архив .zip в письме от неизвестного контрагента часто содержит вирусы. Давление сроками."
  },

  // 10. Почта / IT (Квота ящика)
  {
    subject: "Ваш почтовый ящик переполнен",
    from: "admin@mail-server-quota.org",
    body: `
        Использовано 99% места. Входящие письма будут отклонены.<br>
        Увеличьте квоту бесплатно: <a href="#">upgrade-storage.com</a>.
    `,
    isPhishing: true,
    explanation: "Технический фишинг. Цель — украсть логин и пароль от корпоративной почты."
  },

  // 11. Zoom / Видеоконференции
  {
    subject: "Вы пропустили запланированную конференцию",
    from: "invites@zoom-meetings-web.com",
    body: `
        Конференция началась 5 минут назад.<br>
        Присоединиться сейчас: <a href="#">join-meeting-now.com</a>
    `,
    isPhishing: true,
    explanation: "Имитация приглашения Zoom. Домен zoom-meetings-web.com не является официальным."
  },

  // 12. Лотерея / Выигрыш
  {
    subject: "Поздравляем! Вы выиграли сертификат",
    from: "prize@promo-winner-2024.ru",
    body: `
        Ваш email был выбран случайным образом.<br>
        Заберите ваш сертификат на 50 000 руб. здесь: <a href="#">get-prize.ru</a>.
    `,
    isPhishing: true,
    explanation: "Классический спам/фишинг. Слишком хорошо, чтобы быть правдой. Неизвестный отправитель."
  },

  // 13. VPN / Безопасность
  {
    subject: "Обновление конфигурации VPN",
    from: "sysadmin@local-net-update.ru",
    body: `
        В связи с обновлением безопасности, старые настройки VPN перестанут работать.<br>
        Скачайте новый конфиг-файл: <a href="#">vpn-config.bat</a>.
    `,
    isPhishing: true,
    explanation: "Расширение .bat — это скрипт Windows, который может выполнить любые команды на вашем ПК."
  },

  // 14. Социальная инженерия (Фото)
  {
    subject: "Фотки с корпоратива!",
    from: "alexey.k@mail.ru",
    body: `
        Привет! Скинул фотки с пятницы, там ты тоже есть, посмотри))<br>
        Ссылка: <a href="#">dropbox-archive-photos.ru</a>
    `,
    isPhishing: true,
    explanation: "Личное письмо с общей почты, но с подозрительной ссылкой. Попытка сыграть на любопытстве."
  },

  // 15. Криптовалюта
  {
    subject: "Ваш кошелек будет заблокирован",
    from: "support@binance-verify-kyc.com",
    body: `
        Требуется повторная верификация KYC.<br>
        Если вы не пройдете ее за 24 часа, средства будут заморожены.<br>
        <a href="#">verify-wallet.com</a>
    `,
    isPhishing: true,
    explanation: "Угроза потери денег, фишинговый домен, нацеленность на кражу криптоактивов."
  },

  // 16. Благотворительность (Мошенничество)
  {
    subject: "Помощь пострадавшим",
    from: "help@fund-support-relief.org",
    body: `
        Мы собираем средства для помощи пострадавшим от наводнения.<br>
        Переведите любую сумму на криптокошелек или карту по ссылке: <a href="#">donate-now.org</a>.
    `,
    isPhishing: true,
    explanation: "Эксплуатация трагедии/жалости. Непроверенный фонд, просьба перевода на карту физлица."
  },

  // 17. Розыгрыш техники
  {
    subject: "Вам отправлен Apple iPhone 15",
    from: "shop@apple-store-russia-promo.ru",
    body: `
        Вы стали участником программы лояльности.<br>
        Оплатите доставку (350 руб) и заберите телефон.<br>
        <a href="#">pay-delivery.ru</a>
    `,
    isPhishing: true,
    explanation: "Схема 'оплатите только доставку'. Цель — данные банковской карты."
  },

  // 18. Документооборот (Docusign)
  {
    subject: "Просьба подписать: Договор №123",
    from: "docs@docusign-secure-files.net",
    body: `
        Вам отправлен документ на подпись.<br>
        Пожалуйста, просмотрите и подпишите: <a href="#">review-document.net</a>.
    `,
    isPhishing: true,
    explanation: "Имитация сервиса электронных подписей. Ссылка ведет на страницу перехвата пароля."
  },

  // 19. Microsoft 365
  {
    subject: "Действие требуется: Ошибка синхронизации",
    from: "ms-outlook@office365-alert-center.com",
    body: `
        5 писем не были доставлены из-за ошибки синхронизации.<br>
        Войдите, чтобы получить сообщения: <a href="#">outlook-web-login.com</a>.
    `,
    isPhishing: true,
    explanation: "Попытка украсть корпоративный аккаунт Microsoft. Домен похож, но не является официальным."
  },

  // 20. Легитимное письмо (Для проверки бдительности)
  {
    subject: "Еженедельный отчет",
    from: "analytics@company-internal.com",
    body: `
        Коллеги, направляю отчет за прошлую неделю.<br>
        Хорошего дня.<br>
        (Вложения отсутствуют, текст нейтральный)
    `,
    isPhishing: false, // Это НЕ фишинг
    explanation: "Это нормальное рабочее письмо. Адрес правильный, нет срочности, нет подозрительных ссылок или вложений."
  },
{
    subject: "Ваша подписка Netflix приостановлена",
    from: "billing@netflix-secure-payment.com",
    body: `
        Мы не смогли обработать автоматический платеж за следующий месяц.<br>
        Чтобы сохранить доступ к фильмам, обновите данные карты: <a href="#">netflix-renew.com</a>.
    `,
    isPhishing: true,
    explanation: "Классический фишинг сервисов подписки. Домен netflix-secure-payment.com не принадлежит Netflix."
  },
  {
    subject: "Судебная повестка №49221",
    from: "notification@sud-rf-online.org",
    body: `
        Вы вызываетесь в качестве ответчика по гражданскому делу.<br>
        Ознакомиться с материалами дела и датой слушания можно в личном кабинете: <a href="#">gos-sud-portal.org</a>.
    `,
    isPhishing: true,
    explanation: "Запугивание судом. Домен .org не используется государственными органами РФ (должен быть .gov.ru или .ru), ссылка подозрительная."
  },
  {
    subject: "Новое голосовое сообщение (0:34)",
    from: "whatsapp-web@notify-messages.net",
    body: `
        Вам пришло новое голосовое сообщение от пользователя "Мама".<br>
        Прослушать сейчас: <a href="#">listen-voice-msg.net</a>.
    `,
    isPhishing: true,
    explanation: "Мессенджеры не присылают аудиофайлы через сторонние сайты на почту. Попытка заставить скачать вредоносный файл или ввести логин."
  },
  {
    subject: "Безопасность: Вход с нового устройства",
    from: "security@telegram-alert-system.com",
    body: `
        Мы заблокировали попытку входа в ваш Telegram из Индонезии.<br>
        Если это были не вы, срочно закрепите устройство за вашим IP: <a href="#">telegram-secure-fix.com</a>.
    `,
    isPhishing: true,
    explanation: "Фишинговый домен, имитирующий Telegram. Реальные уведомления приходят внутри приложения, а не с адресов типа alert-system.com."
  },
  {
    subject: "Срочный запрос КП от генерального директора",
    from: "ceo.director.work@inbox.ru",
    body: `
        Михаил, я на переговорах, доступа к корпоративной почте нет.<br>
        Срочно перешли мне базу контактов наших VIP-клиентов в Excel.<br>
        Нужно для презентации прямо сейчас. Жду.
    `,
    isPhishing: true,
    explanation: "Атака CEO Fraud. Письмо от имени директора, но с бесплатного ящика (inbox.ru). Запрос конфиденциальных данных в обход правил."
  },
  {
    subject: "Ошибка доставки DHL: Требуется оплата пошлины",
    from: "track@dhl-express-customs.ru",
    body: `
        Ваша посылка задержана на таможне. Сумма пошлины составляет 140 руб.<br>
        Оплатите онлайн для выпуска груза: <a href="#">pay-dhl-customs.ru</a>.
    `,
    isPhishing: true,
    explanation: "Мошенничество с мелкими суммами. Ссылка ведет на форму кражи данных банковской карты."
  },
  {
    subject: "Возврат средств от магазина M.Video",
    from: "refund@mvideo-bonus-pay.ru",
    body: `
        Вам одобрен возврат средств за покупку №99221 в размере 12 990 руб.<br>
        Для зачисления средств на карту нажмите кнопку: <a href="#">получить-возврат.рф</a>.
    `,
    isPhishing: true,
    explanation: "Магазины возвращают деньги автоматически на ту же карту, не требуя перехода по ссылкам для 'получения' возврата."
  },
  {
    subject: "Эксклюзивный доступ к ChatGPT-5 Beta",
    from: "invites@openai-beta-test.io",
    body: `
        Вы выбраны для тестирования новой версии нейросети.<br>
        Войдите через свой Google-аккаунт, чтобы начать: <a href="#">openai-login-secure.io</a>.
    `,
    isPhishing: true,
    explanation: "Игра на хайпе вокруг ИИ. Неофициальный домен, цель — кража учетной записи Google."
  },
  {
    subject: "Обновление сертификата электронной подписи",
    from: "admin@nalog-keys-update.com",
    body: `
        Срок действия вашей ЭЦП истекает завтра. Работа с документами будет заблокирована.<br>
        Скачайте установщик нового сертификата: <a href="#">cert_installer.exe</a>.
    `,
    isPhishing: true,
    explanation: "Прямая ссылка на .exe файл (вирус). Письмо давит на страх остановки работы бизнеса."
  },
  {
    subject: "Кто-то просматривал ваш профиль LinkedIn",
    from: "premium@linkedin-viewers-alert.net",
    body: `
        3 человека из компаний "Газпром" и "Сбер" смотрели ваш профиль.<br>
        Узнайте, кто это: <a href="#">see-who-viewed.net</a>.
    `,
    isPhishing: true,
    explanation: "Подделка уведомлений соцсетей. Ссылка ведет на поддельную страницу входа в LinkedIn для кражи пароля."
  },
{
    subject: "Ваш электронный чек: Поездка Яндекс Такси",
    from: "taxi@yandex.ru",
    body: `
        Спасибо за поездку.<br>
        Сумма: 452 руб.<br>
        Карта: *4421.<br>
        Скачать чек можно в приложении или по ссылке: <a href="#">receipt.taxiyandex.ru</a>
    `,
    isPhishing: false,
    explanation: "Легитимный чек от Яндекса. Домен taxiyandex.ru является официальным доменом сервиса для чеков."
  },
  {
    subject: "Подтверждение бронирования столика",
    from: "info@restoclub.ru",
    body: `
        Вы забронировали столик в ресторане "Марио" на 20:00.<br>
        Адрес: ул. Ленина, 15.<br>
        Если планы изменятся, позвоните нам по телефону +7 (495) 000-00-00.
    `,
    isPhishing: false,
    explanation: "Информационное письмо. Нет ссылок, требующих ввода данных, нет вложений, отправитель соответствует сервису."
  },
  {
    subject: "Плановые технические работы 1 декабря",
    from: "support@yourcompany.com",
    body: `
        Коллеги, в субботу с 10:00 до 12:00 сервер 1С будет недоступен из-за обновлений.<br>
        Пожалуйста, завершите работу заранее.<br>
        Департамент ИТ.
    `,
    isPhishing: false,
    explanation: "Внутреннее уведомление от ИТ-отдела. Не требует никаких действий, носит чисто информационный характер."
  },
  {
    subject: "Выписка по карте за ноябрь",
    from: "no-reply@tinkoff.ru",
    body: `
        Ваша выписка за прошлый месяц сформирована.<br>
        Вы можете посмотреть её в мобильном приложении или в личном кабинете на сайте tinkoff.ru.<br>
        (Вложение: statement_nov.pdf)
    `,
    isPhishing: false,
    explanation: "Официальное уведомление банка. Письмо не содержит ссылок на вход, а предлагает зайти на сайт самостоятельно или открыть вложение PDF (что нормально для выписок)."
  },
  {
    subject: "Код подтверждения для входа",
    from: "service@gosuslugi.ru",
    body: `
        Ваш код подтверждения: 892-112.<br>
        Никому не сообщайте этот код.<br>
        Если вы не запрашивали код, просто проигнорируйте это письмо.
    `,
    isPhishing: false,
    explanation: "Стандартное письмо с 2FA кодом. Оно не просит перейти по ссылке, а только предоставляет код, который пользователь сам запросил."
  },
  {
    subject: "Приглашение в календарь: Встреча команды",
    from: "calendar-notification@google.com",
    body: `
        Пользователь ivan.ivanov@company.com пригласил вас на встречу "Еженедельный синк".<br>
        Дата: Вторник, 10:00.<br>
        Принять приглашение? (Ссылки "Да", "Нет", "Может быть")
    `,
    isPhishing: false,
    explanation: "Стандартное уведомление Google Calendar. Адрес отправителя и ссылки на действия ведут на домены Google."
  },
  {
    subject: "Статус заказа: Готов к выдаче",
    from: "inform@citilink.ru",
    body: `
        Ваш заказ №88123 готов к выдаче в магазине на ул. Гагарина.<br>
        Срок хранения: 3 дня.<br>
        Код получения: 1234.
    `,
    isPhishing: false,
    explanation: "Информационное сообщение от ритейлера. Не требует оплаты или ввода данных, содержит только информацию о заказе."
  },
  {
    subject: "Новая задача в Jira: BUG-421",
    from: "jira@automation.atlassian.com",
    body: `
        Вам назначена новая задача: "Исправить верстку на главной".<br>
        Приоритет: Высокий.<br>
        Перейти к задаче: <a href="#">company.atlassian.net/browse/BUG-421</a>
    `,
    isPhishing: false,
    explanation: "Автоматическое уведомление из таск-трекера. Домен atlassian.com является официальным для Jira."
  },
  {
    subject: "С днём рождения!",
    from: "hr-bot@company.com",
    body: `
        Уважаемый(ая) Имя!<br>
        Компания поздравляет вас с днем рождения! Желаем успехов и профессионального роста.<br>
        Ваш HR-отдел.
    `,
    isPhishing: false,
    explanation: "Внутреннее поздравительное письмо. Абсолютно безопасно, не требует действий."
  },
  {
    subject: "Изменение условий использования сервиса",
    from: "legal@vk.com",
    body: `
        Мы обновили Политику конфиденциальности.<br>
        Изменения вступают в силу с 1 января.<br>
        Читать полный текст: <a href="#">vk.com/legal/privacy</a>
    `,
    isPhishing: false,
    explanation: "Юридическое уведомление. Ссылка ведет на официальный домен vk.com, письмо носит уведомительный характер."
  }
];

// Переменные состояния игры
let currentGameStage = 1;
let correctAnswersCount = 0;
let selectedScenarios = []; // Хранит сценарии текущего раунда

// shuffleArray is loaded from ../../js/utils.js

// Выбор случайных сценариев для каждого запуска игры
function selectRandomScenarios(count) {
    const shuffledScenarios = [...scenarios]; // Копируем оригинальный массив
    shuffleArray(shuffledScenarios);          // Переставляем порядок
    return shuffledScenarios.slice(0, count); // Возвращаем первые N сценариев
}

// Лог события
function logEvent(message) {
    const log = document.getElementById('eventLog');
    const newEntry = document.createElement('p');
    newEntry.textContent = `> [${new Date().toLocaleTimeString()}] ${message}`;
    log.appendChild(newEntry);
    log.scrollTop = log.scrollHeight; // Прокрутка вниз
}

// Начало игры
function startGame() {
    document.getElementById('menuScreen').style.display = 'none';   // Скрываем меню
    document.getElementById('gameScreen').style.display = 'flex';  // Показываем экран игры
    document.getElementById('gameResults').style.display = 'none'; // Скрываем результаты
    document.querySelector('.email-viewer').style.display = 'block'; // <<< Добавлено: Показываем просмотрщик почты
    currentGameStage = 1;
    correctAnswersCount = 0;
    logEvent("Игра началась. Первый уровень загружается.");

    // Выбираем случайные сценарии для текущего раунда
    selectedScenarios = selectRandomScenarios(10); // Меняем число раундов тут
    loadStage(currentGameStage);
}

// Загружаем сцену для текущего этапа
function loadStage(stageNumber) {
    if (stageNumber > selectedScenarios.length) {
        endGame();
        return;
    }

    const currentScenario = selectedScenarios[stageNumber - 1];
    
    // !!! Также убедитесь, что при загрузке нового этапа они тоже включены !!!
    const emailActions = document.querySelector('.email-actions');
    if (emailActions) {
        Array.from(emailActions.children).forEach(button => button.disabled = false);
    }
    // -----------------------------------------------------------------------

    document.getElementById('stageCounter').textContent = `Этап #${stageNumber}. Ваш ход`;
    document.getElementById('correctAnswers').textContent = correctAnswersCount;
    document.getElementById('emailSubject').textContent = `Тема: ${currentScenario.subject}`;
    document.getElementById('emailFrom').textContent = `От: ${currentScenario.from}`;
    document.getElementById('emailBody').innerHTML = currentScenario.body;
}

// Пользователь сделал выбор (легитимное / фишинг)
function handleChoice(isPhishingGuess) {
    const currentScenario = selectedScenarios[currentGameStage - 1];
    const emailActions = document.querySelector('.email-actions');

    // Блокировка кнопок после выбора
    Array.from(emailActions.children).forEach(button => button.disabled = true);

    if (isPhishingGuess === currentScenario.isPhishing) {
        correctAnswersCount++; // Корректный ответ
        logEvent(`[Этап ${currentGameStage}]: ✔️ Правильно! ${currentScenario.explanation}`);
    } else {
        logEvent(`[Этап ${currentGameStage}]: ❌ Ошибка! ${currentScenario.explanation}`);
    }

    // Переходим на следующий этап спустя небольшую паузу
    setTimeout(() => {
        currentGameStage++;
        if (currentGameStage <= selectedScenarios.length) {
            loadStage(currentGameStage);
            Array.from(emailActions.children).forEach(button => button.disabled = false);
        } else {
            endGame();
        }
    }, 500);
}

function endGame() {
     document.getElementById('eventLog').innerHTML = '';

    // Скрываем email-viewer, когда игра заканчивается
    document.querySelector('.email-viewer').style.display = 'none';

    document.getElementById('gameResults').style.display = 'flex';
    // ... остальная часть функции endGame ...
    document.getElementById('resultTitle').textContent = "Симуляция завершена!";
    let resultMessage = `Вы завершили все этапы. Ваш итоговый результат: ${correctAnswersCount} из ${selectedScenarios.length} правильных ответов.`;
    if (correctAnswersCount === selectedScenarios.length) {
        resultMessage += " Отличная работа! Вы эксперт по кибербезопасности.";
        document.getElementById('resultTitle').style.color = '#00ff00';
    } else if (correctAnswersCount >= 7) {
        resultMessage += " Хороший результат. Вы знаете основы безопасности.";
        document.getElementById('resultTitle').style.color = '#00ffff';
    } else {
        resultMessage += " Вам стоит потренироваться ещё немного.";
        document.getElementById('resultTitle').style.color = '#ff0055';
    }

    document.getElementById('resultMessage').textContent = resultMessage;
    logEvent("Игра окончена.");
}
// Повторный старт игры
function resetGame() {
    logEvent("Игра перезапущена.");
    startGame();
}
